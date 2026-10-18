/**
 * Indie Sign — DiscountTaxSection Component
 * Configurable discount (percentage or fixed Kip) and optional tax toggle.
 */

import React from "react";
import { Tag, Percent } from "lucide-react";
import type { DiscountConfig, TaxConfig, DiscountType } from "@/types/calculator";

interface DiscountTaxSectionProps {
  discount: DiscountConfig;
  tax: TaxConfig;
  onUpdateDiscount: (updates: Partial<DiscountConfig>) => void;
  onUpdateTax: (updates: Partial<TaxConfig>) => void;
}

export const DiscountTaxSection: React.FC<DiscountTaxSectionProps> = ({
  discount,
  tax,
  onUpdateDiscount,
  onUpdateTax,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
      {/* Discount Box */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Tag className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-foreground">
              ສ່ວນຫຼຸດ (Discount)
            </h3>
            <p className="text-[11px] text-muted-foreground">
              ກຳນົດສ່ວນຫຼຸດເປັນເປີເຊັນ (%) ຫຼື ຈຳນວນເງິນກີບ
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <label className="text-[10px] text-muted-foreground block mb-1">
              ປະເພດສ່ວນຫຼຸດ
            </label>
            <select
              value={discount.type}
              onChange={(e) =>
                onUpdateDiscount({ type: e.target.value as DiscountType })
              }
              className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2 text-foreground"
            >
              <option value="percentage">ເປີເຊັນ (%)</option>
              <option value="fixed">ຈຳນວນເງິນ (ກີບ)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-muted-foreground block mb-1">
              {discount.type === "percentage" ? "ມູນຄ່າ (%)" : "ມູນຄ່າ (ກີບ)"}
            </label>
            <input
              type="number"
              min="0"
              max={discount.type === "percentage" ? 100 : undefined}
              step={discount.type === "percentage" ? 1 : 10000}
              value={discount.value === 0 ? "" : discount.value}
              onChange={(e) =>
                onUpdateDiscount({
                  value: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="0"
              className="w-full text-xs bg-background border border-border rounded-lg p-2 text-foreground"
            />
          </div>
        </div>

        {/* Quick presets for percentage */}
        {discount.type === "percentage" && (
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[10px] text-muted-foreground mr-1">ເລືອກດ່ວນ:</span>
            {[0, 5, 10, 15, 20].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => onUpdateDiscount({ value: pct })}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  discount.value === pct
                    ? "bg-primary text-primary-foreground font-bold"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {pct === 0 ? "ບໍ່ມີ" : `${pct}%`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tax Box */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Percent className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-foreground">
                ອາກອນມູນຄ່າເພີ່ມ (VAT)
              </h3>
              <p className="text-[11px] text-muted-foreground">
                ຄິດໄລ່ອາກອນຕາມລະບຽບການ (ຖ້າຕ້ອງການ)
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={tax.enabled}
              onChange={(e) => onUpdateTax({ enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {tax.enabled ? (
          <div className="pt-2">
            <label className="text-[10px] text-muted-foreground block mb-1">
              ອັດຕາອາກອນ (%)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={tax.rate === 0 ? "" : tax.rate}
                onChange={(e) =>
                  onUpdateTax({ rate: parseFloat(e.target.value) || 0 })
                }
                placeholder="7"
                className="w-28 text-xs bg-background border border-border rounded-lg p-2 text-foreground font-semibold"
              />
              <span className="text-xs text-muted-foreground">%</span>
              <div className="flex items-center gap-1 ml-auto">
                {[7, 10].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => onUpdateTax({ rate })}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                      tax.rate === rate
                        ? "bg-primary text-primary-foreground font-bold"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-2.5 rounded-lg bg-muted/30 text-[11px] text-muted-foreground">
            ປິດການຄິດໄລ່ອາກອນ — ຍອດລວມຈະບໍ່ລວມອາກອນມູນຄ່າເພີ່ມ.
          </div>
        )}
      </div>
    </div>
  );
};
