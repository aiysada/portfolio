/**
 * Indie Sign — BusinessInfoSection Component
 * Manage business identity, contact information, social links, and banking details.
 */

import React, { useState } from "react";
import { Check, Building2, Phone, CreditCard } from "lucide-react";
import { useOwnerSettings } from "@/context/OwnerSettingsContext";
import { Button } from "@/components/ui/button";

export const BusinessInfoSection: React.FC = () => {
  const { settings, updateBusiness } = useOwnerSettings();
  const [b, setB] = useState(settings.business);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setB((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusiness(b);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            ຂໍ້ມູນທຸລະກິດ (Business Information)
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            ຂໍ້ມູນຊື່ຮ້ານ, ເບີຕິດຕໍ່, ທີ່ຢູ່ ແລະ ຊ່ອງທາງຊຳລະເງິນສຳລັບສະແດງເທິງເວັບໄຊ ແລະ ເອກະສານ PDF
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
            ບັນທຶກຂໍ້ມູນທຸລະກິດ
          </Button>
        </div>
      </div>

      {/* General Identity */}
      <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          ຊື່ຮ້ານ ແລະ ສະໂລແກນ (Brand Identity)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-foreground block mb-1">
              ຊື່ແບຣນ (Brand Name En) *
            </label>
            <input
              type="text"
              required
              value={b.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full text-xs bg-background border border-border rounded-lg p-2 font-bold"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-foreground block mb-1">
              ຊື່ຮ້ານພາສາລາວ (Brand Name Lao) *
            </label>
            <input
              type="text"
              required
              value={b.nameLao}
              onChange={(e) => handleChange("nameLao", e.target.value)}
              className="w-full text-xs bg-background border border-border rounded-lg p-2 font-bold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-[11px] font-semibold text-foreground block mb-1">
              ຄຳຂວັນ / ສະໂລແກນ (Tagline Lao)
            </label>
            <input
              type="text"
              value={b.taglineLao}
              onChange={(e) => handleChange("taglineLao", e.target.value)}
              className="w-full text-xs bg-background border border-border rounded-lg p-2"
            />
          </div>
        </div>
      </div>

      {/* Contact & Social Links */}
      <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Phone className="h-4 w-4 text-primary" />
          ຊ່ອງທາງຕິດຕໍ່ (Contact Details)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-foreground block mb-1">
              ເບີໂທລະສັບຫຼັກ (Phone Number) *
            </label>
            <input
              type="text"
              required
              value={b.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full text-xs bg-background border border-border rounded-lg p-2 font-medium"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-foreground block mb-1">
              ເບີໂທສຳຮອງ (Secondary Phone)
            </label>
            <input
              type="text"
              placeholder="ຖ້າມີ..."
              value={b.secondaryPhone || ""}
              onChange={(e) => handleChange("secondaryPhone", e.target.value)}
              className="w-full text-xs bg-background border border-border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-foreground block mb-1">
              ອີເມວ (Email)
            </label>
            <input
              type="email"
              placeholder="indiesign.laos@gmail.com"
              value={b.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full text-xs bg-background border border-border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-foreground block mb-1">
              ເລກປະຈຳຕົວຜູ້ເສຍພາສີ (Tax ID)
            </label>
            <input
              type="text"
              placeholder="ຖ້າມີ..."
              value={b.taxId || ""}
              onChange={(e) => handleChange("taxId", e.target.value)}
              className="w-full text-xs bg-background border border-border rounded-lg p-2"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-[11px] font-semibold text-foreground block mb-1">
              ທີ່ຕັ້ງຮ້ານ (Address Lao)
            </label>
            <input
              type="text"
              placeholder="ເຊັ່ນ: ບ້ານ ດົງປ່າລານ, ເມືອງ ສີສັດຕະນາກ, ນະຄອນຫຼວງວຽງຈັນ"
              value={b.addressLao}
              onChange={(e) => handleChange("addressLao", e.target.value)}
              className="w-full text-xs bg-background border border-border rounded-lg p-2"
            />
          </div>
        </div>
      </div>

      {/* Payment / Banking Details */}
      <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary" />
          ຊ່ອງທາງການຊຳລະເງິນ (Banking Details on Invoice)
        </h3>
        <p className="text-xs text-muted-foreground">
          ຂໍ້ມູນນີ້ຈະຖືກສະແດງໃນໃບແຈ້ງໜີ້ (Invoice) ເພື່ອໃຫ້ລູກຄ້າໂອນເງິນ
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-foreground block mb-1">
              ທະນາຄານ (Bank Name)
            </label>
            <input
              type="text"
              value={b.bankName || "BCEL One"}
              onChange={(e) => handleChange("bankName", e.target.value)}
              className="w-full text-xs bg-background border border-border rounded-lg p-2 font-medium"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-foreground block mb-1">
              ຊື່ບັນຊີ (Account Name)
            </label>
            <input
              type="text"
              value={b.bankAccountName || ""}
              onChange={(e) => handleChange("bankAccountName", e.target.value)}
              className="w-full text-xs bg-background border border-border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-foreground block mb-1">
              ເລກບັນຊີ (Account Number)
            </label>
            <input
              type="text"
              placeholder="010-12-00-XXXXX-XX"
              value={b.bankAccountNumber || ""}
              onChange={(e) => handleChange("bankAccountNumber", e.target.value)}
              className="w-full text-xs bg-background border border-border rounded-lg p-2 font-mono font-bold"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
