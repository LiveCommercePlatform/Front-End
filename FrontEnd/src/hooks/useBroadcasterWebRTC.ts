import { useEffect, useRef, useState, useCallback } from "react";

export function useBroadcasterWebRTC(roomId: string, wsUrl: string) {
  const ws = useRef<WebSocket | null>(null);
  const peers = useRef<Map<string, RTCPeerConnection>>(new Map());
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [viewerCount, setViewerCount] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const iceQueue = useRef<RTCIceCandidateInit[]>([]);
  const connectedViewers = useRef<Set<string>>(new Set());

  const createPeer = useCallback(
    (viewerId: string) => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
      });

      pc.onicecandidate = (e) => {
        if (!e.candidate || !ws.current) return;

        ws.current.send(
          JSON.stringify({
            type: "ice-candidate",
            roomId,
            sender: "broadcaster",
            target: viewerId,
            data: e.candidate,
          }),
        );
      };

      pc.onconnectionstatechange = () => {
        console.log("viewer", viewerId, "state:", pc.connectionState);

        if (
          pc.connectionState === "failed" ||
          pc.connectionState === "disconnected"
        ) {
          pc.close();
          peers.current.delete(viewerId);
        }
      };

      peers.current.set(viewerId, pc);

      return pc;
    },
    [roomId],
  );

  const streamRef = useRef<MediaStream | null>(null);

  const start = useCallback(async () => {
    if (isStreaming || !videoRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;

      setIsStreaming(true);
    } catch (err) {
      console.error("Failed to start broadcasting:", err);
    }
  }, [isStreaming]);

  const stop = useCallback(() => {
  setIsStreaming(false);
  peers.current.forEach((pc) => pc.close());
  peers.current.clear();
  if (streamRef.current) {
    streamRef.current.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }
  if (videoRef.current) {
    videoRef.current.srcObject = null;
  }
}, []);


  const negotiateWithViewer = useCallback(
    async (viewerId: string) => {
      if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
      if (!streamRef.current) return;

      const pc = createPeer(viewerId);

      streamRef.current.getTracks().forEach((t) => {
        pc.addTrack(t, streamRef.current!);
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      ws.current.send(
        JSON.stringify({
          type: "offer",
          roomId,
          sender: "broadcaster",
          target: viewerId,
          data: offer,
        }),
      );
    },
    [roomId, createPeer],
  );

  useEffect(() => {
    const socket = new WebSocket(wsUrl);
    ws.current = socket;

    socket.onopen = () => {
      console.log("Broadcaster WS connected");
      socket.send(
        JSON.stringify({
          type: "join-broadcaster",
          roomId,
          sender: "broadcaster",
        }),
      );
    };

    socket.onmessage = async (ev) => {
      const msg = JSON.parse(ev.data);
      console.log("Broadcaster recv:", msg);

      switch (msg.type) {
        case "viewer-joined": {
          const viewerId = msg.sender || msg.id;
          connectedViewers.current.add(viewerId);
          await negotiateWithViewer(viewerId);
          console.log("offer sent")
          break;
        }

        case "answer": {
          const viewerId = msg.sender;
          const pc = peers.current.get(viewerId);

          if (!pc) {
            console.warn("Peer not found for viewer:", viewerId);
            return;
          }

          await pc.setRemoteDescription(new RTCSessionDescription(msg.data));

          while (iceQueue.current.length > 0) {
            const c = iceQueue.current.shift();
            if (c) await pc.addIceCandidate(c);
          }

          break;
        }

        case "ice-candidate": {
          const viewerId = msg.sender;
          const pc = peers.current.get(viewerId);

          if (!pc) return;

          const candidate = new RTCIceCandidate(msg.data);

          if (!pc.remoteDescription) {
            iceQueue.current.push(candidate);
          } else {
            await pc.addIceCandidate(candidate);
          }

          break;
        }

        case "viewer-left": {
          connectedViewers.current.delete(msg.sender || msg.viewerId);
          break;
        }

        case "viewer-count": {
          setViewerCount(msg.count ?? connectedViewers.current.size);
          break;
        }

        case "broadcaster-left": {
          console.warn("Server requested broadcaster stop");
          stop();
          break;
        }

        default:
          console.log("Unhandled broadcast msg type:", msg.type);
      }
    };

    socket.onclose = () => {
      console.warn("Broadcaster WS closed");
      stop();
    };

    socket.onerror = (err) => {
      console.error("Broadcaster WS error:", err);
      socket.close();
    };

    return () => {
      console.log("Broadcaster cleanup");
      stop();
      socket.close();
      ws.current = null;
    };
  }, [roomId, wsUrl, negotiateWithViewer, createPeer, stop]);

  return {
    videoRef,
    viewerCount,
    isStreaming,
    start,
    stop,
  };
}
