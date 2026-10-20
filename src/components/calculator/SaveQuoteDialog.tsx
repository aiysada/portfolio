/**
 * Indie Sign — SaveQuoteDialog Component
 * Triggered from the Price Calculator to save a complete quote snapshot.
 * Prevents accidental duplicates and clearly distinguishes new vs. update.
 */

import React, { useState, useCallback } from "react";
import {
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Copy,
} from "lucide-react";
import type { QuoteLineItem, AdditionalCharges, DiscountConfig, TaxConfig, QuoteSummary } from "@/types/calculator";
import type { QuoteHistoryRecord } from "@/types/quoteHistory";
import { useOwnerSettings } from "@/context/OwnerSettingsContext";
import { formatMoney } from "@/lib/money";
import { Button } from "@/components/ui/button";

interface SaveQuoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lines: QuoteLineItem[];
  charges: AdditionalCharges;
  discount: DiscountConfig;
  tax: TaxConfig;
  summary: QuoteSummary;
  /** If set, this session already has a saved record (same calc session). */
  existingRecordId?: string;
  onSaved: (recordId: string) => void;
}

function generateId(): string {
  return `qr-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const SaveQuoteDialog: React.FC<SaveQuoteDialogProps> = ({
  isOpen,
  onClose,
  lines,
  charges,
  discount,
  tax,
  summary,
  existingRecordId,
  onSaved,
}) => {
  const { saveQuoteRecord, updateQuoteRecord, getQuoteHistory } = useOwnerSettings();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerCompany, setCustomerCompany] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [saveMode, setSaveMode] = useState<"new" | "update">(
    existingRecordId ? "update" : "new"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Load existing record fields when switching to update mode
  const existingRecord = existingRecordId
    ? getQuoteHistory().find((r) => r.id === existingRecordId)
    : undefined;

  // Validate there's something meaningful to save
  const isValidQuote = lines.length > 0 && summary.total > 0;

  const buildSnapshot = useCallback((): QuoteHistoryRecord => {
    const now = new Date().toISOString();
    return {
      id: generateId(),
      internalNotes,
      snapshotLines: JSON.parse(JSON.stringify(lines)),
      snapshotCharges: JSON.parse(JSON.stringify(charges)),
      snapshotDiscount: { ...discount },
      snapshotTax: { ...tax },
      snapshotSummary: { ...summary, charges: { ...summary.charges } },
      documentNumbers: {},
      customerName: customerName.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined,
      customerAddress: customerAddress.trim() || undefined,
      customerCompany: customerCompany.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };
  }, [lines, charges, discount, tax, summary, internalNotes, customerName, customerPhone, customerAddress, customerCompany]);

  const handleSaveNew = useCallback(async () => {
    if (!isValidQuote) {
      setErrorMsg("ໃບປະເມີນຕ້ອງມີລາຍການ ແລະ ຍອດລວມທີ່ຖືກຕ້ອງກ່ອນບັນທຶກ");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const record = buildSnapshot();
    const result = saveQuoteRecord(record);
    if (result.success) {
      setSuccessMsg(`ບັນທຶກໃບປະເມີນ ສຳເລັດ! (ID: ${record.id.slice(0, 12)}...)`);
      onSaved(record.id);
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 1800);
    } else {
      setErrorMsg(result.errorLao || "ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ");
    }

    setIsSubmitting(false);
  }, [isValidQuote, buildSnapshot, saveQuoteRecord, onSaved, onClose]);

  const handleUpdateExisting = useCallback(async () => {
    if (!existingRecordId || !existingRecord) {
      setErrorMsg("ບໍ່ພົບໃບປະເມີນທີ່ຕ້ອງການອັບເດດ");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    // Update snapshot fields + metadata
    const updates: Partial<QuoteHistoryRecord> = {
      internalNotes,
      snapshotLines: JSON.parse(JSON.stringify(lines)),
      snapshotCharges: JSON.parse(JSON.stringify(charges)),
      snapshotDiscount: { ...discount },
      snapshotTax: { ...tax },
      snapshotSummary: { ...summary, charges: { ...summary.charges } },
      customerName: customerName.trim() || existingRecord.customerName,
      customerPhone: customerPhone.trim() || existingRecord.customerPhone,
      customerAddress: customerAddress.trim() || existingRecord.customerAddress,
      customerCompany: customerCompany.trim() || existingRecord.customerCompany,
    };

    const result = updateQuoteRecord(existingRecordId, updates);
    if (result.success) {
      setSuccessMsg("ອັບເດດໃບປະເມີນ ສຳເລັດ!");
      onSaved(existingRecordId);
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 1800);
    } else {
      setErrorMsg(result.errorLao || "ເກີດຂໍ້ຜິດພາດໃນການອັບເດດ");
    }

    setIsSubmitting(false);
  }, [
    existingRecordId, existingRecord, internalNotes, lines, charges,
    discount, tax, summary, customerName, customerPhone, customerAddress,
    customerCompany, updateQuoteRecord, onSaved, onClose,
  ]);

  if (!isOpen) return null;

  const inputCls = "w-full text-xs bg-background border border-border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-primary/40";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg my-auto bg-card rounded-3xl border border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20 rounded-t-3xl">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Save className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">ບັນທຶກໃບປະເມີນລາຄາ</h2>
              <p className="text-xs text-muted-foreground">Save Quote to History</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {/* Validation error */}
          {!isValidQuote && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>ກະລຸນາເພີ່ມລາຍການ ແລະ ຕາຊັ່ງລາຄາໃຫ້ຖືກຕ້ອງກ່ອນບັນທຶກ</span>
            </div>
          )}

          {/* Mode selector if existing record detected */}
          {existingRecordId && (
            <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span>ໃບປະເມີນນີ້ຖືກບັນທຶກໄວ້ແລ້ວໃນ Session ນີ້</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSaveMode("update")}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-all ${saveMode === "update" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted"}`}
                >
                  ອັບເດດລາຍການເດີມ
                </button>
                <button
                  type="button"
                  onClick={() => setSaveMode("new")}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-all ${saveMode === "new" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted"}`}
                >
                  <Copy className="h-3.5 w-3.5 inline mr-1" />
                  ສ້າງສຳເນົາໃໝ່
                </button>
              </div>
            </div>
          )}

          {/* Quote Summary Banner */}
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{lines.length} ລາຍການ — ຍອດລວມ:</span>
            <span className="text-lg font-extrabold text-primary">{formatMoney(summary.total)}</span>
          </div>

          {/* Customer Info (optional) */}
          <div className="space-y-2.5">
            <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              ຂໍ້ມູນລູກຄ້າ (ຖ້າຕ້ອງການ — ເລືອກໃສ່ໄດ້)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">ຊື່ລູກຄ້າ</label>
                <input
                  type="text"
                  placeholder={existingRecord?.customerName ?? "ເຊັ່ນ: ທ້າວ ສົມສັກ"}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">ເບີໂທ / WhatsApp</label>
                <input
                  type="text"
                  placeholder={existingRecord?.customerPhone ?? "020 xxxxxxxx"}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">ບໍລິສັດ (ຖ້າມີ)</label>
                <input
                  type="text"
                  placeholder={existingRecord?.customerCompany ?? ""}
                  value={customerCompany}
                  onChange={(e) => setCustomerCompany(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">ສະຖານທີ່</label>
                <input
                  type="text"
                  placeholder={existingRecord?.customerAddress ?? "ເຊັ່ນ: ວຽງຈັນ"}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          <div>
            <label className="text-[11px] text-muted-foreground block mb-1">ໝາຍເຫດພາຍໃນ (ສຳລັບເຈົ້າຂອງ — ລູກຄ້າບໍ່ເຫັນ)</label>
            <textarea
              rows={2}
              placeholder="ເຊັ່ນ: ລູກຄ້າຕ້ອງການທົດສອບ, ລໍຖ້າຢືນຢັນແບບ..."
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Storage notice */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600" />
            <span>ຂໍ້ມູນຖືກບັນທຶກໃນ Browser ນີ້ເທົ່ານັ້ນ. Export JSON Backup ເປັນປະຈຳເພື່ອສຳຮອງຂໍ້ມູນ.</span>
          </div>

          {/* Messages */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 text-xs h-10"
            >
              ຍົກເລີກ
            </Button>
            <Button
              type="button"
              onClick={saveMode === "update" && existingRecordId ? handleUpdateExisting : handleSaveNew}
              disabled={!isValidQuote || isSubmitting}
              className="flex-1 text-xs font-bold h-10"
            >
              <Save className="h-4 w-4 mr-1.5" />
              {isSubmitting
                ? "ກຳລັງບັນທຶກ..."
                : saveMode === "update" && existingRecordId
                ? "ອັບເດດໃບປະເມີນ"
                : "ບັນທຶກໃໝ່"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
