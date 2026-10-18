import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingStateProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  fullscreen?: boolean;
}

export function LoadingState({
  text = "ກຳລັງໂຫລດຂໍ້ມູນ...",
  size = "md",
  className,
  fullscreen = false,
}: LoadingStateProps) {
  const sizeMap = {
    sm: { icon: "h-4 w-4", text: "text-xs" },
    md: { icon: "h-7 w-7", text: "text-sm" },
    lg: { icon: "h-10 w-10", text: "text-base" },
  };

  const content = (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center text-muted-foreground",
        className
      )}
    >
      <Loader2 className={cn("animate-spin text-primary mb-3", sizeMap[size].icon)} />
      {text && <p className={cn("font-medium", sizeMap[size].text)}>{text}</p>}
      <span className="sr-only">Loading</span>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}
