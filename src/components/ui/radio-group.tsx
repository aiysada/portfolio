import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  className?: string;
  orientation?: "vertical" | "horizontal";
}

export function RadioGroup({
  name,
  value,
  onChange,
  options,
  className,
  orientation = "vertical",
}: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      className={cn(
        "gap-3",
        orientation === "vertical" ? "flex flex-col" : "flex flex-wrap",
        className
      )}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        const id = `${name}-${option.value}`;

        return (
          <label
            key={option.value}
            htmlFor={id}
            className={cn(
              "flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all duration-150 select-none",
              isSelected
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-input bg-card hover:bg-muted/40",
              option.disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <div className="relative flex items-center pt-0.5">
              <input
                type="radio"
                id={id}
                name={name}
                value={option.value}
                checked={isSelected}
                disabled={option.disabled}
                onChange={() => onChange(option.value)}
                className="peer sr-only"
              />
              <div
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-input transition-colors",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-background"
                )}
              >
                {isSelected && (
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground leading-none">
                {option.label}
              </span>
              {option.description && (
                <span className="text-xs text-muted-foreground mt-1 leading-normal">
                  {option.description}
                </span>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
}
