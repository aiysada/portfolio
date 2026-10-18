import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  action?: React.ReactNode;
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  align = "center",
  action,
  className,
  ...props
}: SectionHeadingProps) {
  const alignClasses = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  };

  return (
    <div
      className={cn(
        "flex flex-col mb-10 sm:mb-12 max-w-3xl",
        alignClasses[align],
        action && "sm:flex-row sm:items-end sm:justify-between sm:max-w-none",
        className
      )}
      {...props}
    >
      <div className={cn("flex flex-col", alignClasses[align])}>
        {badge && (
          <Badge variant="orange" className="mb-3 px-3 py-0.5 text-xs font-medium w-fit">
            {badge}
          </Badge>
        )}
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-snug">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="mt-4 sm:mt-0 shrink-0">{action}</div>}
    </div>
  );
}
