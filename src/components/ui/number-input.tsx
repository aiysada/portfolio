import * as React from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  error?: boolean;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      value,
      onChange,
      min = 0,
      max = 100000000,
      step = 1,
      unit,
      disabled,
      error,
      ...props
    },
    ref
  ) => {
    const handleIncrement = () => {
      if (disabled) return;
      const next = Math.min(max, (value || 0) + step);
      onChange(next);
    };

    const handleDecrement = () => {
      if (disabled) return;
      const next = Math.max(min, (value || 0) - step);
      onChange(next);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(e.target.value);
      if (isNaN(val)) {
        onChange(min);
      } else {
        onChange(Math.min(max, Math.max(min, val)));
      }
    };

    return (
      <div className="relative flex items-center w-full">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-l-md border border-r-0 border-input bg-muted/60 text-muted-foreground hover:bg-muted active:scale-95 disabled:pointer-events-none disabled:opacity-40 transition-all focus:outline-none focus:ring-1 focus:ring-primary"
          aria-label="ຫຼຸດຄ່າ"
        >
          <Minus className="h-4 w-4" />
        </button>

        <input
          ref={ref}
          type="number"
          value={value ?? ""}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={cn(
            "flex h-10 w-full border-y border-input bg-background px-3 py-2 text-center text-sm font-sans font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            error && "border-destructive text-destructive",
            className
          )}
          {...props}
        />

        {unit && (
          <div className="absolute right-12 text-xs text-muted-foreground pointer-events-none font-medium">
            {unit}
          </div>
        )}

        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-r-md border border-l-0 border-input bg-muted/60 text-muted-foreground hover:bg-muted active:scale-95 disabled:pointer-events-none disabled:opacity-40 transition-all focus:outline-none focus:ring-1 focus:ring-primary"
          aria-label="ເພີ່ມຄ່າ"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    );
  }
);
NumberInput.displayName = "NumberInput";

export { NumberInput };
