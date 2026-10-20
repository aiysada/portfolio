/**
 * Indie Sign — DocumentSettingsSection Component
 * Manage prefixes, quotation validity, footer text, and paper width.
 */

import React, { useState } from "react";
import { Check } from "lucide-react";
import { useOwnerSettings } from "@/context/OwnerSettingsContext";
import { Button } from "@/components/ui/button";

export const DocumentSettingsSection: React.FC = () => {
  const { settings, updateDocuments } = useOwnerSettings();
  const [docs, setDocs] = useState(settings.documents);
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateDocuments(docs);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            ຕັ້ງຄ່າເອກະສານ & PDF (Document & PDF Settings)
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            ກຳນົດ Prefix ເລກທີເອກະສານ, ອາຍຸໃບສະເໜີລາຄາ ແລະ ຮູບແບບການພິມ PDF
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
            ບັນທຶກການຕັ້ງຄ່າເອກະສານ
          </Button>
        </div>
      </div>

      {/* Prefixes */}
      <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
          Prefix ເລກທີເອກະສານ (Document Prefixes)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-foreground block mb-1">
              ໃບສະເໜີລາຄາ (Quotation Prefix)
            </label>
            <input
              type="text"
              required
              value={docs.quotationPrefix}
              onChange={(e) => setDocs((p) => ({ ...p, quotationPrefix: e.target.value.toUpperCase() }))}
              className="w-full text-xs bg-background border border-border rounded-lg p-2 font-mono font-bold"
            />
            <span className="text-[10px] text-muted-foreground block mt-1">
              ຕົວຢ່າງ: {docs.quotationPrefix}-20261018-001
            </span>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-foreground block mb-1">
              ໃບແຈ້ງໜີ້ (Invoice Prefix)
            </label>
            <input
              type="text"
              required
              value={docs.invoicePrefix}
              onChange={(e) => setDocs((p) => ({ ...p, invoicePrefix: e.target.value.toUpperCase() }))}
              className="w-full text-xs bg-background border border-border rounded-lg p-2 font-mono font-bold"
            />
            <span className="text-[10px] text-muted-foreground block mt-1">
              ຕົວຢ່າງ: {docs.invoicePrefix}-20261018-001
            </span>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-foreground block mb-1">
              ໃບເສັດຮັບເງິນ (Receipt Prefix)
            </label>
            <input
              type="text"
              required
              value={docs.receiptPrefix}
              onChange={(e) => setDocs((p) => ({ ...p, receiptPrefix: e.target.value.toUpperCase() }))}
              className="w-full text-xs bg-background border border-border rounded-lg p-2 font-mono font-bold"
            />
            <span className="text-[10px] text-muted-foreground block mt-1">
              ຕົວຢ່າງ: {docs.receiptPrefix}-20261018-001
            </span>
          </div>
        </div>
      </div>

      {/* Validity & Layout Options */}
      <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
          ກຳນົດເວລາ ແລະ ຮູບແບບ (Options & Format)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-foreground block mb-1">
              ອາຍຸໃບສະເໜີລາຄາ (Quotation Validity Days)
            </label>
            <input
              type="number"
              min="1"
              max="90"
              value={docs.defaultValidityDays}
              onChange={(e) =>
                setDocs((p) => ({ ...p, defaultValidityDays: parseInt(e.target.value, 10) || 15 }))
              }
              className="w-full text-xs bg-background border border-border rounded-lg p-2 font-bold"
            />
            <span className="text-[10px] text-muted-foreground block mt-1">
              ມາດຕະຖານ: 15 ວັນ (ຄິດໄລ່ວັນໝົດອາຍຸອັດຕະໂນມັດ)
            </span>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-foreground block mb-1">
              ຄວາມກວ້າງເຈ້ຍໃບເສັດມາດຕະຖານ (Receipt Paper Width mm)
            </label>
            <select
              value={docs.receiptPaperWidthMm}
              onChange={(e) =>
                setDocs((p) => ({ ...p, receiptPaperWidthMm: parseInt(e.target.value, 10) || 80 }))
              }
              className="w-full text-xs bg-background border border-border rounded-lg p-2 font-medium"
            >
              <option value="80">80 ມມ (ມາດຕະຖານເຈ້ຍຄວາມຮ້ອນ POS)</option>
              <option value="58">58 ມມ (Mini Thermal)</option>
              <option value="105">105 ມມ (A6)</option>
            </select>
          </div>
        </div>

        {/* Toggles */}
        <div className="pt-2 space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={docs.showSignatureLines}
              onChange={(e) => setDocs((p) => ({ ...p, showSignatureLines: e.target.checked }))}
              className="rounded text-primary focus:ring-primary h-4 w-4"
            />
            ສະແດງຊ່ອງລາຍເຊັນລູກຄ້າ ແລະ ຜູ້ຕາງໜ້າຮ້ານໃນເອກະສານ
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={docs.showBankDetailsOnInvoice}
              onChange={(e) =>
                setDocs((p) => ({ ...p, showBankDetailsOnInvoice: e.target.checked }))
              }
              className="rounded text-primary focus:ring-primary h-4 w-4"
            />
            ສະແດງຂໍ້ມູນບັນຊີທະນາຄານໃນໃບແຈ້ງໜີ້ (Invoice)
          </label>
        </div>

        {/* Default Footer Text */}
        <div>
          <label className="text-[11px] font-semibold text-foreground block mb-1">
            ຂໍ້ຄວາມທ້າຍເອກະສານ (Document Footer Text)
          </label>
          <input
            type="text"
            value={docs.defaultFooterText}
            onChange={(e) => setDocs((p) => ({ ...p, defaultFooterText: e.target.value }))}
            className="w-full text-xs bg-background border border-border rounded-lg p-2"
          />
        </div>
      </div>
    </form>
  );
};
