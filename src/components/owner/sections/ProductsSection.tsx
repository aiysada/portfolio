/**
 * Indie Sign — ProductsSection Component
 * Manage products & signage items: add, edit, disable, delete with validation.
 */

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";
import { useOwnerSettings } from "@/context/OwnerSettingsContext";
import type { CalcProduct, PricingMethod } from "@/types/calculator";
import { formatMoney } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const ProductsSection: React.FC = () => {
  const { settings, addProduct, editProduct, deleteProduct } = useOwnerSettings();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state for add/edit
  const [formNameLao, setFormNameLao] = useState("");
  const [formNameEn, setFormNameEn] = useState("");
  const [formCategory, setFormCategory] = useState("vinyl");
  const [formPricingMethod, setFormPricingMethod] = useState<PricingMethod>("per_m2");
  const [formUnitPrice, setFormUnitPrice] = useState<string>("130000");
  const [formUnit, setFormUnit] = useState("m²");
  const [formMinPrice, setFormMinPrice] = useState<string>("0");
  const [errorMsg, setErrorMsg] = useState("");

  const resetForm = () => {
    setFormNameLao("");
    setFormNameEn("");
    setFormCategory("vinyl");
    setFormPricingMethod("per_m2");
    setFormUnitPrice("130000");
    setFormUnit("m²");
    setFormMinPrice("0");
    setErrorMsg("");
    setEditingId(null);
    setIsAdding(false);
  };

  const startEdit = (product: CalcProduct) => {
    setEditingId(product.id);
    setIsAdding(false);
    setFormNameLao(product.nameLao);
    setFormNameEn(product.nameEn);
    setFormCategory(product.category);
    setFormPricingMethod(product.pricingMethod);
    setFormUnitPrice(String(product.unitPrice));
    setFormUnit(product.unit);
    setFormMinPrice(String(product.minPrice));
    setErrorMsg("");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameLao.trim()) {
      setErrorMsg("ກະລຸນາໃສ່ຊື່ສິນຄ້າ (ພາສາລາວ)");
      return;
    }

    const price = parseFloat(formUnitPrice) || 0;
    const minPrice = parseFloat(formMinPrice) || 0;
    if (price < 0) {
      setErrorMsg("ລາຄາຕໍ່ໜ່ວຍຕ້ອງບໍ່ຕິດລົບ");
      return;
    }

    if (editingId) {
      editProduct(editingId, {
        nameLao: formNameLao.trim(),
        nameEn: formNameEn.trim(),
        category: formCategory,
        pricingMethod: formPricingMethod,
        unitPrice: price,
        unit: formUnit.trim() || "m²",
        minPrice,
      });
    } else {
      const newProduct: CalcProduct = {
        id: `custom-prod-${Date.now()}`,
        nameLao: formNameLao.trim(),
        nameEn: formNameEn.trim(),
        category: formCategory,
        pricingMethod: formPricingMethod,
        unitPrice: price,
        unit: formUnit.trim() || "m²",
        minPrice,
      };
      addProduct(newProduct);
    }

    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            ຈັດການສິນຄ້າ ແລະ ລາຄາ (Products & Pricing)
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            ເພີ່ມ, ແກ້ໄຂລາຄາຂາຍ ແລະ ລາຄາຂັ້ນຕ່ຳຂອງສິນຄ້າທັງໝົດໃນລະບົບ
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
            + ເພີ່ມສິນຄ້າໃໝ່
          </Button>
        )}
      </div>

      {/* Add / Edit Form Card */}
      {(isAdding || editingId) && (
        <div className="p-5 rounded-2xl border border-primary/30 bg-primary/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">
              {editingId ? "ແກ້ໄຂຂໍ້ມູນສິນຄ້າ" : "ເພີ່ມສິນຄ້າ / ປ້າຍໃໝ່"}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-foreground block mb-1">
                  ຊື່ສິນຄ້າ (ພາສາລາວ) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ເຊັ່ນ: ປ້າຍໄວນິວຫຼັງດຳ 380g"
                  value={formNameLao}
                  onChange={(e) => setFormNameLao(e.target.value)}
                  className="w-full text-xs bg-background border border-border rounded-lg p-2 text-foreground"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-foreground block mb-1">
                  ຊື່ພາສາອັງກິດ (English Name)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 380g Black-back Vinyl"
                  value={formNameEn}
                  onChange={(e) => setFormNameEn(e.target.value)}
                  className="w-full text-xs bg-background border border-border rounded-lg p-2 text-foreground"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-foreground block mb-1">
                  ວິທີຄິດໄລ່ລາຄາ (Pricing Method)
                </label>
                <select
                  value={formPricingMethod}
                  onChange={(e) => {
                    const method = e.target.value as PricingMethod;
                    setFormPricingMethod(method);
                    if (method === "per_m2") setFormUnit("m²");
                    else if (method === "per_item") setFormUnit("ອັນ");
                    else setFormUnit("ຊຸດ");
                  }}
                  className="w-full text-xs bg-background border border-border rounded-lg p-2 text-foreground"
                >
                  <option value="per_m2">ຕໍ່ ຕາແມັດ (Per m²)</option>
                  <option value="per_item">ຕໍ່ ຊິ້ນ/ອັນ (Per Item)</option>
                  <option value="fixed">ລາຄາຄົງທີ່ (Fixed Price)</option>
                  <option value="manual">ກຳນົດລາຄາເອງ (Manual Price)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-foreground block mb-1">
                  ໝວດໝູ່ສິນຄ້າ (Category)
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full text-xs bg-background border border-border rounded-lg p-2 text-foreground"
                >
                  <option value="vinyl">ປ້າຍໄວນິວ & ສະຕິກເກີ</option>
                  <option value="lightbox">ກ່ອງໄຟ LED & ນີອອນ</option>
                  <option value="acrylic">ອະຄຣີລິກ & ຕົວອັກສອນ</option>
                  <option value="print">ງານພິມ / ນາມບັດ</option>
                  <option value="design">ບໍລິການອອກແບບ</option>
                  <option value="custom">ອື່ນໆ</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-foreground block mb-1">
                  ລາຄາຂາຍ (ກີບ) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={formUnitPrice}
                  onChange={(e) => setFormUnitPrice(e.target.value)}
                  className="w-full text-xs bg-background border border-border rounded-lg p-2 text-foreground font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-foreground block mb-1">
                  ຫົວໜ່ວຍ (Unit)
                </label>
                <input
                  type="text"
                  placeholder="m², ອັນ, ຊຸດ, ແຜ່ນ..."
                  value={formUnit}
                  onChange={(e) => setFormUnit(e.target.value)}
                  className="w-full text-xs bg-background border border-border rounded-lg p-2 text-foreground"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-foreground block mb-1">
                  ລາຄາຂັ້ນຕ່ຳ (Minimum Charge) ກີບ
                </label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={formMinPrice}
                  onChange={(e) => setFormMinPrice(e.target.value)}
                  placeholder="0 (ບໍ່ມີຂັ້ນຕ່ຳ)"
                  className="w-full text-xs bg-background border border-border rounded-lg p-2 text-foreground"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-destructive font-medium">{errorMsg}</p>
            )}

            <div className="flex gap-2 pt-2">
              <Button type="submit" size="sm" className="text-xs font-semibold">
                <Check className="h-3.5 w-3.5 mr-1" />
                {editingId ? "ບັນທຶກການແກ້ໄຂ" : "ເພີ່ມສິນຄ້າ"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetForm}
                className="text-xs"
              >
                ຍົກເລີກ
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="rounded-2xl border border-border overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-muted/40 text-muted-foreground font-bold border-b border-border">
                <th className="p-3">ສິນຄ້າ / ປ້າຍ</th>
                <th className="p-3">ຮູບແບບຄິດໄລ່</th>
                <th className="p-3 text-right">ລາຄາຂາຍ</th>
                <th className="p-3 text-right">ຂັ້ນຕ່ຳ</th>
                <th className="p-3 text-center">ຈັດການ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {settings.products.map((prod) => (
                <tr key={prod.id} className="hover:bg-muted/20">
                  <td className="p-3">
                    <span className="font-bold text-foreground block">
                      {prod.nameLao}
                    </span>
                    {prod.nameEn && (
                      <span className="text-[10px] text-muted-foreground block">
                        {prod.nameEn}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-[10px]">
                      {prod.pricingMethod === "per_m2"
                        ? "ຕໍ່ m²"
                        : prod.pricingMethod === "per_item"
                        ? "ຕໍ່ອັນ"
                        : prod.pricingMethod === "fixed"
                        ? "ຄົງທີ່"
                        : "ກຳນົດເອງ"}
                    </Badge>
                  </td>
                  <td className="p-3 text-right font-bold text-foreground">
                    {formatMoney(prod.unitPrice)} / {prod.unit}
                  </td>
                  <td className="p-3 text-right text-muted-foreground">
                    {prod.minPrice > 0 ? formatMoney(prod.minPrice) : "-"}
                  </td>
                  <td className="p-3 text-center">
                    {deleteConfirmId === prod.id ? (
                      <div className="inline-flex items-center gap-1 bg-destructive/10 p-1 rounded-lg">
                        <span className="text-[10px] text-destructive font-medium px-1">
                          ລຶບ?
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            deleteProduct(prod.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-0.5 text-[11px] bg-destructive text-white rounded font-bold"
                        >
                          ແມ່ນ
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-0.5 text-[11px] bg-muted text-muted-foreground rounded"
                        >
                          ບໍ່
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(prod)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirmId(prod.id)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
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
