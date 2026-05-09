"use client";

import { Camera, CameraOff, Mic, MicOff, Square } from "lucide-react";

type Props = {
  isStreaming: boolean;
  isMicOn: boolean;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  onEnd?: () => void;
};

export default function PlayerControls({
  isStreaming,
  isMicOn,
  onToggleCamera,
  onToggleMic,
  onEnd,
}: Props) {
  return (
    <div className="flex justify-center gap-4 mt-4 flex-wrap">
      {/* Camera */}
      <button
        onClick={onToggleCamera}
        className={`p-3 rounded-full text-white shadow
        ${isStreaming ? "bg-red-500" : "bg-primary"}`}
      >
        {isStreaming ? <CameraOff size={18} /> : <Camera size={18} />}
      </button>

      {/* Mic */}
      <button
        disabled={!isStreaming}
        onClick={onToggleMic}
        className="p-3 rounded-full bg-neutral-800 text-white shadow disabled:opacity-40"
      >
        {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
      </button>

      {/* End */}
      {onEnd && (
        <button
          disabled={!isStreaming}
          onClick={onEnd}
          className="p-3 rounded-full bg-red-600 text-white shadow disabled:opacity-40"
        >
          <Square size={18} />
        </button>
      )}
    </div>
  );
}
