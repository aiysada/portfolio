/**
 * Indie Sign — Multi-Line Price Calculator Page
 * Lao-first signage price calculation system with full line-item management,
 * dimension conversions, additional charges, discounts, taxes, and instant recalculation.
 */

import { useState, useEffect } from "react";
import {
  Calculator,
  Plus,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { PageContainer } from "@/components/common/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Calculator hook and components
import { useQuoteCalculator } from "@/hooks/useQuoteCalculator";
import { QuoteLineItemCard } from "@/components/calculator/QuoteLineItemCard";
import { AddLineSelector } from "@/components/calculator/AddLineSelector";
import { AdditionalChargesSection } from "@/components/calculator/AdditionalChargesSection";
import { DiscountTaxSection } from "@/components/calculator/DiscountTaxSection";
import { QuoteSummaryCard } from "@/components/calculator/QuoteSummaryCard";
import { DocumentWorkflowDialog } from "@/components/documents/DocumentWorkflowDialog";
import { SaveQuoteDialog } from "@/components/calculator/SaveQuoteDialog";

export function CalculatorPage() {
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  // Track whether the current session's quote has been saved (to offer update vs. new copy)
  const [savedRecordId, setSavedRecordId] = useState<string | undefined>(undefined);
  const {
    lines,
    charges,
    discount,
    tax,
    summary,
    products,
    addLine,
    addCustomLine,
    removeLine,
    duplicateLine,
    updateLineDimensions,
    updateLineQuantity,
    updateLineUnitPrice,
    updateLineNotes,
    updateLinePricingMethod,
    updateLineProduct,
    updateCharge,
    addExtraService,
    removeExtraService,
    updateDiscount,
    updateTax,
    resetAll,
  } = useQuoteCalculator();

  // On first load, add 1 default line (Black-back vinyl) if list is empty
  useEffect(() => {
    if (lines.length === 0) {
      addLine("calc-vinyl-black");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContainer size="default">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
          <Calculator className="h-3.5 w-3.5" />
          <span>ລະບົບຄຳນວນລາຄາປ້າຍອອນລາຍ</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
          ຄຳນວນລາຄາປ້າຍ ແລະ ວັດສະດຸໂຄສະນາ
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          ລະບົບປະເມີນລາຄາອັດຕະໂນມັດ Lao-first — ປັບຂະໜາດ, ເລືອກວັດສະດຸ, ເພີ່ມບໍລິການຕິດຕັ້ງ ແລະ ອອກແບບໄດ້ທັນທີ
        </p>

        {/* Feature Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-primary" />
            ຄິດໄລ່ທັນທີ Realtime
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            ໂປ່ງໃສ ແຍກລາຍລະອຽດຊັດເຈນ
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            ສະກຸນເງິນກີບ (LAK)
          </span>
        </div>
      </div>

      {/* Main 2-column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Line items and configuration (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Section 1: Line Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-foreground">
                  ລາຍການປ້າຍທີ່ຕ້ອງການ ({lines.length})
                </h2>
                <Badge variant="outline" className="text-xs">
                  {lines.length} ລາຍການ
                </Badge>
              </div>

              {lines.length > 0 && (
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  ສາມາດແກ້ໄຂຂະໜາດ, ລາຄາ ແລະ ຈຳນວນໄດ້ທຸກລາຍການ
                </span>
              )}
            </div>

            {/* Empty State */}
            {lines.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-border/80 p-8 text-center bg-card">
                <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                  <Calculator className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">
                  ຍັງບໍ່ມີລາຍການປ້າຍໃນໃບປະເມີນ
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
                  ກະລຸນາເລືອກຊະນິດປ້າຍ ຫຼື ວັດສະດຸທີ່ທ່ານຕ້ອງການຄຳນວນລາຄາຈາກລາຍການຂ້າງລຸ່ມ
                </p>
                <Button
                  type="button"
                  onClick={() => addLine("calc-vinyl-black")}
                  className="text-xs"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  + ເພີ່ມປ້າຍໄວນິວຫຼັງດຳທັນທີ
                </Button>
              </div>
            ) : (
              /* Line Items List */
              <div className="space-y-3.5">
                {lines.map((line, idx) => (
                  <QuoteLineItemCard
                    key={line.id}
                    line={line}
                    index={idx}
                    onUpdateDimensions={(w, h, u) =>
                      updateLineDimensions(line.id, w, h, u)
                    }
                    onUpdateQuantity={(q) => updateLineQuantity(line.id, q)}
                    onUpdateUnitPrice={(p) => updateLineUnitPrice(line.id, p)}
                    onUpdatePricingMethod={(m) =>
                      updateLinePricingMethod(line.id, m)
                    }
                    onUpdateProduct={(prodId) =>
                      updateLineProduct(line.id, prodId)
                    }
                    onUpdateNotes={(n) => updateLineNotes(line.id, n)}
                    onDuplicate={() => duplicateLine(line.id)}
                    onRemove={() => removeLine(line.id)}
                  />
                ))}
              </div>
            )}

            {/* Quick Add Selector */}
            <AddLineSelector
              products={products}
              onAddProduct={(prodId) => addLine(prodId)}
              onAddCustom={addCustomLine}
            />
          </div>

          {/* Section 2: Additional Charges (Design, Labor, Install, Delivery, Extra) */}
          <AdditionalChargesSection
            charges={charges}
            onUpdateCharge={updateCharge}
            onAddExtraService={addExtraService}
            onRemoveExtraService={removeExtraService}
          />

          {/* Section 3: Discounts and Taxes */}
          <DiscountTaxSection
            discount={discount}
            tax={tax}
            onUpdateDiscount={updateDiscount}
            onUpdateTax={updateTax}
          />
        </div>

        {/* Right Column: Sticky Summary and Actions (5 cols) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <QuoteSummaryCard
            summary={summary}
            lines={lines}
            onReset={resetAll}
            onOpenDocumentWorkflow={() => setIsDocModalOpen(true)}
            onSaveQuote={() => setIsSaveModalOpen(true)}
            isSaved={!!savedRecordId}
          />
        </div>
      </div>

      {/* Document Workflow & PDF Generation Modal */}
      <DocumentWorkflowDialog
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        lines={lines}
        charges={charges}
        discount={discount}
        tax={tax}
        summary={summary}
      />

      {/* Save Quote Dialog */}
      <SaveQuoteDialog
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        lines={lines}
        charges={charges}
        discount={discount}
        tax={tax}
        summary={summary}
        existingRecordId={savedRecordId}
        onSaved={(id) => setSavedRecordId(id)}
      />
    </PageContainer>
  );
}
