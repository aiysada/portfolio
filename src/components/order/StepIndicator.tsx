import React from "react";
import { Check, Layers, Sliders, FileText, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick?: (step: number) => void;
}

const STEPS = [
  { step: 1, title: "ເລືອກສິນຄ້າ", desc: "ປະເພດງານທີ່ຕ້ອງການ", icon: Layers },
  { step: 2, title: "ລາຍລະອຽດວັດສະດຸ", desc: "ປະເພດວັດສະດຸ & ຜິວ", icon: Sliders },
  { step: 3, title: "ຂະໜາດ & ວຽກ", desc: "ຂະໜາດ, ໄຟລ໌, ວັນທີ", icon: FileText },
  { step: 4, title: "ສະຫຼຸບ & ສົ່ງ", desc: "ກວດສອບ & WhatsApp", icon: Send },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps = 4,
  onStepClick,
}) => {
  const progressPercent = Math.min(100, Math.max(0, ((currentStep - 1) / (totalSteps - 1)) * 100));

  return (
    <div className="w-full">
      {/* Mobile Header Step Bar */}
      <div className="sm:hidden mb-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-600 text-white font-bold text-xs shadow-xs">
              {currentStep}
            </span>
            <span className="font-bold text-foreground">
              {STEPS[currentStep - 1]?.title}
            </span>
          </div>
          <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
            ຂັ້ນຕອນ {currentStep} ຈາກ {totalSteps}
          </span>
        </div>

        {/* Fluid animated progress track */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/80">
          <div
            className="h-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Desktop Step Steps Navigation */}
      <div className="hidden sm:block">
        {/* Continuous progress track behind step nodes */}
        <div className="relative mb-8">
          <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-muted rounded-full z-0">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-400 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="relative z-10 grid grid-cols-4 gap-4">
            {STEPS.map((s) => {
              const isCompleted = s.step < currentStep;
              const isCurrent = s.step === currentStep;
              const isUpcoming = s.step > currentStep;
              const StepIcon = s.icon;

              return (
                <button
                  key={s.step}
                  type="button"
                  disabled={isUpcoming}
                  onClick={() => onStepClick && isCompleted && onStepClick(s.step)}
                  className={cn(
                    "group flex flex-col items-center text-center transition-all",
                    isCompleted && "cursor-pointer",
                    isCurrent && "cursor-default",
                    isUpcoming && "cursor-not-allowed opacity-60"
                  )}
                >
                  {/* Step Circle Node */}
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-2xl text-xs font-bold transition-all duration-200 border-2",
                      isCurrent &&
                        "border-orange-500 bg-orange-600 text-white shadow-lg shadow-orange-500/30 scale-110",
                      isCompleted &&
                        "border-emerald-500 bg-emerald-600 text-white group-hover:scale-105 shadow-xs",
                      isUpcoming && "border-border bg-card text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 stroke-[2.5]" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="mt-2.5 space-y-0.5">
                    <span
                      className={cn(
                        "block text-xs font-bold transition-colors",
                        isCurrent && "text-orange-600 dark:text-orange-400 font-extrabold",
                        isCompleted && "text-foreground",
                        isUpcoming && "text-muted-foreground"
                      )}
                    >
                      {s.title}
                    </span>
                    <span className="block text-[10px] text-muted-foreground leading-tight">
                      {s.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
