import React, { useState, useEffect } from "react";
import { QuestionnaireFormData, ProductCategory } from "@/types/questionnaire";
import { StepIndicator } from "@/components/order/StepIndicator";
import { Step1ProductSelect } from "@/components/order/Step1ProductSelect";
import { Step2MaterialDetails } from "@/components/order/Step2MaterialDetails";
import { Step3JobSpecs } from "@/components/order/Step3JobSpecs";
import { Step4CustomerReview } from "@/components/order/Step4CustomerReview";
import { PageContainer } from "@/components/common/PageContainer";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";

const STORAGE_KEY = "indie_sign_order_draft_v1";

const INITIAL_FORM_DATA: QuestionnaireFormData = {
  category: "vinyl",
  vinylType: "standard",
  vinylSurface: "white_back",
  stickerType: "glossy_white",
  cncMaterial: "plastwood",
  plastwoodType: "hard",
  plastwoodThickness: "10mm",
  steelFinish: "glossy",
  stainlessThickness: "",
  stainlessFinish: "glossy",
  cncLedOption: "none",
  cncCustomNotes: "",
  beachFlagType: "wing",
  beachFlagSize: "M",
  beachFlagBase: "water_tank",
  dimensions: {
    width: 200,
    height: 100,
    unit: "cm",
  },
  quantity: 1,
  printResolution: "fine",
  finishingOptions: ["eyelets"],
  dueDate: "",
  isUrgent: false,
  designStatus: "ready",
  description: "",
  customerName: "",
  customerPhone: "",
};

export const OrderPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<QuestionnaireFormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_FORM_DATA, ...parsed };
      }
    } catch {
      // LocalStorage not accessible
    }
    return INITIAL_FORM_DATA;
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>("");

  // Auto-save draft to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      const now = new Date();
      setLastSavedTime(
        `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      );
    } catch {
      // Ignore quota errors
    }
  }, [formData]);

  const updateFormData = (data: Partial<QuestionnaireFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    if (validationError) setValidationError(null);
  };

  // Handle changing product category: clean incompatible sub-fields
  const handleSelectCategory = (category: ProductCategory) => {
    if (category === formData.category) return;

    let defaultFinishings: string[] = [];
    if (category === "vinyl") defaultFinishings = ["eyelets"];
    if (category === "sticker") defaultFinishings = ["diecut"];

    setFormData((prev) => ({
      ...prev,
      category,
      finishingOptions: defaultFinishings,
    }));
    setValidationError(null);
  };

  // Validation before going to next step
  const validateStep = (step: number): boolean => {
    setValidationError(null);

    if (step === 1) {
      if (!formData.category) {
        setValidationError("ກະລຸນາເລືອກປະເພດວຽກ 1 ລາຍການກ່ອນໄປຂັ້ນຕໍ່ໄປ");
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (formData.category === "cnc" && formData.cncMaterial === "stainless") {
        if (!formData.stainlessThickness?.trim()) {
          setValidationError("ກະລຸນາລະບຸຄວາມໜາຂອງແຜ່ນສະແຕນເລດ (ເຊັ່ນ: 1.2 mm)");
          return false;
        }
      }
      return true;
    }

    if (step === 3) {
      if (formData.category === "vinyl" || formData.category === "sticker") {
        const w = Number(formData.dimensions.width);
        const h = Number(formData.dimensions.height);
        if (!w || w <= 0 || !h || h <= 0) {
          setValidationError("ກະລຸນາປ້ອນລວງກວ້າງ ແລະ ລວງສູງໃຫ້ຖືກຕ້ອງ (ມູນຄ່າຕ້ອງຫຼາຍກວ່າ 0)");
          return false;
        }
      }

      if (formData.category === "cnc") {
        if (!formData.description?.trim()) {
          setValidationError("ກະລຸນາປ້ອນຂໍ້ຄວາມປ້າຍ ຫຼື ຂະໜາດໂດຍປະມານທີ່ຕ້ອງການຕັດ");
          return false;
        }
      }

      const qty = Number(formData.quantity);
      if (!qty || qty <= 0) {
        setValidationError("ກະລຸນາປ້ອນຈຳນວນທີ່ຕ້ອງການ (ຢ່າງໜ້ອຍ 1 ຊິ້ນ)");
        return false;
      }

      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 80, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setValidationError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 80, behavior: "smooth" });
  };

  const handleReset = () => {
    setShowResetDialog(true);
  };

  const confirmReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(1);
    setValidationError(null);
    setShowResetDialog(false);
  };

  return (
    <>
      <PageContainer className="py-6 sm:py-10 max-w-4xl pb-28 sm:pb-12">
        {/* Modern Immersive Header */}
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-b from-orange-500/[0.07] via-card to-card p-6 sm:p-10 shadow-xs">
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Indie Sign Questionnaire Form
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              ອະທິບາຍລາຍລະອຽດ ແລະ ຄວາມຕ້ອງການຂອງລູກຄ້າ
            </h1>

            <p className="mt-3 max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
              ກະລຸນາເລືອກປະເພດວຽກ ແລະ ລະບຸລາຍລະອຽດໃຫ້ຄົບຖ້ວນ ເພື່ອໃຫ້ຮ້ານສາມາດປະເມີນວຽກ ແລະ ໃຫ້ລາຄາໄດ້ຖືກຕ້ອງ ແລະ ວ່ອງໄວ.
            </p>

            {/* Live Draft Persistence Status */}
            <div className="mt-4 flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2.5 py-0.5 font-medium">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                ບັນທຶກແບບຮ່າງອັດຕະໂນມັດ {lastSavedTime ? `(${lastSavedTime})` : ""}
              </span>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                title="ລ້າງຂໍ້ມູນແບບຮ່າງ"
              >
                <RotateCcw className="h-3 w-3" />
                <span>ເລີ່ມໃໝ່</span>
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="relative z-10 mt-8 pt-6 border-t border-border/50">
            <StepIndicator
              currentStep={currentStep}
              totalSteps={4}
              onStepClick={(step) => {
                if (step < currentStep) {
                  setCurrentStep(step);
                }
              }}
            />
          </div>
        </div>

        {/* Validation Error Alert */}
        {validationError && (
          <div className="mb-6 flex items-center gap-2.5 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-xs font-semibold text-destructive animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Step Views Container */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm">
          {currentStep === 1 && (
            <Step1ProductSelect
              selectedCategory={formData.category}
              onSelectCategory={handleSelectCategory}
            />
          )}

          {currentStep === 2 && (
            <Step2MaterialDetails
              formData={formData}
              updateFormData={updateFormData}
            />
          )}

          {currentStep === 3 && (
            <Step3JobSpecs
              formData={formData}
              updateFormData={updateFormData}
            />
          )}

          {currentStep === 4 && (
            <Step4CustomerReview
              formData={formData}
              updateFormData={updateFormData}
              onGoToStep={setCurrentStep}
              onReset={handleReset}
            />
          )}

          {/* Desktop Navigation Buttons */}
          <div className="hidden sm:flex mt-10 items-center justify-between border-t border-border/50 pt-6">
            <div>
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="rounded-xl px-5 h-11 text-xs font-bold hover:bg-muted"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  ກັບຄືນ
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="rounded-xl px-7 h-11 text-xs font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/25 transition-all hover:scale-[1.02]"
                >
                  <span>ຂັ້ນຕໍ່ໄປ</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Mobile Sticky Bottom Action Bar */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-background/95 backdrop-blur-md px-4 py-3 shadow-lg">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="rounded-xl px-4 h-10 text-xs font-bold"
              >
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                ກັບຄືນ
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 4 && (
              <Button
                type="button"
                size="sm"
                onClick={handleNext}
                className="flex-1 rounded-xl h-10 text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25"
              >
                <span>ຂັ້ນຕໍ່ໄປ</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </PageContainer>

      {/* Confirmation Dialog for Resetting Draft */}
      <ConfirmationDialog
        isOpen={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        onConfirm={confirmReset}
        title="ລ້າງຂໍ້ມູນເລີ່ມຕົ້ນໃໝ່?"
        description="ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຂໍ້ມູນທີ່ປ້ອນໄວ້ທັງໝົດ? ຂໍ້ມູນແບບຮ່າງຈະຖືກລຶບອອກຈາກເຄື່ອງຂອງທ່ານ."
        confirmLabel="ລ້າງຂໍ້ມູນ"
        cancelLabel="ຍົກເລີກ"
        variant="danger"
      />
    </>
  );
};
