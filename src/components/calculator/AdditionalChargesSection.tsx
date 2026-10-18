/**
 * Indie Sign — AdditionalChargesSection Component
 * Configurable labor, design, installation, delivery, and extra services.
 */

import React, { useState } from "react";
import {
  Wrench,
  Palette,
  Truck,
  HardHat,
  Plus,
  Trash2,
  ChevronDown,
} from "lucide-react";
import type {
  AdditionalCharges,
  ChargeConfig,
  ChargeMethod,
} from "@/types/calculator";
import { formatMoney } from "@/lib/money";
import { Button } from "@/components/ui/button";

interface AdditionalChargesSectionProps {
  charges: AdditionalCharges;
  onUpdateCharge: (
    key: "designFee" | "laborFee" | "installationFee" | "deliveryFee",
    config: Partial<ChargeConfig>
  ) => void;
  onAddExtraService: (nameLao: string, amount: number) => void;
  onRemoveExtraService: (id: string) => void;
}

export const AdditionalChargesSection: React.FC<
  AdditionalChargesSectionProps
> = ({
  charges,
  onUpdateCharge,
  onAddExtraService,
  onRemoveExtraService,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceAmount, setNewServiceAmount] = useState("");

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;
    const amount = parseFloat(newServiceAmount) || 0;
    onAddExtraService(newServiceName.trim(), amount);
    setNewServiceName("");
    setNewServiceAmount("");
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
      {/* Header Accordion Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 bg-muted/20 hover:bg-muted/40 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Wrench className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              ຄ່າບໍລິການເພີ່ມຕື່ມ (Additional Charges)
            </h3>
            <p className="text-xs text-muted-foreground">
              ຄ່າອອກແບບ, ຄ່າແຮງ, ຄ່າຕິດຕັ້ງ, ຄ່າຈັດສົ່ງ ແລະ ບໍລິການເສີມ
            </p>
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="p-4 sm:p-5 border-t border-border/50 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* 1. Design Fee */}
            <div className="p-3.5 rounded-xl border border-border/60 bg-background space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={charges.designFee.enabled}
                    onChange={(e) =>
                      onUpdateCharge("designFee", { enabled: e.target.checked })
                    }
                    className="rounded text-primary focus:ring-primary h-4 w-4"
                  />
                  <Palette className="h-3.5 w-3.5 text-primary" />
                  ຄ່າອອກແບບ (Design Fee)
                </label>
                {charges.designFee.enabled && (
                  <span className="text-xs font-semibold text-primary">
                    {formatMoney(charges.designFee.amount)}
                  </span>
                )}
              </div>

              {charges.designFee.enabled && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-1">
                      ຮູບແບບການຄິດໄລ່
                    </label>
                    <select
                      value={charges.designFee.method}
                      onChange={(e) =>
                        onUpdateCharge("designFee", {
                          method: e.target.value as ChargeMethod,
                        })
                      }
                      className="w-full text-xs bg-muted/40 border border-border rounded-lg p-1.5 text-foreground"
                    >
                      <option value="fixed">ລາຄາຄົງທີ່ (Fixed)</option>
                      <option value="per_item">ຄິດໄລ່ຕໍ່ອັນ (Per Item)</option>
                      <option value="manual">ກຳນົດເອງ (Manual)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-1">
                      ລາຄາ (ກີບ)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="5000"
                      value={
                        charges.designFee.amount === 0
                          ? ""
                          : charges.designFee.amount
                      }
                      onChange={(e) =>
                        onUpdateCharge("designFee", {
                          amount: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                      className="w-full text-xs bg-background border border-border rounded-lg p-1.5 text-foreground"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. Labor Fee */}
            <div className="p-3.5 rounded-xl border border-border/60 bg-background space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={charges.laborFee.enabled}
                    onChange={(e) =>
                      onUpdateCharge("laborFee", { enabled: e.target.checked })
                    }
                    className="rounded text-primary focus:ring-primary h-4 w-4"
                  />
                  <HardHat className="h-3.5 w-3.5 text-primary" />
                  ຄ່າແຮງງານ (Labor Fee)
                </label>
                {charges.laborFee.enabled && (
                  <span className="text-xs font-semibold text-primary">
                    {charges.laborFee.method === "included"
                      ? "ຮວມແລ້ວ"
                      : formatMoney(charges.laborFee.amount)}
                  </span>
                )}
              </div>

              {charges.laborFee.enabled && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-1">
                      ຮູບແບບການຄິດໄລ່
                    </label>
                    <select
                      value={charges.laborFee.method}
                      onChange={(e) =>
                        onUpdateCharge("laborFee", {
                          method: e.target.value as ChargeMethod,
                        })
                      }
                      className="w-full text-xs bg-muted/40 border border-border rounded-lg p-1.5 text-foreground"
                    >
                      <option value="included">ຮວມໃນລາຄາແລ້ວ</option>
                      <option value="fixed">ລາຄາຄົງທີ່ (Fixed)</option>
                      <option value="per_m2">ຕໍ່ ຕາແມັດ (Per m²)</option>
                      <option value="per_item">ຕໍ່ອັນ (Per Item)</option>
                      <option value="manual">ກຳນົດເອງ (Manual)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-1">
                      ລາຄາ (ກີບ)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="5000"
                      disabled={charges.laborFee.method === "included"}
                      value={
                        charges.laborFee.method === "included"
                          ? 0
                          : charges.laborFee.amount === 0
                          ? ""
                          : charges.laborFee.amount
                      }
                      onChange={(e) =>
                        onUpdateCharge("laborFee", {
                          amount: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                      className="w-full text-xs bg-background border border-border rounded-lg p-1.5 text-foreground disabled:opacity-50"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 3. Installation Fee */}
            <div className="p-3.5 rounded-xl border border-border/60 bg-background space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={charges.installationFee.enabled}
                    onChange={(e) =>
                      onUpdateCharge("installationFee", {
                        enabled: e.target.checked,
                      })
                    }
                    className="rounded text-primary focus:ring-primary h-4 w-4"
                  />
                  <Wrench className="h-3.5 w-3.5 text-primary" />
                  ຄ່າຕິດຕັ້ງ (Installation Fee)
                </label>
                {charges.installationFee.enabled && (
                  <span className="text-xs font-semibold text-primary">
                    {charges.installationFee.method === "included"
                      ? "ຮວມແລ້ວ"
                      : formatMoney(charges.installationFee.amount)}
                  </span>
                )}
              </div>

              {charges.installationFee.enabled && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-1">
                      ຮູບແບບການຄິດໄລ່
                    </label>
                    <select
                      value={charges.installationFee.method}
                      onChange={(e) =>
                        onUpdateCharge("installationFee", {
                          method: e.target.value as ChargeMethod,
                        })
                      }
                      className="w-full text-xs bg-muted/40 border border-border rounded-lg p-1.5 text-foreground"
                    >
                      <option value="included">ຮວມໃນລາຄາແລ້ວ</option>
                      <option value="fixed">ລາຄາຄົງທີ່ (Fixed)</option>
                      <option value="per_m2">ຕໍ່ ຕາແມັດ (Per m²)</option>
                      <option value="per_item">ຕໍ່ອັນ (Per Item)</option>
                      <option value="manual">ກຳນົດເອງ (Manual)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-1">
                      ລາຄາ (ກີບ)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="5000"
                      disabled={charges.installationFee.method === "included"}
                      value={
                        charges.installationFee.method === "included"
                          ? 0
                          : charges.installationFee.amount === 0
                          ? ""
                          : charges.installationFee.amount
                      }
                      onChange={(e) =>
                        onUpdateCharge("installationFee", {
                          amount: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                      className="w-full text-xs bg-background border border-border rounded-lg p-1.5 text-foreground disabled:opacity-50"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 4. Delivery Fee */}
            <div className="p-3.5 rounded-xl border border-border/60 bg-background space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={charges.deliveryFee.enabled}
                    onChange={(e) =>
                      onUpdateCharge("deliveryFee", {
                        enabled: e.target.checked,
                      })
                    }
                    className="rounded text-primary focus:ring-primary h-4 w-4"
                  />
                  <Truck className="h-3.5 w-3.5 text-primary" />
                  ຄ່າຈັດສົ່ງ (Delivery Fee)
                </label>
                {charges.deliveryFee.enabled && (
                  <span className="text-xs font-semibold text-primary">
                    {formatMoney(charges.deliveryFee.amount)}
                  </span>
                )}
              </div>

              {charges.deliveryFee.enabled && (
                <div className="pt-1">
                  <label className="text-[10px] text-muted-foreground block mb-1">
                    ຄ່າຈັດສົ່ງຄົງທີ່ (ກີບ)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    value={
                      charges.deliveryFee.amount === 0
                        ? ""
                        : charges.deliveryFee.amount
                    }
                    onChange={(e) =>
                      onUpdateCharge("deliveryFee", {
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                    className="w-full text-xs bg-background border border-border rounded-lg p-1.5 text-foreground"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 5. Extra Services Section */}
          <div className="p-3.5 rounded-xl border border-dashed border-border/80 bg-muted/20">
            <h4 className="text-xs font-bold text-foreground mb-2">
              ບໍລິການເສີມພິເສດ (Extra Services)
            </h4>

            {/* List of active extra services */}
            {charges.extraServices.length > 0 && (
              <div className="space-y-1.5 mb-3">
                {charges.extraServices.map((svc) => (
                  <div
                    key={svc.id}
                    className="flex items-center justify-between bg-card p-2 rounded-lg border border-border/50 text-xs"
                  >
                    <span className="font-medium text-foreground">
                      {svc.nameLao}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-primary">
                        {formatMoney(svc.amount)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveExtraService(svc.id)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Extra Service Inline Form */}
            <form
              onSubmit={handleAddService}
              className="flex flex-wrap sm:flex-nowrap items-center gap-2"
            >
              <input
                type="text"
                placeholder="ຊື່ບໍລິການເສີມ (ເຊັ່ນ: ເຄືອບ UV, ກອບເຫຼັກ...)"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
                className="flex-1 min-w-[150px] text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 text-foreground placeholder:text-muted-foreground/60"
              />
              <input
                type="number"
                min="0"
                step="5000"
                placeholder="ລາຄາ (ກີບ)"
                value={newServiceAmount}
                onChange={(e) => setNewServiceAmount(e.target.value)}
                className="w-28 text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 text-foreground"
              />
              <Button
                type="submit"
                size="sm"
                variant="secondary"
                disabled={!newServiceName.trim()}
                className="text-xs h-8 shrink-0"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                ເພີ່ມ
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
