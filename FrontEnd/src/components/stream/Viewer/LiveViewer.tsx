import { useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { useViewerWebRTC } from "@/hooks/useViewerWebRTC";

export default function LiveViewer({ roomId }: { roomId: string }) {
  const WS_URL = `ws://localhost:8080/ws/live-rooms/${roomId}/events`;
  const { videoRef, isConnected } = useViewerWebRTC(roomId, WS_URL);

  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [playing, setPlaying] = useState(true);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;

    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const changeVolume = (val: number) => {
    const v = videoRef.current;
    if (!v) return;

    v.volume = val;
    v.muted = val === 0;

    setVolume(val);
    setMuted(v.muted);
  };

  const fullscreen = () => {
    const v = videoRef.current;
    if (!v) return;

    if (v.requestFullscreen) v.requestFullscreen();
  };

  return (
    <div className="max-w-5xl mx-auto px-3 md:px-0 space-y-4">

      {/* header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg md:text-xl font-semibold">تماشای پخش زنده</h2>
      </div>

      {/* video */}
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden group">

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          controls={false}
          className="w-full h-full object-contain"
        />

        {/* live badge */}
        <div
          className={`absolute top-3 left-3 flex items-center gap-2 text-white text-xs px-3 py-1 rounded-full
          ${isConnected ? "bg-red-600" : "bg-gray-600"}`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-white animate-pulse" : "bg-gray-300"
            }`}
          ></span>

          {isConnected ? "زنده" : "قطع شده"}
        </div>

        {/* controls */}
        <div
          className="absolute bottom-0 left-0 right-0
          bg-gradient-to-t from-black/70 to-transparent
          opacity-100 md:opacity-0 md:group-hover:opacity-100
          transition p-3 flex flex-wrap md:flex-nowrap items-center gap-3"
        >
          <button
            onClick={togglePlay}
            className="text-white flex items-center gap-1"
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <button
            onClick={toggleMute}
            className="text-white flex items-center gap-1"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => changeVolume(Number(e.target.value))}
            className="w-24"
          />

          <div className="flex-1" />

          <button onClick={fullscreen} className="text-white">
            <Maximize size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
