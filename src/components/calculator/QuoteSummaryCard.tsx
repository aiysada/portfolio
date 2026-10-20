/**
 * Indie Sign — QuoteSummaryCard Component
 * Sticky summary panel with itemized 8-step breakdown, disclaimer, and share actions.
 */

import React, { useState } from "react";
import {
  Calculator,
  Copy,
  Check,
  MessageCircle,
  RotateCcw,
  AlertTriangle,
  FileText,
  Save,
  CheckCircle2,
} from "lucide-react";
import type { QuoteSummary, QuoteLineItem } from "@/types/calculator";
import { formatMoney } from "@/lib/money";
import { BUSINESS_CONFIG } from "@/constants/business";
import { Button } from "@/components/ui/button";

interface QuoteSummaryCardProps {
  summary: QuoteSummary;
  lines: QuoteLineItem[];
  onReset: () => void;
  onOpenDocumentWorkflow?: () => void;
  /** Called to open the Save Quote dialog */
  onSaveQuote?: () => void;
  /** Whether this calculator session already has a saved record */
  isSaved?: boolean;
}

export const QuoteSummaryCard: React.FC<QuoteSummaryCardProps> = ({
  summary,
  lines,
  onReset,
  onOpenDocumentWorkflow,
  onSaveQuote,
  isSaved = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Generate plain text quote for clipboard & WhatsApp
  const generatePlainTextQuote = (): string => {
    let text = `📋 ໃບປະເມີນລາຄາເບື້ອງຕົ້ນ — ${BUSINESS_CONFIG.brandName}\n`;
    text += `ໂທ: ${BUSINESS_CONFIG.contact.displayPhone} | WhatsApp: ${BUSINESS_CONFIG.contact.whatsappNumber}\n`;
    text += `--------------------------------\n`;

    lines.forEach((line, idx) => {
      text += `${idx + 1}. ${line.productNameLao}\n`;
      if (line.pricingMethod === "per_m2") {
        text += `   ຂະໜາດ: ${line.width}x${line.height} ${line.dimensionUnit} (${line.areaM2.toFixed(2)} m²)\n`;
      }
      text += `   ຈຳນວນ: ${line.quantity} | ລາຄາ: ${formatMoney(line.effectiveSubtotal)}\n`;
      if (line.notes) {
        text += `   ໝາຍເຫດ: ${line.notes}\n`;
      }
    });

    text += `--------------------------------\n`;
    text += `ຍອດລວມສິນຄ້າ: ${formatMoney(summary.linesSubtotal)}\n`;
    if (summary.charges.designFee > 0) {
      text += `ຄ່າອອກແບບ: ${formatMoney(summary.charges.designFee)}\n`;
    }
    if (summary.charges.laborFee > 0) {
      text += `ຄ່າແຮງ: ${formatMoney(summary.charges.laborFee)}\n`;
    }
    if (summary.charges.installationFee > 0) {
      text += `ຄ່າຕິດຕັ້ງ: ${formatMoney(summary.charges.installationFee)}\n`;
    }
    if (summary.charges.deliveryFee > 0) {
      text += `ຄ່າຈັດສົ່ງ: ${formatMoney(summary.charges.deliveryFee)}\n`;
    }
    if (summary.charges.extraServicesTotal > 0) {
      text += `ບໍລິການເສີມ: ${formatMoney(summary.charges.extraServicesTotal)}\n`;
    }
    if (summary.discountAmount > 0) {
      text += `ສ່ວນຫຼຸດ: -${formatMoney(summary.discountAmount)}\n`;
    }
    if (summary.taxAmount > 0) {
      text += `ອາກອນ VAT: +${formatMoney(summary.taxAmount)}\n`;
    }
    text += `\n⭐️ ຍອດລວມສຸດທິ: ${formatMoney(summary.total)}\n`;
    text += `\n* ໝາຍເຫດ: ລາຄານີ້ເປັນລາຄາປະເມີນເບື້ອງຕົ້ນ, ຕ້ອງໄດ້ຮັບການຢືນຢັນຈາກ Indie Sign ກ່ອນຜະລິດ.`;
    return text;
  };

  const handleCopy = async () => {
    try {
      const text = generatePlainTextQuote();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleWhatsApp = () => {
    const text = generatePlainTextQuote();
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${BUSINESS_CONFIG.contact.whatsappNumber}?text=${encoded}`;
    window.open(url, "_blank");
  };

  return (
    <div className="sticky top-24 rounded-3xl border border-border bg-card shadow-lg shadow-black/5 overflow-hidden">
      {/* Header */}
      <div className="bg-primary/10 border-b border-border/60 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            ສະຫຼຸບລາຄາປະເມີນ (Summary)
          </h2>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          ຄິດໄລ່ທັນທີຕາມ 8 ຂັ້ນຕອນມາດຕະຖານ
        </p>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Itemized Calculation Breakdown */}
        <div className="space-y-2 text-xs sm:text-sm">
          {/* 1. Lines Subtotal */}
          <div className="flex items-center justify-between text-muted-foreground">
            <span>ມູນຄ່າສິນຄ້າ ({lines.length} ລາຍການ)</span>
            <span className="font-semibold text-foreground">
              {formatMoney(summary.linesSubtotal)}
            </span>
          </div>

          {/* 2. Charges Breakdown */}
          {summary.charges.designFee > 0 && (
            <div className="flex items-center justify-between text-muted-foreground pl-2 border-l-2 border-primary/30">
              <span>ຄ່າອອກແບບ</span>
              <span className="font-medium text-foreground">
                +{formatMoney(summary.charges.designFee)}
              </span>
            </div>
          )}

          {summary.charges.laborFee > 0 && (
            <div className="flex items-center justify-between text-muted-foreground pl-2 border-l-2 border-primary/30">
              <span>ຄ່າແຮງງານ</span>
              <span className="font-medium text-foreground">
                +{formatMoney(summary.charges.laborFee)}
              </span>
            </div>
          )}

          {summary.charges.installationFee > 0 && (
            <div className="flex items-center justify-between text-muted-foreground pl-2 border-l-2 border-primary/30">
              <span>ຄ່າຕິດຕັ້ງ</span>
              <span className="font-medium text-foreground">
                +{formatMoney(summary.charges.installationFee)}
              </span>
            </div>
          )}

          {summary.charges.deliveryFee > 0 && (
            <div className="flex items-center justify-between text-muted-foreground pl-2 border-l-2 border-primary/30">
              <span>ຄ່າຈັດສົ່ງ</span>
              <span className="font-medium text-foreground">
                +{formatMoney(summary.charges.deliveryFee)}
              </span>
            </div>
          )}

          {summary.charges.extraServicesTotal > 0 && (
            <div className="flex items-center justify-between text-muted-foreground pl-2 border-l-2 border-primary/30">
              <span>ບໍລິການເສີມອື່ນໆ</span>
              <span className="font-medium text-foreground">
                +{formatMoney(summary.charges.extraServicesTotal)}
              </span>
            </div>
          )}

          {/* 3. Subtotal before discount */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50 font-medium text-foreground">
            <span>ລວມກ່ອນຫຼຸດຜ່ອນ</span>
            <span>{formatMoney(summary.subtotalBeforeDiscount)}</span>
          </div>

          {/* 4. Discount */}
          {summary.discountAmount > 0 && (
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
              <span>ສ່ວນຫຼຸດທີ່ໄດ້ຮັບ</span>
              <span>-{formatMoney(summary.discountAmount)}</span>
            </div>
          )}

          {/* 5. Tax */}
          {summary.taxAmount > 0 && (
            <div className="flex items-center justify-between text-muted-foreground">
              <span>ອາກອນມູນຄ່າເພີ່ມ (VAT)</span>
              <span className="font-medium text-foreground">
                +{formatMoney(summary.taxAmount)}
              </span>
            </div>
          )}
        </div>

        {/* Grand Total */}
        <div className="pt-3 border-t-2 border-border/80">
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-amber-500/10 to-transparent p-4 border border-primary/20">
            <span className="text-xs text-muted-foreground block font-medium">
              ຍອດລວມສຸດທິ (Grand Total)
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1 text-primary">
              {formatMoney(summary.total)}
            </div>
            <span className="text-[11px] text-muted-foreground block mt-1">
              ສະກຸນເງິນ: ກີບ (LAK)
            </span>
          </div>
        </div>

        {/* Disclaimer Note (Section 9 Requirement) */}
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <p className="leading-relaxed">
            <strong>ໝາຍເຫດ:</strong> ລາຄານີ້ເປັນລາຄາປະເມີນເບື້ອງຕົ້ນ. ລາຄາຕົວຈິງອາດມີການປ່ຽນແປງຂຶ້ນກັບສະພາບໜ້າວຽກຕົວຈິງ. ກະລຸນາຕິດຕໍ່ Indie Sign ເພື່ອຢືນຢັນລາຄາກ່ອນການຜະລິດ.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {/* Open Document Generator */}
          {onOpenDocumentWorkflow && (
            <Button
              type="button"
              onClick={onOpenDocumentWorkflow}
              disabled={lines.length === 0}
              className="w-full text-xs font-bold h-11 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
            >
              <FileText className="h-4 w-4 mr-2" />
              ອອກເອກະສານ PDF (Quotation / Invoice / Receipt)
            </Button>
          )}

          {/* Save Quote to History */}
          {onSaveQuote && (
            <Button
              type="button"
              variant="outline"
              onClick={onSaveQuote}
              disabled={lines.length === 0}
              className={`w-full text-xs font-bold h-10 ${
                isSaved
                  ? "border-emerald-500/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/5"
                  : "border-primary/40 text-primary hover:bg-primary/5"
              }`}
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-1.5" />
                  ບັນທຶກໃໝ່ / ອັບເດດໃບປະເມີນ
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1.5" />
                  ບັນທຶກໃບປະເມີນ (Save Quote)
                </>
              )}
            </Button>
          )}

          {/* Copy Plain Text */}
          <Button
            type="button"
            variant="outline"
            onClick={handleCopy}
            disabled={lines.length === 0}
            className="w-full text-xs font-semibold h-10 border-border hover:bg-muted"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1.5 text-emerald-600" />
                ຄັດລອກໃບປະເມີນລາຄາແລ້ວ!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1.5 text-muted-foreground" />
                ຄັດລອກໃບປະເມີນລາຄາ (Copy Quote)
              </>
            )}
          </Button>

          {/* WhatsApp Direct */}
          <Button
            type="button"
            onClick={handleWhatsApp}
            disabled={lines.length === 0}
            className="w-full text-xs font-semibold h-10 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <MessageCircle className="h-4 w-4 mr-1.5" />
            ສົ່ງໃຫ້ Indie Sign ທາງ WhatsApp
          </Button>

          {/* Reset All */}
          {lines.length > 0 && (
            <div className="pt-2 text-center">
              {showConfirmReset ? (
                <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 space-y-1.5">
                  <span className="text-xs text-destructive font-medium block">
                    ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລ້າງລາຍການທັງໝົດ?
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowConfirmReset(false);
                        onReset();
                      }}
                      className="px-3 py-1 bg-destructive text-white rounded-lg text-xs font-semibold hover:bg-destructive/90"
                    >
                      ລ້າງຂໍ້ມູນ
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowConfirmReset(false)}
                      className="px-3 py-1 bg-muted text-muted-foreground rounded-lg text-xs font-medium hover:bg-muted/80"
                    >
                      ຍົກເລີກ
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(true)}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors inline-flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  ລ້າງລາຍການທັງໝົດ (Reset)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
