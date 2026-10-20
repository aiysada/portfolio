/**
 * Indie Sign — FeesSection Component
 * Manage Labor, Installation, Design, Delivery rates and Extra Service Presets.
 */

import React, { useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { useOwnerSettings } from "@/context/OwnerSettingsContext";
import type { ChargeMethod } from "@/types/calculator";
import { formatMoney } from "@/lib/money";
import { Button } from "@/components/ui/button";

export const FeesSection: React.FC = () => {
  const { settings, updateFees } = useOwnerSettings();
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Extra service form
  const [newSvcLao, setNewSvcLao] = useState("");
  const [newSvcEn, setNewSvcEn] = useState("");
  const [newSvcAmount, setNewSvcAmount] = useState("");
  const [newSvcDesc, setNewSvcDesc] = useState("");

  const fees = settings.fees;

  const handleUpdateFee = (
    key: "designFee" | "laborFee" | "installationFee" | "deliveryFee",
    field: string,
    value: unknown
  ) => {
    updateFees({
      [key]: {
        ...fees[key],
        [field]: value,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAddPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSvcLao.trim()) return;

    const newPreset = {
      id: `preset-${Date.now()}`,
      nameLao: newSvcLao.trim(),
      nameEn: newSvcEn.trim(),
      amount: parseFloat(newSvcAmount) || 0,
      description: newSvcDesc.trim(),
    };

    updateFees({
      extraServicePresets: [...fees.extraServicePresets, newPreset],
    });

    setNewSvcLao("");
    setNewSvcEn("");
    setNewSvcAmount("");
    setNewSvcDesc("");
  };

  const handleRemovePreset = (id: string) => {
    updateFees({
      extraServicePresets: fees.extraServicePresets.filter((p) => p.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            ຄ່າແຮງ, ຄ່າຕິດຕັ້ງ ແລະ ຄ່າບໍລິການ (Fees & Rates)
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            ກຳນົດອັດຕາຄ່າແຮງງານ, ຄ່າອອກແບບ, ຄ່າຕິດຕັ້ງ ແລະ ລາຍການບໍລິການເສີມມາດຕະຖານ
          </p>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-500/10 px-3 py-1 rounded-lg">
            <Check className="h-3.5 w-3.5" />
            ບັນທຶກແລ້ວ
          </span>
        )}
      </div>

      {/* 4 Standard Fees Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Design Fee */}
        <div className="p-4 rounded-2xl border border-border bg-card space-y-3">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            ຄ່າອອກແບບ (Design Fee Default)
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-muted-foreground block mb-1">ຮູບແບບຄິດໄລ່</label>
              <select
                value={fees.designFee.method}
                onChange={(e) => handleUpdateFee("designFee", "method", e.target.value as ChargeMethod)}
                className="w-full text-xs bg-background border border-border rounded-lg p-2"
              >
                <option value="fixed">ລາຄາຄົງທີ່ (Fixed)</option>
                <option value="per_item">ຕໍ່ອັນ (Per Item)</option>
                <option value="manual">ກຳນົດເອງ (Manual)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground block mb-1">ອັດຕາຄ່າບໍລິການ (ກີບ)</label>
              <input
                type="number"
                min="0"
                step="5000"
                value={fees.designFee.amount}
                onChange={(e) => handleUpdateFee("designFee", "amount", parseFloat(e.target.value) || 0)}
                className="w-full text-xs bg-background border border-border rounded-lg p-2 font-bold"
              />
            </div>
          </div>
        </div>

        {/* 2. Labor Fee */}
        <div className="p-4 rounded-2xl border border-border bg-card space-y-3">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            ຄ່າແຮງງານ (Labor Fee Default)
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-muted-foreground block mb-1">ຮູບແບບຄິດໄລ່</label>
              <select
                value={fees.laborFee.method}
                onChange={(e) => handleUpdateFee("laborFee", "method", e.target.value as ChargeMethod)}
                className="w-full text-xs bg-background border border-border rounded-lg p-2"
              >
                <option value="included">ຮວມໃນລາຄາແລ້ວ</option>
                <option value="fixed">ລາຄາຄົງທີ່ (Fixed)</option>
                <option value="per_m2">ຕໍ່ ຕາແມັດ (Per m²)</option>
                <option value="per_item">ຕໍ່ອັນ (Per Item)</option>
                <option value="manual">ກຳນົດເອງ (Manual)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground block mb-1">ອັດຕາຄ່າບໍລິການ (ກີບ)</label>
              <input
                type="number"
                min="0"
                step="5000"
                value={fees.laborFee.amount}
                onChange={(e) => handleUpdateFee("laborFee", "amount", parseFloat(e.target.value) || 0)}
                className="w-full text-xs bg-background border border-border rounded-lg p-2 font-bold"
              />
            </div>
          </div>
        </div>

        {/* 3. Installation Fee */}
        <div className="p-4 rounded-2xl border border-border bg-card space-y-3">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            ຄ່າຕິດຕັ້ງ (Installation Fee Default)
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-muted-foreground block mb-1">ຮູບແບບຄິດໄລ່</label>
              <select
                value={fees.installationFee.method}
                onChange={(e) => handleUpdateFee("installationFee", "method", e.target.value as ChargeMethod)}
                className="w-full text-xs bg-background border border-border rounded-lg p-2"
              >
                <option value="included">ຮວມໃນລາຄາແລ້ວ</option>
                <option value="fixed">ລາຄາຄົງທີ່ (Fixed)</option>
                <option value="per_m2">ຕໍ່ ຕາແມັດ (Per m²)</option>
                <option value="per_item">ຕໍ່ອັນ (Per Item)</option>
                <option value="manual">ກຳນົດເອງ (Manual)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground block mb-1">ອັດຕາຄ່າບໍລິການ (ກີບ)</label>
              <input
                type="number"
                min="0"
                step="5000"
                value={fees.installationFee.amount}
                onChange={(e) => handleUpdateFee("installationFee", "amount", parseFloat(e.target.value) || 0)}
                className="w-full text-xs bg-background border border-border rounded-lg p-2 font-bold"
              />
            </div>
          </div>
        </div>

        {/* 4. Delivery Fee */}
        <div className="p-4 rounded-2xl border border-border bg-card space-y-3">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            ຄ່າຈັດສົ່ງ (Delivery Fee Default)
          </h3>
          <div>
            <label className="text-[10px] text-muted-foreground block mb-1">ຄ່າຈັດສົ່ງຄົງທີ່ (ກີບ)</label>
            <input
              type="number"
              min="0"
              step="5000"
              value={fees.deliveryFee.amount}
              onChange={(e) => handleUpdateFee("deliveryFee", "amount", parseFloat(e.target.value) || 0)}
              className="w-full text-xs bg-background border border-border rounded-lg p-2 font-bold"
            />
          </div>
        </div>
      </div>

      {/* Extra Service Presets */}
      <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
        <h3 className="text-sm font-bold text-foreground">
          ລາຍການບໍລິການເສີມມາດຕະຖານ (Reusable Extra Services)
        </h3>

        {/* Existing Presets List */}
        <div className="space-y-2">
          {fees.extraServicePresets.map((svc) => (
            <div
              key={svc.id}
              className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/20 text-xs"
            >
              <div>
                <span className="font-bold text-foreground block">{svc.nameLao}</span>
                {svc.description && (
                  <span className="text-[10px] text-muted-foreground block">{svc.description}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-primary">{formatMoney(svc.amount)}</span>
                <button
                  type="button"
                  onClick={() => handleRemovePreset(svc.id)}
                  className="p-1 rounded text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Preset Form */}
        <form onSubmit={handleAddPreset} className="pt-3 border-t border-border flex flex-wrap gap-2">
          <input
            type="text"
            required
            placeholder="ຊື່ບໍລິການເສີມ (ພາສາລາວ) *"
            value={newSvcLao}
            onChange={(e) => setNewSvcLao(e.target.value)}
            className="flex-1 min-w-[160px] text-xs bg-background border border-border rounded-lg p-2"
          />
          <input
            type="number"
            min="0"
            step="5000"
            placeholder="ລາຄາ (ກີບ)"
            value={newSvcAmount}
            onChange={(e) => setNewSvcAmount(e.target.value)}
            className="w-28 text-xs bg-background border border-border rounded-lg p-2 font-bold"
          />
          <input
            type="text"
            placeholder="ຄຳອະທິບາຍສັ້ນ"
            value={newSvcDesc}
            onChange={(e) => setNewSvcDesc(e.target.value)}
            className="flex-1 min-w-[160px] text-xs bg-background border border-border rounded-lg p-2"
          />
          <Button type="submit" size="sm" className="text-xs font-semibold h-9 shrink-0">
            <Plus className="h-4 w-4 mr-1" />
            ເພີ່ມບໍລິການເສີມ
          </Button>
        </form>
      </div>
    </div>
  );
};
