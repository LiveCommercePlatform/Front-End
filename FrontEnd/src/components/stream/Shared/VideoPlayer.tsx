import { ForwardedRef, forwardRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface Props {
  muted?: boolean;
  className?: string;
  style?: React.CSSProperties;
  controls?: boolean;
  loop?: boolean;
  isLiveEnded?: boolean;
  isStreaming?: boolean; 
}

const VideoPlayer = forwardRef(function VideoPlayer(
  {
    muted = false,
    controls = false,
    loop = false,
    className,
    style,
    isLiveEnded = false,
    isStreaming = false,
  }: Props,
  ref: ForwardedRef<HTMLVideoElement>
) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    if (!isStreaming || isLiveEnded) {
      setIsVideoPlaying(false);
    }
  }, [isStreaming, isLiveEnded]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-black aspect-video flex items-center justify-center">
      
      {isLiveEnded ? (
        <div className="z-10 text-center animate-in fade-in duration-500">
          <p className="text-white text-lg font-bold">پخش زنده به پایان رسیده است</p>
          <p className="text-gray-400 text-sm">ممنون که همراه ما بودید</p>
        </div>
      ) : (
        <>
          <video
            ref={ref}
            autoPlay
            playsInline
            muted={muted}
            loop={loop}
            controls={controls}
            onPlaying={() => setIsVideoPlaying(true)}
            onWaiting={() => setIsVideoPlaying(false)}
            className={cn(
              "w-full h-full object-contain rounded-xl transition-opacity duration-700",
              isVideoPlaying ? "opacity-100" : "opacity-0",
              className
            )}
            style={style}
          />

          {!isVideoPlaying && isStreaming && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm transition-all">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
              <p className="text-white text-sm animate-pulse">در حال دریافت تصویر...</p>
            </div>
          )}

          {!isStreaming && !isLiveEnded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500 text-sm italic">در انتظار برقراری اتصال...</p>
            </div>
          )}
        </>
      )}

      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10" />
    </div>
  );
});

export default VideoPlayer;
