// "use client";

// import { useRef } from "react";
// import { useBroadcasterWebRTC } from "./useBroadcasterWebRTC";

// interface Props {
//   roomId: string;
// }

// export default function LiveBroadcaster({ roomId }: Props) {
//   const videoRef = useRef<HTMLVideoElement | null>(null);

//   const { start, stop, isStreaming } = useBroadcasterWebRTC(roomId, videoRef);

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Broadcaster Panel</h2>

//       {/* ویدیو استریمر */}
//       <video
//         ref={videoRef}
//         autoPlay
//         playsInline
//         muted
//         style={{
//           width: "100%",
//           maxWidth: 800,
//           borderRadius: 12,
//           background: "#000",
//         }}
//       />

//       {/* دکمه‌های کنترل */}
//       <div style={{ marginTop: 20 }}>
//         {!isStreaming ? (
//           <button onClick={start} style={btnStyle}>
//             Start Streaming
//           </button>
//         ) : (
//           <button onClick={stop} style={btnStyleStop}>
//             Stop Streaming
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// const btnStyle = {
//   padding: "12px 20px",
//   borderRadius: 8,
//   background: "#2ecc71",
//   color: "white",
//   cursor: "pointer",
//   fontSize: 16,
//   border: "none",
// };

// const btnStyleStop = {
//   ...btnStyle,
//   background: "#e74c3c",
// };
// LiveBroadcaster.tsx
// ------------------------------------------------------------
// این کامپوننت نمای پخش‌کننده (Broadcaster) را مدیریت می‌کند.
// - از useBroadcasterWebRTC استفاده می‌کند
// - امکان Start / Stop Stream
// - نمایش تعداد بازدیدکنندگان
// - نمایش ویدئوی محلی (camera)
// ------------------------------------------------------------

import { useBroadcasterWebRTC } from "@/hooks/useBroadcasterWebRTC";
import { useRef } from "react";

export default function LiveBroadcaster({ roomId }: { roomId: string }) {
  // آدرس WebSocket سرور سیگنالینگ
  const WS_URL = `ws://localhost:8080/ws/live-rooms/${roomId}/events`;

  // هوک اصلی
  const {
    videoRef,
    viewerCount,
    isStreaming,
    start,
    stop,
  } = useBroadcasterWebRTC(roomId, WS_URL);

  return (
    <div style={{ padding: 20 }}>
      <h2>Broadcaster Panel</h2>

      {/* ویدئوی محلی */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted // Broadcaster باید خود را mute کند تا loop ایجاد نشود
        style={{
          width: "70%",
          borderRadius: 8,
          background: "#000",
          marginBottom: 20,
        }}
      />

      {/* نمایش تعداد بینندگان */}
      <div style={{ fontSize: 18, marginBottom: 10 }}>
        👁️ Viewer Count: {viewerCount}
      </div>

      {/* دکمه‌ها */}
      {!isStreaming ? (
        <button
          onClick={start}
          style={{
            padding: "10px 20px",
            background: "green",
            color: "white",
            borderRadius: 6,
          }}
        >
          Start Streaming
        </button>
      ) : (
        <button
          onClick={stop}
          style={{
            padding: "10px 20px",
            background: "red",
            color: "white",
            borderRadius: 6,
          }}
        >
          Stop Streaming
        </button>
      )}
    </div>
  );
}
