/**
 * Indie Sign — QuoteLineItemCard Component
 * Individual line item card in the multi-line quote calculator.
 */

import React, { useState } from "react";
import {
  Copy,
  Trash2,
  AlertCircle,
  ChevronDown,
  Layers,
  Sparkles,
} from "lucide-react";
import type {
  QuoteLineItem,
  DimensionUnit,
  PricingMethod,
} from "@/types/calculator";
import { formatMoney, formatAreaM2 } from "@/lib/money";
import { unitLabel } from "@/lib/units";
import { validateLine } from "@/lib/validation";
import { CALC_PRODUCTS } from "@/data/calculatorProducts";
import { Button } from "@/components/ui/button";

interface QuoteLineItemCardProps {
  line: QuoteLineItem;
  index: number;
  onUpdateDimensions: (width: number, height: number, unit: DimensionUnit) => void;
  onUpdateQuantity: (quantity: number) => void;
  onUpdateUnitPrice: (price: number) => void;
  onUpdatePricingMethod: (method: PricingMethod) => void;
  onUpdateProduct: (productId: string) => void;
  onUpdateNotes: (notes: string) => void;
  onDuplicate: () => void;
  onRemove: () => void;
}

const PRICING_METHOD_LABELS: Record<PricingMethod, string> = {
  per_m2: "ຄິດໄລ່ຕາມ ຕາແມັດ (m²)",
  per_item: "ຄິດໄລ່ຕໍ່ອັນ / ຊິ້ນ",
  fixed: "ລາຄາຄົງທີ່ (Fixed)",
  manual: "ກຳນົດລາຄາເອງ (Manual)",
};

const UNITS: DimensionUnit[] = ["cm", "m", "mm"];

export const QuoteLineItemCard: React.FC<QuoteLineItemCardProps> = ({
  line,
  index,
  onUpdateDimensions,
  onUpdateQuantity,
  onUpdateUnitPrice,
  onUpdatePricingMethod,
  onUpdateProduct,
  onUpdateNotes,
  onDuplicate,
  onRemove,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showProductChange, setShowProductChange] = useState(false);
  const validation = validateLine(line);

  return (
    <div className="relative rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Header row: Index badge + Name + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
            {index + 1}
          </span>
          <div>
            <h3 className="font-semibold text-foreground text-sm sm:text-base leading-tight">
              {line.productNameLao || "ລາຍການສິນຄ້າ"}
            </h3>
            {line.productNameEn && (
              <span className="text-xs text-muted-foreground block">
                {line.productNameEn}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {/* Method Selector */}
          <select
            value={line.pricingMethod}
            onChange={(e) => onUpdatePricingMethod(e.target.value as PricingMethod)}
            className="text-[11px] bg-muted/70 text-foreground border border-border/60 rounded-md px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-primary/40 font-medium"
          >
            <option value="per_m2">ຕໍ່ m²</option>
            <option value="per_item">ຕໍ່ອັນ</option>
            <option value="fixed">ລາຄາຄົງທີ່</option>
            <option value="manual">ກຳນົດເອງ</option>
          </select>

          {/* Duplicate button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDuplicate}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            title="ສຳເນົາລາຍການນີ້"
          >
            <Copy className="h-4 w-4" />
          </Button>

          {/* Delete button */}
          {showConfirmDelete ? (
            <div className="flex items-center gap-1 bg-destructive/10 p-1 rounded-lg">
              <span className="text-[11px] text-destructive px-1 font-medium">ລຶບ?</span>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmDelete(false);
                  onRemove();
                }}
                className="px-2 py-0.5 text-xs bg-destructive text-white rounded font-medium hover:bg-destructive/90 transition-colors"
              >
                ແມ່ນ
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded font-medium hover:bg-muted/80"
              >
                ຍົກເລີກ
              </button>
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowConfirmDelete(true)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              title="ລຶບລາຍການນີ້"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Product switcher (optional expandable) */}
      <div className="pt-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowProductChange(!showProductChange)}
            className="text-xs text-primary hover:underline flex items-center gap-1 font-medium py-1"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>ປ່ຽນຊະນິດປ້າຍ / ວັດສະດຸ</span>
            <ChevronDown
              className={`h-3 w-3 transition-transform ${showProductChange ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {showProductChange && (
          <div className="mt-2 p-3 bg-muted/40 rounded-xl border border-border/50 text-xs">
            <label className="block text-muted-foreground font-medium mb-1.5">
              ເລືອກປ້າຍ / ວັດສະດຸໃໝ່:
            </label>
            <select
              value={line.productId}
              onChange={(e) => {
                onUpdateProduct(e.target.value);
                setShowProductChange(false);
              }}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {CALC_PRODUCTS.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.nameLao} — {formatMoney(prod.unitPrice)}/{prod.unit}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Form Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3">
        {/* Dimensions row (if per_m2) */}
        {line.pricingMethod === "per_m2" ? (
          <div className="sm:col-span-8 bg-muted/30 p-3 rounded-xl border border-border/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-foreground">
                ຂະໜາດ (Dimensions)
              </span>
              <span className="text-xs font-medium text-primary">
                ເນື້ອທີ່: {formatAreaM2(line.areaM2)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Width */}
              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">
                  ກວ້າງ
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={line.width === 0 ? "" : line.width}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    onUpdateDimensions(val, line.height, line.dimensionUnit);
                  }}
                  placeholder="0"
                  className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Height */}
              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">
                  ສູງ
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={line.height === 0 ? "" : line.height}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    onUpdateDimensions(line.width, val, line.dimensionUnit);
                  }}
                  placeholder="0"
                  className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Unit Selector */}
              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">
                  ຫົວໜ່ວຍ
                </label>
                <select
                  value={line.dimensionUnit}
                  onChange={(e) =>
                    onUpdateDimensions(
                      line.width,
                      line.height,
                      e.target.value as DimensionUnit
                    )
                  }
                  className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {unitLabel(u)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className="sm:col-span-8 bg-muted/20 p-3 rounded-xl border border-border/40 flex items-center">
            <div>
              <span className="text-xs font-medium text-foreground block">
                {PRICING_METHOD_LABELS[line.pricingMethod]}
              </span>
              <span className="text-xs text-muted-foreground">
                ສິນຄ້ານີ້ຄິດໄລ່ລາຄາຕໍ່ຊິ້ນ ຫຼື ລາຄາຄົງທີ່ (ບໍ່ຕ້ອງລະບຸຂະໜາດ)
              </span>
            </div>
          </div>
        )}

        {/* Quantity & Unit Price */}
        <div className="sm:col-span-4 flex flex-col justify-between gap-2 bg-muted/30 p-3 rounded-xl border border-border/40">
          {/* Quantity */}
          <div>
            <label className="block text-[11px] text-muted-foreground mb-1 font-medium">
              ຈຳນວນ (Quantity)
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => onUpdateQuantity(Math.max(1, line.quantity - 1))}
                className="w-8 h-8 rounded-l-lg border border-border bg-background flex items-center justify-center text-foreground hover:bg-muted font-bold text-sm"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={line.quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 1;
                  onUpdateQuantity(Math.max(1, val));
                }}
                className="w-full h-8 border-y border-border bg-background text-center text-sm font-semibold text-foreground focus:outline-none"
              />
              <button
                type="button"
                onClick={() => onUpdateQuantity(line.quantity + 1)}
                className="w-8 h-8 rounded-r-lg border border-border bg-background flex items-center justify-center text-foreground hover:bg-muted font-bold text-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Unit Price (Editable!) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] text-muted-foreground font-medium">
                ລາຄາຕໍ່ໜ່ວຍ
              </label>
              <span className="text-[10px] text-muted-foreground">
                {line.pricingMethod === "per_m2" ? "ກີບ / m²" : "ກີບ / ອັນ"}
              </span>
            </div>
            <input
              type="number"
              min="0"
              step="1000"
              value={line.unitPrice === 0 ? "" : line.unitPrice}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 0;
                onUpdateUnitPrice(val);
              }}
              placeholder="0"
              className="w-full bg-background border border-border rounded-lg px-2.5 py-1 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
      </div>

      {/* Notes & Job Description */}
      <div className="mt-3">
        <input
          type="text"
          value={line.notes}
          onChange={(e) => onUpdateNotes(e.target.value)}
          placeholder="ໝາຍເຫດເພີ່ມຕື່ມສຳລັບລາຍການນີ້ (ເຊັ່ນ: ຕອກຕາໄກ່, ເຈາະຮູ, ພັບຂອບ...)"
          className="w-full text-xs bg-background/50 border border-border/60 rounded-lg px-3 py-1.5 text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
      </div>

      {/* Validation warning */}
      {!validation.isValid && (
        <div className="mt-2.5 flex items-start gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 p-2 rounded-lg">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            {validation.errors.map((err, i) => (
              <span key={i} className="block leading-tight">
                {err}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Minimum price applied alert */}
      {line.minPriceApplied && (
        <div className="mt-2.5 flex items-center justify-between text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-medium">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            ຄິດໄລ່ຕາມລາຄາຂັ້ນຕ່ຳຂອງສິນຄ້າ ({formatMoney(line.minPrice)})
          </span>
          <span className="text-[11px] opacity-80">
            (ລາຄາປົກກະຕິ: {formatMoney(line.lineSubtotal)})
          </span>
        </div>
      )}

      {/* Footer Subtotal */}
      <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium">
          ມູນຄ່າລາຍການນີ້:
        </span>
        <span className="text-base sm:text-lg font-bold text-foreground">
          {formatMoney(line.effectiveSubtotal)}
        </span>
      </div>
    </div>
  );
};
