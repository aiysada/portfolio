/**
 * Indie Sign — MaterialsSection Component
 * Manage raw materials, pricing, units, and active status.
 */

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";
import { useOwnerSettings } from "@/context/OwnerSettingsContext";
import type { MaterialPricingEntry } from "@/types/ownerSettings";
import { formatMoney } from "@/lib/money";
import { Button } from "@/components/ui/button";

export const MaterialsSection: React.FC = () => {
  const { settings, updateMaterials } = useOwnerSettings();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [nameLao, setNameLao] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [category, setCategory] = useState("vinyl");
  const [unit, setUnit] = useState("m²");
  const [sellingPrice, setSellingPrice] = useState("130000");
  const [costPrice, setCostPrice] = useState("80000");
  const [notes, setNotes] = useState("");

  const resetForm = () => {
    setNameLao("");
    setNameEn("");
    setCategory("vinyl");
    setUnit("m²");
    setSellingPrice("130000");
    setCostPrice("80000");
    setNotes("");
    setEditingId(null);
    setIsAdding(false);
  };

  const startEdit = (mat: MaterialPricingEntry) => {
    setEditingId(mat.id);
    setIsAdding(false);
    setNameLao(mat.nameLao);
    setNameEn(mat.nameEn);
    setCategory(mat.category);
    setUnit(mat.unit);
    setSellingPrice(String(mat.sellingPrice));
    setCostPrice(String(mat.costPrice || 0));
    setNotes(mat.notes || "");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameLao.trim()) return;

    const sell = parseFloat(sellingPrice) || 0;
    const cost = parseFloat(costPrice) || 0;

    if (editingId) {
      const updated = settings.materials.map((m) =>
        m.id === editingId
          ? {
              ...m,
              nameLao: nameLao.trim(),
              nameEn: nameEn.trim(),
              category,
              unit: unit.trim() || "m²",
              sellingPrice: sell,
              costPrice: cost,
              notes: notes.trim(),
            }
          : m
      );
      updateMaterials(updated);
    } else {
      const newMat: MaterialPricingEntry = {
        id: `mat-${Date.now()}`,
        nameLao: nameLao.trim(),
        nameEn: nameEn.trim(),
        category,
        unit: unit.trim() || "m²",
        sellingPrice: sell,
        costPrice: cost,
        isActive: true,
        notes: notes.trim(),
      };
      updateMaterials([...settings.materials, newMat]);
    }
    resetForm();
  };

  const toggleActive = (id: string) => {
    const updated = settings.materials.map((m) =>
      m.id === id ? { ...m, isActive: !m.isActive } : m
    );
    updateMaterials(updated);
  };

  const deleteMaterial = (id: string) => {
    updateMaterials(settings.materials.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            ວັດສະດຸ ແລະ ລາຄາພື້ນຖານ (Materials & Pricing)
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            ກຳນົດລາຄາວັດສະດຸພື້ນຖານ ເຊັ່ນ: ຜ້າໄວນິວ, ສະຕິກເກີ, ອະຄຣີລິກ ແລະ ຫຼອດໄຟ LED
          </p>
        </div>

        {!isAdding && !editingId && (
          <Button
            type="button"
            size="sm"
            onClick={() => {
              resetForm();
              setIsAdding(true);
            }}
            className="text-xs font-semibold"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            + ເພີ່ມວັດສະດຸໃໝ່
          </Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSave} className="p-5 rounded-2xl border border-primary/30 bg-primary/5 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-foreground">
              {editingId ? "ແກ້ໄຂວັດສະດຸ" : "ເພີ່ມວັດສະດຸໃໝ່"}
            </h3>
            <button type="button" onClick={resetForm} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-foreground block mb-1">ຊື່ວັດສະດຸ (ພາສາລາວ) *</label>
              <input
                type="text"
                required
                value={nameLao}
                onChange={(e) => setNameLao(e.target.value)}
                className="w-full text-xs bg-background border border-border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-foreground block mb-1">ຊື່ພາສາອັງກິດ</label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="w-full text-xs bg-background border border-border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-foreground block mb-1">ລາຄາຂາຍ (Selling Price) ກີບ</label>
              <input
                type="number"
                min="0"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                className="w-full text-xs bg-background border border-border rounded-lg p-2 font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-foreground block mb-1">ຫົວໜ່ວຍ (Unit)</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full text-xs bg-background border border-border rounded-lg p-2"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-foreground block mb-1">ໝາຍເຫດຄຸນລັກສະນະ</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs bg-background border border-border rounded-lg p-2"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" size="sm" className="text-xs font-semibold">
              <Check className="h-3.5 w-3.5 mr-1" />
              {editingId ? "ບັນທຶກ" : "ເພີ່ມ"}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={resetForm} className="text-xs">
              ຍົກເລີກ
            </Button>
          </div>
        </form>
      )}

      {/* Materials Table */}
      <div className="rounded-2xl border border-border overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-muted/40 text-muted-foreground font-bold border-b border-border">
                <th className="p-3">ຊື່ວັດສະດຸ</th>
                <th className="p-3">ຫົວໜ່ວຍ</th>
                <th className="p-3 text-right">ລາຄາຂາຍ</th>
                <th className="p-3 text-center">ສະຖານະ</th>
                <th className="p-3 text-center">ຈັດການ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {settings.materials.map((mat) => (
                <tr key={mat.id} className="hover:bg-muted/20">
                  <td className="p-3">
                    <span className="font-bold text-foreground block">{mat.nameLao}</span>
                    {mat.notes && <span className="text-[10px] text-muted-foreground">{mat.notes}</span>}
                  </td>
                  <td className="p-3 text-muted-foreground">{mat.unit}</td>
                  <td className="p-3 text-right font-bold text-foreground">{formatMoney(mat.sellingPrice)}</td>
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => toggleActive(mat.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        mat.isActive ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {mat.isActive ? "ເປີດໃຊ້" : "ປິດໄວ້"}
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(mat)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMaterial(mat.id)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
