/**
 * Indie Sign — AddLineSelector Component
 * Quick product selection buttons and category cards to add items to the quote.
 */

import React, { useState } from "react";
import { Plus, Sparkles, PlusCircle } from "lucide-react";
import type { CalcProduct } from "@/types/calculator";
import { formatMoney } from "@/lib/money";
import { Button } from "@/components/ui/button";

interface AddLineSelectorProps {
  products: CalcProduct[];
  onAddProduct: (productId: string) => void;
  onAddCustom: () => void;
}

export const AddLineSelector: React.FC<AddLineSelectorProps> = ({
  products,
  onAddProduct,
  onAddCustom,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "ທັງໝົດ" },
    { id: "vinyl", label: "ປ້າຍໄວນິວ & ສະຕິກເກີ" },
    { id: "lightbox", label: "ກ່ອງໄຟ LED & ນີອອນ" },
    { id: "acrylic", label: "ອະຄຣີລິກ & ຕົວອັກສອນ" },
    { id: "print", label: "ງານພິມ / ນາມບັດ" },
    { id: "design", label: "ອອກແບບ & ບໍລິການ" },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products.filter((p) => p.id !== "calc-custom")
      : products.filter(
          (p) => p.category === selectedCategory && p.id !== "calc-custom"
        );

  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">
            ເພີ່ມລາຍການປ້າຍ / ສິນຄ້າເຂົ້າໃນໃບປະເມີນ:
          </h3>
        </div>

        {/* Custom Item Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddCustom}
          className="text-xs h-8 border-primary/40 text-primary hover:bg-primary/10"
        >
          <Sparkles className="h-3.5 w-3.5 mr-1" />
          + ເພີ່ມລາຍການກຳນົດເອງ (Custom)
        </Button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5 mb-3.5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === cat.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {filteredProducts.map((prod) => (
          <button
            key={prod.id}
            type="button"
            onClick={() => onAddProduct(prod.id)}
            className="flex items-center justify-between text-left p-2.5 rounded-xl border border-border/60 bg-card hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div className="pr-2">
              <span className="block text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                {prod.nameLao}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {formatMoney(prod.unitPrice)} / {prod.unit}
              </span>
            </div>
            <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
              <Plus className="h-4 w-4" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
