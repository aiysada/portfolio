/**
 * Step 1 — Product Selector
 * Visual product card grid for choosing the signage type.
 */

import { CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { SignageProduct } from "@/types/signage";

interface ProductSelectorProps {
  products: SignageProduct[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  acrylic: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  stainless: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  lightbox: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  neon: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  billboard: "bg-green-500/10 text-green-600 dark:text-green-400",
  vinyl: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  other: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
};

export function ProductSelector({ products, selectedId, onSelect }: ProductSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          const isSelected = product.id === selectedId;
          return (
            <button
              key={product.id}
              type="button"
              onClick={() => onSelect(product.id)}
              className={cn(
                "relative flex flex-col text-left rounded-2xl border-2 p-5 transition-all duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isSelected
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                  : "border-border bg-card hover:border-primary/40"
              )}
              aria-pressed={isSelected}
            >
              {/* Selected check */}
              {isSelected && (
                <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-primary" />
              )}

              {/* Popular badge */}
              {product.popular && (
                <div className="mb-3">
                  <Badge variant="orange" className="text-[10px] font-semibold gap-1">
                    <Sparkles className="h-3 w-3" />
                    ນິຍົມ
                  </Badge>
                </div>
              )}

              {/* Category pill */}
              <span
                className={cn(
                  "mb-3 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                  CATEGORY_COLORS[product.category] ?? CATEGORY_COLORS.other
                )}
              >
                {product.category}
              </span>

              {/* Title */}
              <h3
                className={cn(
                  "text-sm font-bold leading-tight transition-colors",
                  isSelected ? "text-primary" : "text-foreground"
                )}
              >
                {product.titleLao}
              </h3>
              <p className="mt-0.5 text-[11px] text-muted-foreground font-sans">
                {product.title}
              </p>

              {/* Description */}
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {product.descriptionLao}
              </p>

              {/* Base price hint */}
              <div className="mt-3 pt-3 border-t border-border/60">
                <p className="text-xs text-muted-foreground">
                  ລາຄາເລີ່ມຕົ້ນ:
                </p>
                <p className={cn("text-sm font-bold font-sans", isSelected ? "text-primary" : "text-foreground")}>
                  {new Intl.NumberFormat("lo-LA").format(product.basePrice)} ₭
                  <span className="text-xs font-normal text-muted-foreground ml-1">/ {product.unit}</span>
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
