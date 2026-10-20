/**
 * Indie Sign — TaxDiscountSection Component
 * Manage default tax enablement, VAT percentage, and default discount settings.
 */

import React, { useState } from "react";
import { Check, Percent, Tag } from "lucide-react";
import { useOwnerSettings } from "@/context/OwnerSettingsContext";
import type { DiscountType } from "@/types/calculator";
import { Button } from "@/components/ui/button";

export const TaxDiscountSection: React.FC = () => {
  const { settings, updateTaxDiscount } = useOwnerSettings();
  const [td, setTd] = useState(settings.taxDiscount);
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTaxDiscount(td);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            ອາກອນ ແລະ ສ່ວນຫຼຸດເລີ່ມຕົ້ນ (Tax & Discount Defaults)
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            ກຳນົດຄ່າເລີ່ມຕົ້ນຂອງອາກອນມູນຄ່າເພີ່ມ (VAT) ແລະ ສ່ວນຫຼຸດສຳລັບການຄຳນວນໃບສະເໜີລາຄາໃໝ່
          </p>
        </div>

        <div className="flex items-center gap-3">
          {success && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-500/10 px-3 py-1 rounded-lg">
              <Check className="h-3.5 w-3.5" />
              ບັນທຶກສຳເລັດແລ້ວ
            </span>
          )}
          <Button type="submit" size="sm" className="text-xs font-bold">
            <Check className="h-4 w-4 mr-1.5" />
            ບັນທຶກຄ່າເລີ່ມຕົ້ນ
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tax Defaults */}
        <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Percent className="h-4 w-4 text-primary" />
            ອາກອນມູນຄ່າເພີ່ມເລີ່ມຕົ້ນ (VAT Default)
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={td.taxEnabled}
                onChange={(e) => setTd((p) => ({ ...p, taxEnabled: e.target.checked }))}
                className="rounded text-primary focus:ring-primary h-4 w-4"
              />
              ເປີດການຄິດໄລ່ອາກອນມູນຄ່າເພີ່ມເປັນຄ່າເລີ່ມຕົ້ນ
            </label>

            <div>
              <label className="text-[11px] font-semibold text-foreground block mb-1">
                ອັດຕາອາກອນ (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={td.taxRatePercent}
                  onChange={(e) =>
                    setTd((p) => ({ ...p, taxRatePercent: parseFloat(e.target.value) || 0 }))
                  }
                  className="w-28 text-xs bg-background border border-border rounded-lg p-2 font-bold"
                />
                <span className="text-xs text-muted-foreground">%</span>
              </div>
              <span className="text-[10px] text-muted-foreground block mt-1">
                ມາດຕະຖານໃນ ສປປ ລາວ: 7% ຫຼື 10%
              </span>
            </div>
          </div>
        </div>

        {/* Discount Defaults */}
        <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            ສ່ວນຫຼຸດເລີ່ມຕົ້ນ (Discount Default)
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-foreground block mb-1">
                ປະເພດສ່ວນຫຼຸດເລີ່ມຕົ້ນ
              </label>
              <select
                value={td.discountType}
                onChange={(e) =>
                  setTd((p) => ({ ...p, discountType: e.target.value as DiscountType }))
                }
                className="w-full text-xs bg-background border border-border rounded-lg p-2"
              >
                <option value="percentage">ເປີເຊັນ (%)</option>
                <option value="fixed">ຈຳນວນເງິນກີບ (Fixed Amount)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-foreground block mb-1">
                ມູນຄ່າສ່ວນຫຼຸດເລີ່ມຕົ້ນ ({td.discountType === "percentage" ? "%" : "ກີບ"})
              </label>
              <input
                type="number"
                min="0"
                value={td.defaultDiscountValue}
                onChange={(e) =>
                  setTd((p) => ({ ...p, defaultDiscountValue: parseFloat(e.target.value) || 0 }))
                }
                className="w-full text-xs bg-background border border-border rounded-lg p-2 font-bold"
              />
              <span className="text-[10px] text-muted-foreground block mt-1">
                ຄ່າເລີ່ມຕົ້ນ: 0 (ບໍ່ມີສ່ວນຫຼຸດ)
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
