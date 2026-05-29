import { useEffect, useRef, useState, useCallback } from "react";
type SFURole = "host" | "viewer";

type SignalMessage = {
  type: string;
  payload: any;
};

type UseBroadcasterSFUOptions = {
  signalingUrl: string;
  roomId: string;
  autoStart?: boolean;
  mediaConstraints?: MediaStreamConstraints;
};

type UseBroadcasterSFUReturn = {
  localStream: MediaStream | null;
  isStreaming: boolean;
  isCameraOn: boolean;
  isMicOn: boolean;
  start: () => Promise<void>;
  stop: () => void;
  toggleCamera: () => void;
  toggleMic: () => void;
  switchCamera: (deviceId: string) => Promise<void>;
  switchMic: (deviceId: string) => Promise<void>;
  isScreenSharing: boolean;
  toggleScreenShare: () => Promise<void>;
};

export function useBroadcaster(
  options: UseBroadcasterSFUOptions,
): UseBroadcasterSFUReturn {
  const {
    signalingUrl,
    autoStart = false,
    mediaConstraints = {
      audio: true,
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 },
      },
    },
  } = options;
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const makingOfferRef = useRef(false);
  const ignoreOfferRef = useRef(false);
  const isSettingRemoteAnswerPendingRef = useRef(false);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  // ---- کمک: ارسال پیام سیگنالینگ ----
  const sendSignal = useCallback((type: string, payload: any) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    const msg: SignalMessage = { type, payload };
    ws.send(JSON.stringify(msg));
  }, []);

  // ---- ساخت PeerConnection ----
  const createPeerConnection = useCallback(() => {
    if (pcRef.current) {
      return pcRef.current;
    }

    const pc = new RTCPeerConnection({
      iceServers: [
        // اگر STUN/TURN خاصی داری اینجا تعریف کن
        { urls: "stun:stun.l.google.com:19302" },
      ],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal(
          "ice_candidate",
          event.candidate.toJSON?.() ?? event.candidate,
        );
      }
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      if (
        state === "failed" ||
        state === "disconnected" ||
        state === "closed"
      ) {
        // در بک‌اند هم برای host، endLiveRoomFromSFU صدا می‌شود.
        // در فرانت می‌توانیم UI را آپدیت کنیم.
      }
    };

    pc.onnegotiationneeded = async () => {
      try {
        makingOfferRef.current = true;
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        sendSignal("offer", pc.localDescription);
      } catch (err) {
        console.error("[SFU host] onnegotiationneeded error:", err);
      } finally {
        makingOfferRef.current = false;
      }
    };

    pcRef.current = pc;
    return pc;
  }, [sendSignal]);

  const connectSignaling = useCallback(async () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return wsRef.current;
    }

    return new Promise<WebSocket>((resolve, reject) => {
      const ws = new WebSocket(signalingUrl);

      ws.onopen = () => {
        sendSignal("join", { role: "host" });
        resolve(ws);
      };

      ws.onerror = (e) => {
        console.error("[SFU host] WebSocket error", e);
        reject(e);
      };

      ws.onclose = (ev) => {
        console.warn(
          "[SFU host] WebSocket closed",
          "code=",
          ev.code,
          "reason=",
          ev.reason,
          "wasClean=",
          ev.wasClean,
        );
      };

      ws.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data) as SignalMessage;
          const pc = pcRef.current;

          if (!pc) {
            console.warn("[SFU host] No PC yet for message", msg);
            return;
          }

          switch (msg.type) {
            case "answer": {
              const answer = msg.payload;
              const desc = new RTCSessionDescription(answer);

              if (isSettingRemoteAnswerPendingRef.current) {
                // در الگوی perfect negotiation معمولاً چنین فلگی داریم
              }

              await pc.setRemoteDescription(desc);
              break;
            }
            case "offer": {
              const offer = msg.payload;
              const desc = new RTCSessionDescription(offer);

              const readyForOffer =
                !makingOfferRef.current &&
                (pc.signalingState === "stable" ||
                  isSettingRemoteAnswerPendingRef.current);

              ignoreOfferRef.current = !readyForOffer;
              if (ignoreOfferRef.current) {
                return;
              }

              await pc.setRemoteDescription(desc);
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              sendSignal("answer", pc.localDescription);
              break;
            }
            case "ice_candidate": {
              const candidate = new RTCIceCandidate(msg.payload);
              await pc.addIceCandidate(candidate);
              break;
            }
            case "error": {
              break;
            }
            default:
              console.log("[SFU host] Unknown signal type:", msg);
          }
        } catch (err) {}
      };

      wsRef.current = ws;
    });
  }, [sendSignal]);

  const getLocalMedia = useCallback(async () => {
    if (localStreamRef.current) {
      return localStreamRef.current;
    }

    const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);

    localStreamRef.current = stream;
    setLocalStream(stream);
    setIsCameraOn(stream.getVideoTracks().some((t) => t.enabled));
    setIsMicOn(stream.getAudioTracks().some((t) => t.enabled));
    return stream;
  }, [mediaConstraints]);

  const start = useCallback(async () => {
    if (isStreaming) return;

    try {
      await connectSignaling();
      const pc = createPeerConnection();
      const stream = await getLocalMedia();
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });
      setIsStreaming(true);
    } catch (err) {
      setIsStreaming(false);
    }
  }, [connectSignaling, createPeerConnection, getLocalMedia, isStreaming]);

  const stop = useCallback(() => {
    setIsStreaming(false);
    sendSignal("leave", { role: "host" });

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        try {
          track.enabled = false;
          track.stop();
        } catch (e) {
          console.error("Error stopping track:", e);
        }
      });
      localStreamRef.current = null;
      setLocalStream(null);
    }

    if (pcRef.current) {
      pcRef.current.getSenders().forEach((s) => {
        if (s.track) {
          try {
            s.track.stop();
          } catch {}
        }
      });

      pcRef.current.close();
      pcRef.current = null;
    }

    setTimeout(() => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    }, 200);
  }, [sendSignal]);

  const toggleCamera = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;

    const videoTracks = stream.getVideoTracks();
    if (!videoTracks.length) return;

    const newState = !videoTracks[0].enabled;
    videoTracks.forEach((t) => (t.enabled = newState));
    setIsCameraOn(newState);
  }, []);

  const toggleMic = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;

    const audioTracks = stream.getAudioTracks();
    if (!audioTracks.length) return;

    const newState = !audioTracks[0].enabled;
    audioTracks.forEach((t) => (t.enabled = newState));
    setIsMicOn(newState);
  }, []);

  const switchCamera = useCallback(
    async (deviceId: string) => {
      const oldStream = localStreamRef.current;
      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          ...((mediaConstraints.video as MediaTrackConstraints) || {}),
          deviceId: { exact: deviceId },
        },
      };

      const newVideoStream =
        await navigator.mediaDevices.getUserMedia(constraints);

      const newVideoTrack = newVideoStream.getVideoTracks()[0];

      if (!newVideoTrack) return;

      const pc = pcRef.current;
      if (!pc) return;

      const senders = pc.getSenders().filter((s) => s.track?.kind === "video");

      if (senders.length) {
        await senders[0].replaceTrack(newVideoTrack);
      } else if (oldStream) {
        pc.addTrack(newVideoTrack, oldStream);
      }

      if (oldStream) {
        oldStream.getVideoTracks().forEach((t) => t.stop());
        oldStream.removeTrack(oldStream.getVideoTracks()[0]);
        oldStream.addTrack(newVideoTrack);
        setLocalStream(oldStream);
      } else {
        localStreamRef.current = newVideoStream;
        setLocalStream(newVideoStream);
      }
    },
    [mediaConstraints.video],
  );

  const switchMic = useCallback(
    async (deviceId: string) => {
      const oldStream = localStreamRef.current;
      const constraints: MediaStreamConstraints = {
        audio: {
          ...((mediaConstraints.audio as MediaTrackConstraints) || {}),
          deviceId: { exact: deviceId },
        },
        video: false,
      };

      const newAudioStream =
        await navigator.mediaDevices.getUserMedia(constraints);

      const newAudioTrack = newAudioStream.getAudioTracks()[0];

      if (!newAudioTrack) return;

      const pc = pcRef.current;
      if (!pc) return;

      const senders = pc.getSenders().filter((s) => s.track?.kind === "audio");

      if (senders.length) {
        await senders[0].replaceTrack(newAudioTrack);
      } else if (oldStream) {
        pc.addTrack(newAudioTrack, oldStream);
      }

      if (oldStream) {
        oldStream.getAudioTracks().forEach((t) => t.stop());
        oldStream.removeTrack(oldStream.getAudioTracks()[0]);
        oldStream.addTrack(newAudioTrack);
        setLocalStream(oldStream);
      } else {
        localStreamRef.current = newAudioStream;
        setLocalStream(newAudioStream);
      }
    },
    [mediaConstraints.audio],
  );
  const cameraTrackRef = useRef<MediaStreamTrack | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const toggleScreenShare = useCallback(async () => {
    const pc = pcRef.current;
    const stream = localStreamRef.current;
    if (!pc || !stream) return;

    try {
      if (!isScreenSharing) {
        // شروع اشتراک صفحه
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false, // معمولاً برای اسکرین شِیر صدا لازم نیست یا جدا هندل می‌شود
        });
        const screenTrack = screenStream.getVideoTracks()[0];

        // ذخیره ترک فعلی دوربین برای بازگشت
        cameraTrackRef.current = stream.getVideoTracks()[0];

        // جایگزینی در PeerConnection
        const senders = pc
          .getSenders()
          .filter((s) => s.track?.kind === "video");
        if (senders.length > 0) {
          await senders[0].replaceTrack(screenTrack);
        }

        // آپدیت کردن استریم محلی برای نمایش در Preview
        stream.removeTrack(cameraTrackRef.current);
        stream.addTrack(screenTrack);

        setIsScreenSharing(true);

        // هندل کردن زمانی که کاربر از طریق نوار ابزار خودِ مرورگر (Stop Sharing) را می‌زند
        screenTrack.onended = () => {
          stopScreenSharing(screenTrack);
        };
      } else {
        // توقف دستی اشتراک صفحه و بازگشت به دوربین
        const screenTrack = stream.getVideoTracks()[0];
        await stopScreenSharing(screenTrack);
      }
    } catch (err) {
      console.error("Screen share error:", err);
    }
  }, [isScreenSharing]);

  // تابع کمکی برای بازگشت به دوربین
  const stopScreenSharing = useCallback(
    async (screenTrack: MediaStreamTrack) => {
      const pc = pcRef.current;
      const stream = localStreamRef.current;
      const camTrack = cameraTrackRef.current;

      if (pc && stream && camTrack) {
        const senders = pc
          .getSenders()
          .filter((s) => s.track?.kind === "video");
        if (senders.length > 0) {
          await senders[0].replaceTrack(camTrack);
        }

        stream.removeTrack(screenTrack);
        stream.addTrack(camTrack);
        screenTrack.stop(); // آزاد کردن منابع اسکرین شِیر

        setIsScreenSharing(false);
        cameraTrackRef.current = null;
      }
    },
    [],
  );

  useEffect(() => {
    if (autoStart) {
      start().catch((e) => console.error("[SFU host] autoStart error", e));
    }
    return () => {
      // stop();
    };
  }, [autoStart, start, stop]);

  return {
    localStream,
    isStreaming,
    isCameraOn,
    isMicOn,
    isScreenSharing,

    start,
    stop,
    toggleCamera,
    toggleMic,
    switchCamera,
    switchMic,
    toggleScreenShare,
  };
}
