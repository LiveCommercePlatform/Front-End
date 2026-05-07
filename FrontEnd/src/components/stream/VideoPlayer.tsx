"use client";

import { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Mic, MicOff, Square, CameraOff } from "lucide-react";
import { Stream } from "@/types";
import DeleteDialog from "../ui/DeleteDialog";

export function VideoPlayer({
  stream,
  onEnd,
}: {
  stream: Stream;
  onEnd: (id: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);

  async function startCamera() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 1280,
          height: 720,
          frameRate: 30,
        },
        audio: true,
      });

      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      const audioTrack = mediaStream.getAudioTracks()[0];

      setIsStreaming(true);
      setIsMicOn(!!audioTrack);

      await createPeerConnection(mediaStream);
    } catch (err) {
      console.error("Camera error:", err);
    }
  }

  async function createPeerConnection(mediaStream: MediaStream) {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
      ],
    });

    peerRef.current = pc;

    mediaStream.getTracks().forEach((track) => {
      pc.addTrack(track, mediaStream);
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ICE Candidate:", event.candidate);
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("Connection state:", pc.connectionState);
    };

    const offer = await pc.createOffer();

    await pc.setLocalDescription(offer);

    console.log("SDP Offer:", offer);
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    streamRef.current = null;

    setIsStreaming(false);
    setIsMicOn(false);
  }

  function toggleCamera() {
    isStreaming ? stopCamera() : startCamera();
  }

  function toggleMic() {
    if (!streamRef.current) return;

    const audioTrack = streamRef.current.getAudioTracks()[0];
    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;
    setIsMicOn(audioTrack.enabled);
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (peerRef.current) {
        peerRef.current.close();
      }
    };
  }, []);

  return (
    <Card className="overflow-hidden rounded-2xl shadow-xl">
      <CardContent className="p-0">
        <div className="relative w-full h-[400px] bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${
              isStreaming ? "block" : "hidden"
            }`}
          />

          {!isStreaming && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              Camera is off
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 justify-center">
          <button
            onClick={toggleCamera}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-full border transition-all shadow-sm
            ${
              isStreaming
                ? "border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                : "border-primary/40 bg-primary/10 text-gray-800 hover:bg-primary/20"
            }`}
          >
            <span
              className={`flex items-center justify-center w-7 h-7 rounded-full text-white shadow-sm
              ${isStreaming ? "bg-red-500" : "bg-primary"}`}
            >
              {isStreaming ? (
                <CameraOff className="w-4 h-4" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </span>
          </button>

          <button
            onClick={toggleMic}
            disabled={!isStreaming}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-full border text-gray-800 shadow-sm border-primary/40 bg-primary/10 hover:bg-primary/20 transition-all disabled:opacity-40"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-full text-white shadow-sm bg-primary">
              {isMicOn ? (
                <Mic className="w-4 h-4" />
              ) : (
                <MicOff className="w-4 h-4" />
              )}
            </span>
          </button>

          <DeleteDialog
            title="اتمام لایو استریم"
            description=" آیا از اتمام این استریم مطمئن هستید؟ این عملیات غیرقابل بازگشت است."
            buttonText="اتمام لایو"
            onConfirm={() => {
              stopCamera();
              onEnd(stream.ID);
            }}
            trigger={
              <button
                disabled={!isStreaming}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-full border border-red-300 bg-red-50 text-red-600 hover:bg-red-100 transition-all shadow-sm disabled:opacity-40"
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-red-500 text-white shadow-sm">
                  <Square className="w-4 h-4" />
                </span>
                پایان
              </button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
