/**
 * Step 4 — Price Summary
 * Detailed cost breakdown with animated reveal and action buttons.
 */

import { Download, MessageCircle, PhoneCall, RefreshCw, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatLAK, formatArea } from "@/lib/calculator";
import type { CalculationResult } from "@/types/signage";
import type { SignageProduct, MaterialOption } from "@/types/signage";
import { BUSINESS_CONFIG } from "@/constants/business";

interface PriceSummaryProps {
  result: CalculationResult;
  product: SignageProduct;
  material?: MaterialOption;
  widthCm: number;
  heightCm: number;
  quantity: number;
  hasLed: boolean;
  ledType: string;
  hasInstallation: boolean;
  onGoToQuote: () => void;
  onReset: () => void;
}

export function PriceSummary({
  result,
  product,
  material,
  widthCm,
  heightCm,
  quantity,
  hasLed,
  ledType,
  hasInstallation,
  onGoToQuote,
  onReset,
}: PriceSummaryProps) {
  const matLabel = material ? material.nameLao : product.titleLao;

  const LED_TYPE_LABELS: Record<string, string> = {
    standard: "ມາດຕະຖານ",
    highbright: "ຄວາມສະຫວ່າງສູງ",
    rgb: "RGB ປ່ຽນສີ",
    neon: "Neon Flex",
  };

  return (
    <div className="space-y-6">
      {/* Input summary */}
      <div className="rounded-2xl border border-border bg-muted/30 p-5 space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ສະຫຼຸບ Input</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <SummaryRow label="ສິນຄ້າ" value={product.titleLao} />
          <SummaryRow label="ວັດສະດຸ" value={material ? material.nameLao : "ລາຄາໂຄງສ້າງ"} />
          <SummaryRow label="ຂະໜາດ" value={`${widthCm} × ${heightCm} ຊມ`} />
          <SummaryRow label="ເນື້ອທີ່" value={formatArea(result.areaM2)} />
          <SummaryRow label="ຈຳນວນ" value={`${quantity} ອັນ`} />
          {hasLed && <SummaryRow label="ໄຟ LED" value={LED_TYPE_LABELS[ledType] ?? ledType} />}
          {hasInstallation && <SummaryRow label="ຕິດຕັ້ງ" value="ລວມ" />}
        </div>
      </div>

      {/* Cost breakdown */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-card to-orange-500/5 overflow-hidden">
        <div className="px-5 py-4 border-b border-border/60">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">ລາຍລະອຽດລາຄາ</p>
        </div>

        <div className="px-5 py-4 space-y-3">
          <CostRow label={`ຄ່າວັດສະດຸ (${matLabel})`} amount={result.materialCost} />

          {result.lightingCost > 0 && (
            <CostRow
              label={`ຄ່າໄຟ LED (${LED_TYPE_LABELS[ledType] ?? ledType})`}
              amount={result.lightingCost}
              accent="amber"
            />
          )}

          {result.installationCost > 0 && (
            <CostRow
              label="ຄ່າຕິດຕັ້ງໜ້າວຽກ"
              amount={result.installationCost}
              accent="emerald"
            />
          )}

          <div className="border-t border-border/60 pt-3 space-y-2">
            <CostRow label="ລວມກ່ອນສ່ວນຫຼຸດ" amount={result.subtotal} muted />

            {result.discount > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <TrendingDown className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                    ສ່ວນຫຼຸດ ({quantity >= 5 ? "10%" : "5%"})
                  </span>
                </div>
                <span className="text-sm font-semibold font-sans text-emerald-600 dark:text-emerald-400">
                  − {formatLAK(result.discount)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Grand total */}
        <div className="bg-primary px-5 py-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-primary-foreground/70 font-medium">ລວມທັງໝົດ (ບໍ່ລວມ VAT)</p>
            <p className="text-3xl font-extrabold font-sans text-primary-foreground tracking-tight">
              {formatLAK(result.total)}
            </p>
          </div>
          {result.discount > 0 && (
            <Badge className="bg-white/20 text-white border-white/30 text-xs font-bold">
              ປະຢັດ {formatLAK(result.discount)}
            </Badge>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
          ⚠️ ລາຄານີ້ເປັນການ<strong>ປະເມີນເບື້ອງຕົ້ນ</strong>ເທົ່ານັ້ນ. ລາຄາສຸດທ້າຍອາດມີການປ່ຽນແປງຕາມ
          ລາຍລະອຽດໜ້າວຽກ, ການສຳຫຼວດ, ແລະ ຄ່າຂົນສົ່ງ.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-2">
        <Button
          variant="orangeGlow"
          size="lg"
          className="rounded-xl font-semibold flex-1 min-w-[160px]"
          onClick={onGoToQuote}
        >
          <Download className="h-4 w-4" />
          ດາວໂຫລດໃບສະເໜີລາຄາ PDF
        </Button>

        <Button
          asChild
          variant="outline"
          size="lg"
          className="rounded-xl font-semibold flex-1 min-w-[160px]"
        >
          <a
            href={BUSINESS_CONFIG.social.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4 text-emerald-500" />
            ສົ່ງໃຫ້ທີມງານຜ່ານ WhatsApp
          </a>
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="ghost" size="sm" className="rounded-xl text-muted-foreground">
          <a href={`tel:${BUSINESS_CONFIG.contact.phone}`} className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4 text-primary" />
            <span>{BUSINESS_CONFIG.contact.displayPhone}</span>
          </a>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="rounded-xl text-muted-foreground"
          onClick={onReset}
        >
          <RefreshCw className="h-4 w-4" />
          ຄຳນວນໃໝ່ອີກຄັ້ງ
        </Button>
      </div>
    </div>
  );
}

// --- Sub-components ---

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span className="text-muted-foreground text-xs">{label}:</span>
      <span className="text-foreground text-xs font-medium">{value}</span>
    </>
  );
}

function CostRow({
  label,
  amount,
  accent,
  muted,
}: {
  label: string;
  amount: number;
  accent?: "amber" | "emerald";
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={cn(
          "text-sm",
          muted
            ? "text-muted-foreground"
            : accent === "amber"
            ? "text-amber-700 dark:text-amber-400"
            : accent === "emerald"
            ? "text-emerald-700 dark:text-emerald-400"
            : "text-foreground"
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "text-sm font-semibold font-sans",
          muted
            ? "text-muted-foreground"
            : accent === "amber"
            ? "text-amber-700 dark:text-amber-400"
            : accent === "emerald"
            ? "text-emerald-700 dark:text-emerald-400"
            : "text-foreground"
        )}
      >
        {formatLAK(amount)}
      </span>
    </div>
  );
}
