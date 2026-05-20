import { ForwardedRef, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface Props {
  muted?: boolean;
  className?: string;
  style?: React.CSSProperties;
  controls?: boolean;
  loop?: boolean;
}

const VideoPlayer = forwardRef(function VideoPlayer(
  {
    muted = false,
    controls = false,
    loop = false,
    className,
    style,
  }: Props,
  ref: ForwardedRef<HTMLVideoElement>
) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-black">
      <video
        ref={ref}
        autoPlay
        playsInline
        muted={muted}
        loop={loop}
        controls={controls}
        className={cn(
          "object-contain rounded-xl",
          "transition-opacity duration-300",
          className
        )}
        style={style}
      />

      {/* subtle overlay for nicer look */}
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10" />
    </div>
  );
});

export default VideoPlayer;
