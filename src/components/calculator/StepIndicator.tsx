/**
 * Calculator Step Indicator — shows progress through the 5-step flow.
 */

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalcStep } from "@/hooks/useCalculator";

interface StepIndicatorProps {
  currentStep: CalcStep;
  onStepClick?: (step: CalcStep) => void;
  completedUpTo: CalcStep;
}

const STEPS = [
  { step: 1 as CalcStep, label: "ເລືອກສິນຄ້າ", short: "ສິນຄ້າ" },
  { step: 2 as CalcStep, label: "ຂະໜາດ", short: "ຂະໜາດ" },
  { step: 3 as CalcStep, label: "ວັດສະດຸ & ຕົວເລືອກ", short: "ຕົວເລືອກ" },
  { step: 4 as CalcStep, label: "ລາຄາ", short: "ລາຄາ" },
  { step: 5 as CalcStep, label: "ໃບສະເໜີ PDF", short: "PDF" },
] as const;

export function StepIndicator({ currentStep, onStepClick, completedUpTo }: StepIndicatorProps) {
  return (
    <nav aria-label="ຂັ້ນຕອນການຄຳນວນ" className="w-full">
      <ol className="flex items-center w-full">
        {STEPS.map(({ step, label, short }, idx) => {
          const isCompleted = step < currentStep || (step <= completedUpTo && step < currentStep);
          const isActive = step === currentStep;
          const isClickable = onStepClick && step <= completedUpTo;
          const isLast = idx === STEPS.length - 1;

          return (
            <li key={step} className="flex items-center flex-1">
              {/* Step button */}
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step)}
                className={cn(
                  "flex flex-col items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-1 py-0.5 transition-opacity",
                  isClickable ? "cursor-pointer hover:opacity-80" : "cursor-default"
                )}
                aria-current={isActive ? "step" : undefined}
              >
                {/* Circle */}
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-200",
                    isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : isActive
                      ? "border-primary bg-primary/10 text-primary shadow-sm shadow-primary/20"
                      : "border-border bg-card text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : step}
                </div>
                {/* Label */}
                <span
                  className={cn(
                    "text-[10px] font-medium text-center leading-tight hidden sm:block",
                    isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-medium text-center leading-tight block sm:hidden",
                    isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {short}
                </span>
              </button>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-1 transition-all duration-300",
                    step < currentStep ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
