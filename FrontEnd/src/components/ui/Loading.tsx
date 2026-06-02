import { Loader2 } from "lucide-react";

export default function Loading({
  text = " لطفاً کمی صبر کنید، در حال بارگذاری ...",
}: {
  text?: string;
}) {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">{text}</p>
    </div>
  );
}
