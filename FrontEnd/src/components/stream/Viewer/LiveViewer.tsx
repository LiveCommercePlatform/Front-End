import { useState } from "react";
import { useViewerWebRTC } from "@/hooks/useViewerWebRTC";

export default function LiveViewer({ roomId }: { roomId: string }) {
  const WS_URL = `ws://localhost:8080/ws/live-rooms/${roomId}/events`;

  const { videoRef } = useViewerWebRTC(roomId, WS_URL);

  const [muted, setMuted] = useState(true);

  const handleUnmute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    video.play().catch(() => {});
    setMuted(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Live Viewer</h2>

      <div
        style={{
          position: "relative",
          width: "70%",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          controls={false}
          style={{
            width: "100%",
            background: "#000",
            borderRadius: 8,
          }}
        />

        {muted && (
          <button
            onClick={handleUnmute}
            style={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              padding: "10px 18px",
              borderRadius: 20,
              border: "none",
              background: "rgba(0,0,0,0.7)",
              color: "#fff",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Tap to unmute 🔊
          </button>
        )}
      </div>
    </div>
  );
}
