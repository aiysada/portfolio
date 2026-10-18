import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  title = "ເກີດຂໍ້ຜິດພາດໃນລະບົບ",
  message = "ບໍ່ສາມາດໂຫລດຂໍ້ມູນ ຫຼື ດຳເນີນການໄດ້ໃນຂະນະນີ້. ກະລຸນາກວດສອບການເຊື່ອມຕໍ່ ຫຼື ລອງໃໝ່ອີກຄັ້ງ.",
  onRetry,
  retryLabel = "ລອງໃໝ່ອີກຄັ້ງ",
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-8 sm:p-12 text-center",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
        <AlertTriangle className="h-6 w-6" />
      </div>

      <h3 className="text-lg font-bold text-foreground mb-1.5">{title}</h3>

      <p className="max-w-md text-sm text-muted-foreground leading-relaxed mb-6">
        {message}
      </p>

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="border-destructive/30 hover:bg-destructive/10 text-destructive rounded-lg flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>{retryLabel}</span>
        </Button>
      )}
    </div>
  );
}
