import { cn } from "@/lib/utils";

export type StatusType =
  | "active"
  | "pending"
  | "completed"
  | "draft"
  | "cancelled"
  | "error";

export interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  showDot?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const statusConfig: Record<
  StatusType,
  { label: string; dotClass: string; badgeClass: string }
> = {
  active: {
    label: "ພ້ອມໃຊ້ງານ",
    dotClass: "bg-emerald-500",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  completed: {
    label: "ສຳເລັດແລ້ວ",
    dotClass: "bg-emerald-500",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  pending: {
    label: "ລໍຖ້າດຳເນີນການ",
    dotClass: "bg-amber-500 animate-pulse",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  draft: {
    label: "ສະບັບຮ່າງ",
    dotClass: "bg-slate-400",
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
  cancelled: {
    label: "ຍົກເລີກ",
    dotClass: "bg-destructive",
    badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
  },
  error: {
    label: "ຂໍ້ຜິດພາດ",
    dotClass: "bg-destructive",
    badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export function StatusIndicator({
  status,
  label,
  showDot = true,
  size = "md",
  className,
}: StatusIndicatorProps) {
  const config = statusConfig[status] || statusConfig.draft;
  const displayLabel = label || config.label;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium select-none",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        config.badgeClass,
        className
      )}
    >
      {showDot && (
        <span
          className={cn(
            "rounded-full shrink-0",
            size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2",
            config.dotClass
          )}
          aria-hidden="true"
        />
      )}
      <span>{displayLabel}</span>
    </span>
  );
}
