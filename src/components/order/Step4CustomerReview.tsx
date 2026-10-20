import React, { useState } from "react";
import { QuestionnaireFormData } from "@/types/questionnaire";
import {
  PRODUCT_OPTIONS,
  VINYL_TYPES,
  VINYL_SURFACES_STANDARD,
  VINYL_SURFACES_KOREAN,
  STICKER_TYPES,
  CNC_MATERIALS,
  METAL_FINISHES,
  BEACH_FLAG_TYPES,
  BEACH_FLAG_SIZES,
  BEACH_FLAG_BASES,
  PRINT_RESOLUTIONS,
  VINYL_FINISHING_OPTIONS,
  STICKER_FINISHING_OPTIONS,
} from "@/data/questionnaireData";
import { BUSINESS_CONFIG } from "@/constants/business";
import { useOwnerSettings } from "@/context/OwnerSettingsContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Send,
  Copy,
  Check,
  AlertTriangle,
  RotateCcw,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Step4CustomerReviewProps {
  formData: QuestionnaireFormData;
  updateFormData: (data: Partial<QuestionnaireFormData>) => void;
  onGoToStep: (step: number) => void;
  onReset: () => void;
}

export const Step4CustomerReview: React.FC<Step4CustomerReviewProps> = ({
  formData,
  updateFormData,
  onGoToStep,
  onReset,
}) => {
  const { settings } = useOwnerSettings();
  const [copied, setCopied] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");

  const targetWaNumber =
    settings?.business?.phone?.replace(/\D/g, "") ||
    BUSINESS_CONFIG.contact.whatsappNumber ||
    "8562058563868";

  // Resolve human-readable labels for summary
  const productObj = PRODUCT_OPTIONS.find((p) => p.id === formData.category);
  const vinylTypeObj = VINYL_TYPES.find((v) => v.id === formData.vinylType);
  const vinylSurfaces =
    formData.vinylType === "standard" ? VINYL_SURFACES_STANDARD : VINYL_SURFACES_KOREAN;
  const vinylSurfaceObj = vinylSurfaces.find((s) => s.id === formData.vinylSurface);
  const stickerTypeObj = STICKER_TYPES.find((s) => s.id === formData.stickerType);
  const cncMatObj = CNC_MATERIALS.find((c) => c.id === formData.cncMaterial);
  const flagTypeObj = BEACH_FLAG_TYPES.find((f) => f.id === formData.beachFlagType);
  const flagSizeObj = BEACH_FLAG_SIZES.find((s) => s.size === formData.beachFlagSize);
  const flagBaseObj = BEACH_FLAG_BASES.find((b) => b.id === formData.beachFlagBase);
  const resObj = PRINT_RESOLUTIONS.find((r) => r.id === formData.printResolution);

  const formatFinishing = () => {
    if (!formData.finishingOptions || formData.finishingOptions.length === 0) return "ບໍ່ລະບຸ";
    if (formData.category === "vinyl") {
      return formData.finishingOptions
        .map((id) => VINYL_FINISHING_OPTIONS.find((o) => o.id === id)?.titleLao || id)
        .join(", ");
    }
    if (formData.category === "sticker") {
      return formData.finishingOptions
        .map((id) => STICKER_FINISHING_OPTIONS.find((o) => o.id === id)?.titleLao || id)
        .join(", ");
    }
    return formData.finishingOptions.join(", ");
  };

  // Compile formatted WhatsApp message
  const buildWhatsAppMessage = (): string => {
    const lines: string[] = [];

    lines.push(`🌟 *ລາຍລະອຽດຄວາມຕ້ອງການສັ່ງເຮັດວຽກ (Indie Sign)* 🌟`);
    lines.push(`─────────────────────────────`);
    lines.push(`👤 *ຊື່ລູກຄ້າ:* ${formData.customerName.trim() || "-"}`);
    lines.push(`📞 *ເບີໂທລະສັບ:* ${formData.customerPhone.trim() || "-"}`);
    lines.push(`🏷️ *ປະເພດວຽກ:* ${productObj?.titleLao || "-"} (${productObj?.titleEn || ""})`);

    // Specific product details
    if (formData.category === "vinyl") {
      lines.push(`📦 *ປະເພດຜ້າໄວນິວ:* ${vinylTypeObj?.titleLao || "-"}`);
      lines.push(`✨ *ລັກສະນະຜິວ:* ${vinylSurfaceObj?.titleLao || "-"}`);
      if (formData.dimensions.width && formData.dimensions.height) {
        lines.push(
          `📐 *ຂະໜາດ:* ${formData.dimensions.width} × ${formData.dimensions.height} ${formData.dimensions.unit}`
        );
      }
      lines.push(`🔢 *ຈຳນວນ:* ${formData.quantity || 1} ຊິ້ນ`);
      lines.push(`🖨️ *ຄວາມລະອຽດພິມ:* ${resObj?.titleLao || "-"}`);
      lines.push(`✂️ *ງານສຳເລັດຮູບ:* ${formatFinishing()}`);
    } else if (formData.category === "sticker") {
      lines.push(`📦 *ປະເພດສະຕິກເກີ:* ${stickerTypeObj?.titleLao || "-"}`);
      if (formData.dimensions.width && formData.dimensions.height) {
        lines.push(
          `📐 *ຂະໜາດ:* ${formData.dimensions.width} × ${formData.dimensions.height} ${formData.dimensions.unit}`
        );
      }
      lines.push(`🔢 *ຈຳນວນ:* ${formData.quantity || 1} ຊິ້ນ`);
      lines.push(`🖨️ *ຄວາມລະອຽດພິມ:* ${resObj?.titleLao || "-"}`);
      lines.push(`✂️ *ງານສຳເລັດຮູບ:* ${formatFinishing()}`);
    } else if (formData.category === "cnc") {
      lines.push(`🪵 *ວັດສະດຸ:* ${cncMatObj?.titleLao || "-"}`);
      if (formData.cncMaterial === "plastwood") {
        lines.push(`• ແບບ: ${formData.plastwoodType === "hard" ? "ແບບແຂງ" : "ແບບອ່ອນ"}`);
        lines.push(`• ຄວາມໜາ: ${formData.plastwoodThickness || "-"}`);
      } else if (formData.cncMaterial === "steel") {
        lines.push(
          `• ຜິວເຫຼັກ: ${METAL_FINISHES.find((f) => f.value === formData.steelFinish)?.label || "-"}`
        );
      } else if (formData.cncMaterial === "stainless") {
        lines.push(`• ຄວາມໜາສະແຕນເລດ: ${formData.stainlessThickness || "-"}`);
        lines.push(
          `• ຜິວ: ${METAL_FINISHES.find((f) => f.value === formData.stainlessFinish)?.label || "-"}`
        );
      }
      if (formData.cncLedOption && formData.cncLedOption !== "none") {
        lines.push(`💡 *ໄຟ LED:* ${formData.cncLedOption}`);
      }
      lines.push(`🔢 *ຈຳນວນ:* ${formData.quantity || 1} ຊຸດ`);
    } else if (formData.category === "beach_flag") {
      lines.push(`🚩 *ຮູບແບບທຸງ:* ${flagTypeObj?.titleLao || "-"}`);
      lines.push(
        `📏 *ຂະໜາດ Size ${flagSizeObj?.size}:* ຜ້າ ${flagSizeObj?.clothDimension || ""}, ເສົາ ${flagSizeObj?.poleHeight || ""}`
      );
      lines.push(`⚓ *ຖານຂາຕັ້ງ:* ${flagBaseObj?.titleLao || "-"}`);
      lines.push(`🔢 *ຈຳນວນ:* ${formData.quantity || 1} ຊຸດ`);
    }

    // Shared Fields
    lines.push(`─────────────────────────────`);
    lines.push(`📅 *ວັນທີຕ້ອງການນຳໃຊ້:* ${formData.dueDate || "ບໍ່ໄດ້ກຳນົດ"}`);
    lines.push(`⚡ *ລະດັບຄວາມຮີບດ່ວນ:* ${formData.isUrgent ? "🚨 ງານດ່ວນ (Urgent)" : "ປົກກະຕິ (Standard)"}`);
    lines.push(
      `🎨 *ສະຖານະໄຟລ໌ແບບ:* ${
        formData.designStatus === "ready"
          ? "ມີແບບພ້ອມພິມແລ້ວ (ຈະສົ່ງຮູບ/ໄຟລ໌ໃນແຊັດ)"
          : "ຍັງບໍ່ມີແບບ (ໃຫ້ຮ້ານອອກແບບ)"
      }`
    );

    if (formData.description?.trim()) {
      lines.push(`📝 *ລາຍລະອຽດເພີ່ມເຕີມ:* ${formData.description.trim()}`);
    }

    lines.push(`─────────────────────────────`);
    lines.push(`_ຂໍ້ຄວາມສົ່ງຈາກແບບຟອມປະເມີນລາຄາ Indie Sign Website_`);

    return lines.join("\n");
  };

  const validateContact = (): boolean => {
    let isValid = true;
    if (!formData.customerName.trim()) {
      setNameError("ກະລຸນາປ້ອນຊື່ລູກຄ້າ ຫຼື ຊື່ອົງກອນ");
      isValid = false;
    } else {
      setNameError("");
    }

    const cleanPhone = formData.customerPhone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 6) {
      setPhoneError("ກະລຸນາປ້ອນເບີໂທລະສັບທີ່ຖືກຕ້ອງ (ຢ່າງໜ້ອຍ 6-8 ຕົວເລກ)");
      isValid = false;
    } else {
      setPhoneError("");
    }

    return isValid;
  };

  const handleSendWhatsApp = () => {
    if (!validateContact()) return;

    const message = buildWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${targetWaNumber}?text=${encoded}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyMessage = async () => {
    if (!validateContact()) return;

    const message = buildWhatsAppMessage();
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          ຂໍ້ມູນຕິດຕໍ່ ແລະ ສະຫຼຸບລາຍລະອຽດກ່ອນສົ່ງ
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          ກະລຸນາກວດສອບຄວາມຖືກຕ້ອງ ແລະ ປ້ອນຂໍ້ມູນຕິດຕໍ່ ເພື່ອໃຫ້ທີມງານ Indie Sign ສາມາດປະເມີນລາຄາ ແລະ ຕິດຕໍ່ກັບໄດ້ໄວ
        </p>
      </div>

      {/* Customer Info Card */}
      <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/[0.04] via-card to-card p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm sm:text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/15 text-orange-600 dark:text-orange-400">
            <User className="h-4 w-4" />
          </div>
          <span>ຂໍ້ມູນຜູ້ຕິດຕໍ່ / ສັ່ງເຮັດວຽກ</span>
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="customer-name" className="text-xs font-bold text-foreground">
              ຊື່ບຸກຄົນ ຫຼື ຊື່ອົງກອນ: <span className="text-orange-500">*</span>
            </Label>
            <Input
              id="customer-name"
              placeholder="ເຊັ່ນ: ທ້າວ ສົມສັກ ຫຼື ບໍລິສັດ ຈະເລີນໄຊ"
              value={formData.customerName}
              onChange={(e) => {
                updateFormData({ customerName: e.target.value });
                if (nameError) setNameError("");
              }}
              className={cn("h-11 rounded-xl text-xs", nameError && "border-destructive focus:ring-destructive")}
            />
            {nameError && <p className="text-[11px] font-medium text-destructive">{nameError}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="customer-phone" className="text-xs font-bold text-foreground flex items-center justify-between">
              <span>ເບີໂທລະສັບ / WhatsApp: <span className="text-orange-500">*</span></span>
              <span className="text-[10px] text-muted-foreground font-normal">ເຊັ່ນ: 020 58563868</span>
            </Label>
            <Input
              id="customer-phone"
              placeholder="020 XXXXXXXX"
              value={formData.customerPhone}
              onChange={(e) => {
                updateFormData({ customerPhone: e.target.value });
                if (phoneError) setPhoneError("");
              }}
              className={cn("h-11 rounded-xl text-xs font-mono", phoneError && "border-destructive focus:ring-destructive")}
            />
            {phoneError && <p className="text-[11px] font-medium text-destructive">{phoneError}</p>}
          </div>
        </div>
      </div>

      {/* Summary Review Ticket Card */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-foreground">ສະຫຼຸບລາຍການທີ່ເລືອກ</h3>
            <p className="text-[11px] text-muted-foreground">ກວດສອບຄວາມຖືກຕ້ອງກ່ອນເປີດ WhatsApp</p>
          </div>
          <span className="rounded-xl bg-gradient-to-r from-orange-500/15 to-amber-500/15 border border-orange-500/30 px-3 py-1 text-xs font-bold text-orange-600 dark:text-orange-400">
            {productObj?.titleLao}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5 text-xs">
          <div className="flex justify-between py-1.5 border-b border-border/30">
            <span className="text-muted-foreground">ປະເພດວຽກ:</span>
            <span className="font-bold text-foreground">{productObj?.titleLao}</span>
          </div>

          {formData.category === "vinyl" && (
            <>
              <div className="flex justify-between py-1.5 border-b border-border/30">
                <span className="text-muted-foreground">ປະເພດຜ້າ:</span>
                <span className="font-bold text-foreground">{vinylTypeObj?.titleLao}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/30">
                <span className="text-muted-foreground">ຜິວວັດສະດຸ:</span>
                <span className="font-bold text-foreground">{vinylSurfaceObj?.titleLao}</span>
              </div>
            </>
          )}

          {formData.category === "sticker" && (
            <div className="flex justify-between py-1.5 border-b border-border/30">
              <span className="text-muted-foreground">ປະເພດສະຕິກເກີ:</span>
              <span className="font-bold text-foreground">{stickerTypeObj?.titleLao}</span>
            </div>
          )}

          {formData.category === "cnc" && (
            <>
              <div className="flex justify-between py-1.5 border-b border-border/30">
                <span className="text-muted-foreground">ວັດສະດຸ:</span>
                <span className="font-bold text-foreground">{cncMatObj?.titleLao}</span>
              </div>
              {formData.cncMaterial === "plastwood" && (
                <div className="flex justify-between py-1.5 border-b border-border/30">
                  <span className="text-muted-foreground">ຄວາມໜາ:</span>
                  <span className="font-bold text-foreground">{formData.plastwoodThickness || "10mm"} ({formData.plastwoodType === "hard" ? "ແບບແຂງ" : "ແບບອ່ອນ"})</span>
                </div>
              )}
              {formData.cncMaterial === "stainless" && (
                <div className="flex justify-between py-1.5 border-b border-border/30">
                  <span className="text-muted-foreground">ສະແຕນເລດ:</span>
                  <span className="font-bold text-foreground">{formData.stainlessThickness || "-"} ({formData.stainlessFinish || "glossy"})</span>
                </div>
              )}
            </>
          )}

          {formData.category === "beach_flag" && (
            <>
              <div className="flex justify-between py-1.5 border-b border-border/30">
                <span className="text-muted-foreground">ຊົງທຸງ:</span>
                <span className="font-bold text-foreground">{flagTypeObj?.titleLao}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/30">
                <span className="text-muted-foreground">ຂະໜາດ:</span>
                <span className="font-bold text-foreground">Size {flagSizeObj?.size} ({flagSizeObj?.clothDimension})</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/30">
                <span className="text-muted-foreground">ຖານຂາຕັ້ງ:</span>
                <span className="font-bold text-foreground">{flagBaseObj?.titleLao}</span>
              </div>
            </>
          )}

          {(formData.category === "vinyl" || formData.category === "sticker") && (
            <>
              <div className="flex justify-between py-1.5 border-b border-border/30">
                <span className="text-muted-foreground">ຂະໜາດ:</span>
                <span className="font-bold text-foreground">
                  {formData.dimensions.width || 0} × {formData.dimensions.height || 0} {formData.dimensions.unit}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/30">
                <span className="text-muted-foreground">ຄວາມລະອຽດພິມ:</span>
                <span className="font-bold text-foreground">{resObj?.titleLao}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/30">
                <span className="text-muted-foreground">ງານສຳເລັດຮູບ:</span>
                <span className="font-bold text-foreground">{formatFinishing()}</span>
              </div>
            </>
          )}

          <div className="flex justify-between py-1.5 border-b border-border/30">
            <span className="text-muted-foreground">ຈຳນວນ:</span>
            <span className="font-extrabold text-orange-600 dark:text-orange-400">{formData.quantity || 1}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-border/30">
            <span className="text-muted-foreground">ວັນທີຕ້ອງການຮັບ:</span>
            <span className="font-bold text-foreground">{formData.dueDate || "ບໍ່ໄດ້ກຳນົດ"}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-border/30">
            <span className="text-muted-foreground">ຄວາມຮີບດ່ວນ:</span>
            <span className={cn("font-bold", formData.isUrgent ? "text-orange-600" : "text-emerald-600")}>
              {formData.isUrgent ? "🚨 ງານດ່ວນ (Urgent)" : "ປົກກະຕິ (Standard)"}
            </span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-border/30">
            <span className="text-muted-foreground">ສະຖານະໄຟລ໌:</span>
            <span className="font-bold text-foreground">
              {formData.designStatus === "ready" ? "ມີແບບພ້ອມພິມແລ້ວ" : "ຍັງບໍ່ມີແບບ"}
            </span>
          </div>

          {formData.description && (
            <div className="py-2 sm:col-span-2 text-muted-foreground bg-muted/20 p-3 rounded-xl border border-border/40">
              <span className="font-bold text-foreground block mb-0.5">ລາຍລະອຽດເພີ່ມເຕີມ:</span>
              <span className="font-normal text-foreground/90">{formData.description}</span>
            </div>
          )}
        </div>

        {/* Quick step jump controls */}
        <div className="pt-3 flex flex-wrap items-center gap-2 text-xs border-t border-border/40">
          <span className="text-muted-foreground font-medium">ແກ້ໄຂ:</span>
          <button
            type="button"
            onClick={() => onGoToStep(1)}
            className="rounded-lg bg-muted px-2.5 py-1 text-muted-foreground hover:text-foreground font-semibold transition-colors cursor-pointer"
          >
            ປ່ຽນສິນຄ້າ
          </button>
          <button
            type="button"
            onClick={() => onGoToStep(2)}
            className="rounded-lg bg-muted px-2.5 py-1 text-muted-foreground hover:text-foreground font-semibold transition-colors cursor-pointer"
          >
            ປ່ຽນວັດສະດຸ
          </button>
          <button
            type="button"
            onClick={() => onGoToStep(3)}
            className="rounded-lg bg-muted px-2.5 py-1 text-muted-foreground hover:text-foreground font-semibold transition-colors cursor-pointer"
          >
            ປ່ຽນຂະໜາດ & ວຽກ
          </button>
        </div>
      </div>

      {/* WhatsApp Delivery Notice */}
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/[0.08] p-4 sm:p-5 text-xs text-amber-950 dark:text-amber-200 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div className="space-y-1.5 leading-relaxed">
            <p className="font-bold text-sm text-amber-950 dark:text-amber-100">
              ຄຳແນະນຳສຳຄັນໃນການສົ່ງຂໍ້ມູນຜ່ານ WhatsApp:
            </p>
            <p>
              1. ເມື່ອກົດປຸ່ມ <strong>“ສົ່ງຂໍ້ມູນຜ່ານ WhatsApp”</strong> ລະບົບຈະເປີດແອັບ WhatsApp ພ້ອມຂໍ້ຄວາມທີ່ຈັດໄວ້ໃຫ້ແລ້ວ.
            </p>
            <p>
              2. <strong>ທ່ານຕ້ອງກົດປຸ່ມ Send (ສົ່ງ) ໃນແອັບ WhatsApp ອີກຄັ້ງ</strong> ເພື່ອໃຫ້ຂໍ້ຄວາມສົ່ງຮອດຮ້ານ.
            </p>
            {formData.designStatus === "ready" && (
              <p className="text-amber-800 dark:text-amber-300 font-medium">
                3. ຖ້າທ່ານມີຮູບຕົວຢ່າງ ຫຼື ໄຟລ໌ແບບ (AI, PDF, ຮູບພາບ), ທ່ານສາມາດກົດສົ່ງຮູບ ຫຼື ເອກະສານໂດຍກົງໃນແຊັດ WhatsApp ໄດ້ທັນທີ.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3.5">
        <Button
          type="button"
          onClick={handleSendWhatsApp}
          className="w-full h-13 text-sm font-extrabold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/25 rounded-2xl transition-all hover:scale-[1.01]"
        >
          <Send className="mr-2 h-4 w-4" />
          <span>ສົ່ງຂໍ້ມູນຜ່ານ WhatsApp ດຽວນີ້</span>
        </Button>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={handleCopyMessage}
            className="flex-1 h-11 text-xs font-bold rounded-xl border-border hover:bg-muted"
          >
            {copied ? (
              <>
                <Check className="mr-1.5 h-4 w-4 text-emerald-600" />
                ຄັດລອກຂໍ້ຄວາມສຳເລັດແລ້ວ!
              </>
            ) : (
              <>
                <Copy className="mr-1.5 h-4 w-4" />
                ຄັດລອກຂໍ້ຄວາມທັງໝົດ (Copy Text)
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={onReset}
            className="h-11 text-xs font-semibold text-muted-foreground hover:text-destructive rounded-xl"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            ລ້າງຂໍ້ມູນເລີ່ມໃໝ່
          </Button>
        </div>
      </div>
    </div>
  );
};
