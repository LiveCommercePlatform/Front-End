import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, Monitor, Play, Square } from "lucide-react";
import { useBroadcaster } from "@/hooks/useBroadcasterWebRTC";
import { apiFetch } from "@/lib/api";
import toast from "react-hot-toast";

export default function LiveBroadcaster({
  roomId,
  status,
}: {
  roomId: string;
  status: string;
}) {
  const WS_URL = `ws://localhost:8080/ws/live-rooms/${roomId}/signaling`;

  const {
    localStream,
    isStreaming,
    start,
    stop,
    toggleMic,
    isMicOn,
    isScreenSharing,
    toggleScreenShare,
  } = useBroadcaster({
    signalingUrl: WS_URL,
    roomId: roomId,
    autoStart: false,
    mediaConstraints: {
      video: true,
      audio: true,
    },
  });
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [mics, setMics] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    async function loadDevices() {
      const devices = await navigator.mediaDevices.enumerateDevices();

      setCameras(devices.filter((d) => d.kind === "videoinput"));
      setMics(devices.filter((d) => d.kind === "audioinput"));
    }

    loadDevices();
  }, []);
  const endStream = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await apiFetch(`/live-rooms/${id}/end`, {
        method: "POST",
      });

      if (!res.ok) {
        let errorMsg = "خطا در پایان استریم";
        try {
          const data = await res.json();
          errorMsg = data?.error || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      toast.success("استریم پایان یافت");
      return true;
    } catch (e: any) {
      toast.error(e?.message ?? "خطا در برقراری ارتباط");
      return false;
    }
  }, []);

  const handleStopStream = async () => {
    const isEndedOnBackend = await endStream(roomId);
    if (isEndedOnBackend) {
      stop();
    }
  };
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);
  return (
    <div className="max-w-5xl mx-auto px-3 md:px-0 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg md:text-xl font-semibold">پخش زنده</h2>
      </div>

      <div className="relative bg-black rounded-xl overflow-hidden w-full aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        {isStreaming && (
          <div className="absolute top-3 left-3 flex items-center gap-2 text-white text-xs px-3 py-1 rounded-full bg-red-600">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            زنده
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="grid grid-cols-2 sm:flex gap-2 md:gap-3 order-1 md:order-2">
          {!isStreaming ? (
            <button
              disabled={status == "ended"}
              onClick={start}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border text-sm transition 
             bg-emerald-500 text-white
             disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Play size={16} />
            </button>
          ) : (
            <button
              disabled={status == "ended"}
              onClick={handleStopStream}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 rounded-xl border text-sm"
            >
              <Square size={16} />
            </button>
          )}

          <button
            disabled={status == "ended"}
            onClick={toggleMic}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border text-sm transition
           disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isMicOn ? <MicOff size={16} /> : <Mic size={16} />}
          </button>

          <button
            disabled={status === "ended" || !isStreaming}
            onClick={toggleScreenShare}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl border text-sm transition
    ${isScreenSharing ? "bg-blue-100 border-blue-500 text-blue-600" : ""}
    disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            <Monitor size={16} />
          </button>
        </div>
      </div>

      {/* devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div>
          <label className="text-xs md:text-sm text-slate-600">دوربین</label>
          <select className="w-full mt-1 p-2 text-sm border rounded-lg">
            {cameras.map((cam) => (
              <option key={cam.deviceId}>{cam.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs md:text-sm text-slate-600">میکروفن</label>
          <select className="w-full mt-1 p-2 text-sm border rounded-lg">
            {mics.map((mic) => (
              <option key={mic.deviceId}>{mic.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
