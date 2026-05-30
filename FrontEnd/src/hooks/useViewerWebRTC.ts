import { useEffect, useRef, useState, useCallback } from "react";

export interface UseViewerSFUOptions {
  signalingUrl: string;
  roomId: string;
  autoStart?: boolean;
}

export function useViewer({
  signalingUrl,
  roomId,
  autoStart = false,
}: UseViewerSFUOptions) {
  const [isStreaming, setIsStreaming] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const isManualClose = useRef<boolean>(false);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  const sendSignal = useCallback((type: string, payload: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }));
    }
  }, []);

  const cleanupPeerConnection = useCallback(() => {
  if (pcRef.current) {
    try {
      pcRef.current.ontrack = null;
      pcRef.current.onicecandidate = null;
      pcRef.current.oniceconnectionstatechange = null;
      pcRef.current.close();
    } catch (e) {
      console.error("[Viewer] Error while closing PC:", e);
    }
    pcRef.current = null;
  }

  pendingCandidatesRef.current = [];

  if (videoRef.current) {
    videoRef.current.srcObject = null;
  }

  setIsStreaming(false);
}, []);

  const flushPendingCandidates = useCallback(async () => {
    if (!pcRef.current || !pcRef.current.remoteDescription) return;

    while (pendingCandidatesRef.current.length > 0) {
      const candidate = pendingCandidatesRef.current.shift();
      if (!candidate) continue;

      try {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("[Viewer] Pending ICE candidate added.");
      } catch (err) {
        console.error(
          "[Viewer] Failed to add pending ICE candidate:",
          err,
          candidate,
        );
      }
    }
  }, []);

  const createPeerConnection = useCallback(() => {
    if (pcRef.current) return pcRef.current;

    console.log("[Viewer] Creating PeerConnection...");

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.ontrack = (event) => {
      console.log("[Viewer] Track received.");

      const stream = event.streams[0];
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current
          .play()
          .catch((e) => console.error("[Viewer] Play failed:", e));
        setIsStreaming(true);
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "ice_candidate",
            payload: event.candidate,
          }),
        );
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log(`[Viewer] ICE state: ${pc.iceConnectionState}`);

      if (
        ["failed", "disconnected", "closed"].includes(pc.iceConnectionState)
      ) {
        setIsStreaming(false);
      }
    };

    pcRef.current = pc;
    return pc;
  }, [sendSignal]);

  const connectWS = useCallback(() => {
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    isManualClose.current = false;
    const socket = new WebSocket(signalingUrl);
    wsRef.current = socket;

    socket.onopen = () => {
      if (reconnectTimeoutRef.current)
        clearTimeout(reconnectTimeoutRef.current);
      cleanupPeerConnection();
      createPeerConnection();
      socket.send(
        JSON.stringify({
          type: "join",
          payload: { room_id: roomId, role: "viewer" },
        }),
      );
    };

    socket.onmessage = async (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        console.log("V:", msg);
        switch (msg.type) {
          case "renegotiate":
            if (!pcRef.current) createPeerConnection();
            await pcRef.current!.setRemoteDescription(
              new RTCSessionDescription(msg.payload),
            );
            await flushPendingCandidates();
            const answer = await pcRef.current!.createAnswer();
            await pcRef.current!.setLocalDescription(answer);

            socket.send(JSON.stringify({ type: "answer", payload: answer }));
            console.log("[Viewer] Answer sent.");
            break;

          case "ice_candidate":
            if (!pcRef.current) createPeerConnection();
            if (pcRef.current?.remoteDescription) {
              try {
                await pcRef.current.addIceCandidate(
                  new RTCIceCandidate(msg.payload),
                );
                console.log("[Viewer] ICE candidate added.");
              } catch (err) {
                console.error(
                  "[Viewer] addIceCandidate error:",
                  err,
                  msg.payload,
                );
              }
            } else {
              console.log(
                "[Viewer] Remote description not set yet. Queueing ICE candidate.",
              );
              pendingCandidatesRef.current.push(msg.payload);
            }
            break;

          case "broadcaster-left":
            console.log("[Viewer] Broadcaster left the room.");
            setIsStreaming(false);
            cleanupPeerConnection();
            break;
        }
      } catch (e) {
        console.error("[Viewer] Message error:", e);
      }
    };

    socket.onclose = (e) => {
      wsRef.current = null;
      setIsStreaming(false);
      cleanupPeerConnection();

      if (!isManualClose.current) {
        if (reconnectTimeoutRef.current)
          clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = setTimeout(connectWS, 3000);
      }
    };

    socket.onerror = (err) => {
      socket.close();
    };
  }, [signalingUrl, roomId, createPeerConnection, sendSignal]);

  const start = useCallback(() => {
    connectWS();
  }, [connectWS]);

  const stop = useCallback(() => {
    isManualClose.current = true;
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);

    sendSignal("leave", { room_id: roomId, role: "viewer" });
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setTimeout(() => {
      if (wsRef.current) {
        wsRef.current.close(1000);
        wsRef.current = null;
      }
    }, 100);
  }, [roomId, sendSignal]);

  useEffect(() => {
    if (autoStart) start();
    return () => {
      //  stop();
    };
  }, [autoStart, start, stop]);

  return { videoRef, isStreaming, start, stop };
}
