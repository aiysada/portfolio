import * as React from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "error" | "success" | "info" | "default";
  icon?: boolean;
}

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, variant = "default", icon = true, children, ...props }, ref) => {
    if (!children) return null;

    const variantStyles = {
      default: "text-muted-foreground",
      error: "text-destructive font-medium",
      success: "text-emerald-600 dark:text-emerald-400",
      info: "text-blue-600 dark:text-blue-400",
    };

    return (
      <p
        ref={ref}
        role={variant === "error" ? "alert" : "status"}
        className={cn("flex items-center gap-1.5 text-xs mt-1.5", variantStyles[variant], className)}
        {...props}
      >
        {icon && variant === "error" && <AlertCircle className="h-3.5 w-3.5 shrink-0" />}
        {icon && variant === "success" && <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
        {icon && variant === "info" && <Info className="h-3.5 w-3.5 shrink-0" />}
        <span>{children}</span>
      </p>
    );
  }
);
FormMessage.displayName = "FormMessage";

export { FormMessage };
