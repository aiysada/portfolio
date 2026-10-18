import * as React from "react";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary" | "warning";
  isLoading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "ຢືນຢັນ",
  cancelLabel = "ຍົກເລີກ",
  variant = "primary",
  isLoading = false,
}: ConfirmationDialogProps) {
  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: "text-destructive bg-destructive/10",
      button: "destructive" as const,
    },
    primary: {
      icon: "text-primary bg-primary/10",
      button: "default" as const,
    },
    warning: {
      icon: "text-amber-500 bg-amber-500/10",
      button: "default" as const,
    },
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={() => !isLoading && onClose()}
      />

      {/* Dialog Content */}
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl transition-all animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="ປິດ"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              variantStyles[variant].icon
            )}
          >
            <AlertCircle className="h-6 w-6" />
          </div>

          <div className="flex-1 pr-6">
            <h3
              id="confirmation-dialog-title"
              className="text-lg font-bold text-foreground leading-snug"
            >
              {title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg"
          >
            {cancelLabel}
          </Button>

          <Button
            type="button"
            variant={variantStyles[variant].button}
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-lg"
          >
            {isLoading ? "ກຳລັງປະມວນຜົນ..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
