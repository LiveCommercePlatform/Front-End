import { useEffect, useState } from "react";
import { Mic, MicOff, Video, Monitor, Play, Square } from "lucide-react";
import { useBroadcasterWebRTC } from "@/hooks/useBroadcasterWebRTC";

export default function LiveBroadcaster({ roomId }: { roomId: string }) {
  const WS_URL = `ws://localhost:8080/ws/live-rooms/${roomId}/events`;

  const { videoRef, viewerCount, isStreaming, start, stop, toggleMute } =
    useBroadcasterWebRTC(roomId, WS_URL);

  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [mics, setMics] = useState<MediaDeviceInfo[]>([]);
  const [muted, setMuted] = useState(false);
  const [bitrate, setBitrate] = useState<number>(0);
  const [connection, setConnection] = useState("new");

  useEffect(() => {
    async function loadDevices() {
      const devices = await navigator.mediaDevices.enumerateDevices();

      setCameras(devices.filter((d) => d.kind === "videoinput"));
      setMics(devices.filter((d) => d.kind === "audioinput"));
    }

    loadDevices();
  }, []);

  // ---------------- connection state ----------------
  // useEffect(() => {
  //   if (!pc) return;

  //   const update = () => {
  //     setConnection(pc.connectionState);
  //   };

  //   pc.addEventListener("connectionstatechange", update);

  //   return () => pc.removeEventListener("connectionstatechange", update);
  // }, [pc]);

  // ---------------- bitrate ----------------
  // useEffect(() => {
  //   if (!pc) return;

  //   let lastBytes = 0;

  //   const interval = setInterval(async () => {
  //     const stats = await pc.getStats();

  //     stats.forEach((report:any) => {
  //       if (report.type === "outbound-rtp" && report.kind === "video") {
  //         const bytes = report.bytesSent;

  //         const diff = bytes - lastBytes;
  //         lastBytes = bytes;

  //         const kbps = (diff * 8) / 1000;
  //         setBitrate(Math.round(kbps));
  //       }
  //     });
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [pc]);

  const shareScreen = async () => {
    const screen = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    const screenTrack = screen.getVideoTracks()[0];

    // const sender = pc
    //   ?.getSenders()
    //   .find((s:any) => s.track?.kind === "video");

    // sender?.replaceTrack(screenTrack);
  };

  return (
    <div className="max-w-5xl mx-auto px-3 md:px-0 space-y-4">
      {/* header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg md:text-xl font-semibold">پخش زنده</h2>

        <div className="text-xs md:text-sm bg-black/5 px-3 py-1 rounded-full">
          👁 {viewerCount} تماشاگر
        </div>
      </div>

      {/* video */}
      <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-contain"
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
              onClick={start}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 rounded-xl border text-sm"
            >
              <Play size={16} />
              شروع
            </button>
          ) : (
            <button
              onClick={stop}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 rounded-xl border text-sm"
            >
              <Square size={16} />
              توقف
            </button>
          )}

          <button
            onClick={toggleMute}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border text-sm"
          >
            {muted ? <MicOff size={16} /> : <Mic size={16} />}
            {muted ? "با صدا" : "بی‌صدا"}
          </button>

          <button
            onClick={shareScreen}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border text-sm col-span-2 sm:col-span-1"
          >
            <Monitor size={16} />
            اشتراک صفحه
          </button>
        </div>
         {/* info */}
        <div className="flex justify-center md:justify-start gap-3 text-[11px] md:text-xs text-slate-600 order-2 md:order-1">
          <div className="bg-black/5 px-3 py-2 rounded-lg">
            Bitrate: <b className="text-slate-900">{bitrate} kbps</b>
          </div>

          <div className="bg-black/5 px-3 py-2 rounded-lg">
            Connection: <b className="text-slate-900">{connection}</b>
          </div>
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
