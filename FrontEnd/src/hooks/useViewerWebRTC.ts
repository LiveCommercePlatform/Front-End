import { useCallback, useEffect, useRef, useState } from "react";

export function useViewerWebRTC(roomId: string, wsUrl: string) {
  console.log("RENDERED")
  const ws = useRef<WebSocket | null>(null);
  const peer = useRef<RTCPeerConnection | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
const manualClose = useRef(false);

  // ‍‍state و ref
  // const [isConnected, setIsConnected] = useState(false);
  // const [reconnecting, setReconnecting] = useState(false);
  const viewerIdRef = useRef<string | null>(null);
  const reconnectingFlag = useRef(false);
  const reconnectAttempts = useRef(0);
  const iceQueue = useRef<RTCIceCandidateInit[]>([]);


  const resetPeer = useCallback(() => {
    if (peer.current) {
      peer.current.onicecandidate = null;
      peer.current.ontrack = null;
      peer.current.close();
    }
    peer.current = null;
    iceQueue.current = [];
  }, []);

  const createPeer = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
    });

    pc.ontrack = (e) => {
     console.log("track kind:", e.track.kind);
  console.log("streams:", e.streams);

  if (videoRef.current) {
    videoRef.current.srcObject = e.streams[0];

    setTimeout(() => {
      console.log("video srcObject", videoRef.current?.srcObject);
    }, 1000);
  }
    };

    pc.onicecandidate = (e) => {
      if (!e.candidate || !ws.current || !viewerIdRef.current) return;
      ws.current.send(
        JSON.stringify({
          type: "ice-candidate",
          roomId,
          sender: viewerIdRef.current,
          target: "broadcaster",
          data: e.candidate,
        })
      );
    };

    pc.onconnectionstatechange = () => {
      console.log("connectionState", pc.connectionState);
      if (
        pc.connectionState === "failed" ||
        pc.connectionState === "disconnected"
      ) {
        console.warn("Viewer: connection failed → attempting reconnect...");
        attemptReconnect();
      }
    };
    pc.oniceconnectionstatechange = () => {
  console.log("iceConnectionState", pc.iceConnectionState);
};

    peer.current = pc;
    return pc;
  }, [roomId]);

  /** ---------------------------
   ** WebSocket اتصال و reconnect ایمن
   ** -------------------------- */

  const attemptReconnect = useCallback(() => {
    if (reconnectingFlag.current) return;
    reconnectingFlag.current = true;

    // setReconnecting(true);
    reconnectAttempts.current += 1;

    const waitMs = Math.min(5000, reconnectAttempts.current * 800);

    setTimeout(() => {
      reconnectingFlag.current = false;
      // setReconnecting(false);
      connectWS();
    }, waitMs);
  }, []);

  const connectWS = useCallback(() => {
    console.log("Viewer: connecting to", wsUrl);
    resetPeer();

    // if (ws.current && ws.current.readyState === WebSocket.OPEN) {
    //   ws.current.close();
    // }
if (ws.current && ws.current.readyState <= 1) {
  return;
}
    const socket = new WebSocket(wsUrl);
    ws.current = socket;

    socket.onopen = () => {
      console.log("Viewer WS connected → sending join-viewer");
      reconnectAttempts.current = 0;
      socket.send(
        JSON.stringify({
          type: "join-viewer",
          roomId,
          sender: viewerIdRef.current ?? "",
        })
      );
    };

    socket.onclose = () => {
      console.warn("Viewer WS closed → reconnecting");
      // // setIsConnected(false);
      // attemptReconnect();
      if (manualClose.current) return;
  setTimeout(connectWS, 2000);
  console.log("-/-/-/-/")
    };

    socket.onerror = (err) => {
      console.error("Viewer WS error:", err);
      socket.close();
    };

    socket.onmessage = async (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        console.log("Viewer recv:", msg);

        switch (msg.type) {
          case "viewer-joined":
            viewerIdRef.current = msg.id;
            // setIsConnected(true);
            reconnectAttempts.current = 0;
            break;

          case "offer": {
            const pc = peer.current ?? createPeer();
            console.log("offer ricieved:",msg);
            try {
              await pc.setRemoteDescription(
                new RTCSessionDescription(msg.data)
              );
            } catch (err) {
              console.error("setRemoteDescription error", err);
              socket.close();
              return;
            }

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socket.send(
              JSON.stringify({
                type: "answer",
                roomId,
                sender: viewerIdRef.current,
                target: "broadcaster",
                data: answer,
              })
            );
            console.log("answer sent");

            while (iceQueue.current.length > 0) {
              const c = iceQueue.current.shift();
              if (c) await pc.addIceCandidate(c);
            }
            break;
          }

          case "ice-candidate":
            console.log("ice recieved")
              const candidate = new RTCIceCandidate(msg.data);

            if (!peer.current || !peer.current.remoteDescription) {
              iceQueue.current.push(candidate);
            } else {
              await peer.current.addIceCandidate(candidate);
            }
            break;

          case "broadcaster-left":
            console.log("Broadcaster left, tearing down viewer peer");
            resetPeer();
            break;

          case "viewer-count":
              break;

          default:
            console.log("Unhandled message type:", msg.type);
        }
      } catch (err) {
        console.error("WS message parse error:", err);
      }
    };
  }, [attemptReconnect, createPeer, resetPeer, roomId, wsUrl]);


  useEffect(() => {
    connectWS();
    // return () => {
    //   console.log("Viewer cleanup");
    //   ws.current?.close();
    //   resetPeer();
    // };
    return () => {
    console.log("Viewer cleanup");
    manualClose.current = true;
    ws.current?.close();
  };
  }, [connectWS, resetPeer]);

  return {
    videoRef,
    // isConnected,
    // reconnecting,
  };
}
