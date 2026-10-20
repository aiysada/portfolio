import React from "react";
import { ProductCategory } from "@/types/questionnaire";
import { PRODUCT_OPTIONS } from "@/data/questionnaireData";
import { Check, Sparkles, Image, Tag, Wand2, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step1ProductSelectProps {
  selectedCategory: ProductCategory | null;
  onSelectCategory: (category: ProductCategory) => void;
}

const CATEGORY_ICONS: Record<ProductCategory, React.ElementType> = {
  vinyl: Image,
  sticker: Tag,
  cnc: Wand2,
  beach_flag: Flag,
};

export const Step1ProductSelect: React.FC<Step1ProductSelectProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          ເລືອກປະເພດສິນຄ້າ ຫຼື ວຽກທີ່ຕ້ອງການ
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          ກະລຸນາເລືອກ 1 ປະເພດວຽກຫຼັກ ເພື່ອໃຫ້ລະບົບສະແດງຕົວເລືອກ ແລະ ລາຍລະອຽດທີ່ກົງກັບວຽກຂອງທ່ານ
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" role="radiogroup" aria-label="ປະເພດສິນຄ້າ">
        {PRODUCT_OPTIONS.map((item) => {
          const isSelected = selectedCategory === item.id;
          const Icon = CATEGORY_ICONS[item.id];

          return (
            <div
              key={item.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onSelectCategory(item.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectCategory(item.id);
                }
              }}
              className={cn(
                "group relative flex flex-col justify-between rounded-2xl border p-5 text-left transition-all duration-200 cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-orange-500",
                isSelected
                  ? "border-orange-500 bg-gradient-to-br from-orange-500/[0.08] via-card to-card shadow-lg shadow-orange-500/10 ring-2 ring-orange-500/50 -translate-y-0.5"
                  : "border-border/80 bg-card hover:border-orange-500/40 hover:bg-muted/30 hover:shadow-md hover:-translate-y-0.5"
              )}
            >
              {/* Subtle Ambient Corner Glow on Selected */}
              {isSelected && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
              )}

              {/* Top Row: Icon + Title + Radio Selection Indicator */}
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-200",
                        isSelected
                          ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30 scale-105"
                          : "bg-muted/70 text-foreground/80 group-hover:bg-orange-500/15 group-hover:text-orange-600 group-hover:scale-105"
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {item.titleLao}
                        </h3>
                        {item.badge && (
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                              item.recommended
                                ? "bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/20"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {item.recommended && <Sparkles className="h-2.5 w-2.5" />}
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-muted-foreground">{item.titleEn}</p>
                    </div>
                  </div>

                  {/* Radio circle check */}
                  <div
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
                      isSelected
                        ? "border-orange-500 bg-orange-500 text-white shadow-xs scale-105"
                        : "border-muted-foreground/30 bg-background group-hover:border-orange-400"
                    )}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                  </div>
                </div>

                <p className="mt-3.5 text-xs leading-relaxed text-muted-foreground">
                  {item.subtitle}
                </p>
              </div>

              {/* Bottom Feature Badges */}
              <div className="relative z-10 mt-5 flex flex-wrap gap-1.5 pt-3.5 border-t border-border/50">
                {item.features.map((feat, idx) => (
                  <span
                    key={idx}
                    className={cn(
                      "rounded-lg px-2 py-0.5 text-[11px] font-medium transition-colors",
                      isSelected
                        ? "bg-orange-500/10 text-orange-700 dark:text-orange-300"
                        : "bg-muted/60 text-muted-foreground"
                    )}
                  >
                    • {feat}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
