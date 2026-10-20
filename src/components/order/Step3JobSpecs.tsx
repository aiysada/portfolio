import React from "react";
import {
  QuestionnaireFormData,
  DimensionUnit,
  DesignFileStatus,
} from "@/types/questionnaire";
import {
  PRINT_RESOLUTIONS,
  VINYL_FINISHING_OPTIONS,
  STICKER_FINISHING_OPTIONS,
} from "@/data/questionnaireData";
import { ScalePreview } from "@/components/order/ScalePreview";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Calendar,
  Zap,
  Clock,
  Info,
  FileText,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Step3JobSpecsProps {
  formData: QuestionnaireFormData;
  updateFormData: (data: Partial<QuestionnaireFormData>) => void;
}

export const Step3JobSpecs: React.FC<Step3JobSpecsProps> = ({
  formData,
  updateFormData,
}) => {
  const { category } = formData;

  const isVinylOrSticker = category === "vinyl" || category === "sticker";
  const isCnc = category === "cnc";
  const isBeachFlag = category === "beach_flag";

  const handleDimensionChange = (field: "width" | "height", value: string) => {
    const num = value === "" ? "" : parseFloat(value);
    updateFormData({
      dimensions: {
        ...formData.dimensions,
        [field]: isNaN(num as number) ? "" : num,
      },
    });
  };

  const handleUnitChange = (unit: DimensionUnit) => {
    updateFormData({
      dimensions: {
        ...formData.dimensions,
        unit,
      },
    });
  };

  const handleFinishingToggle = (id: string, isSingleChoice = false) => {
    const current = formData.finishingOptions || [];
    if (isSingleChoice) {
      updateFormData({ finishingOptions: [id] });
    } else {
      if (current.includes(id)) {
        updateFormData({
          finishingOptions: current.filter((item) => item !== id),
        });
      } else {
        updateFormData({ finishingOptions: [...current, id] });
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          ປ້ອນລາຍລະອຽດຂະໜາດ ແລະ ຂໍ້ກຳນົດຂອງວຽກ
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          ລະບຸຂະໜາດ, ຈຳນວນ, ວັນທີຕ້ອງການນຳໃຊ້, ແລະ
          ໄຟລ໌ອອກແບບເພື່ອໃຫ້ຮ້ານປະເມີນລາຄາໄດ້ຖືກຕ້ອງ
        </p>
      </div>

      {/* 5.1 DIMENSIONS & SCALE PREVIEW (FOR VINYL & STICKER) */}
      {isVinylOrSticker && (
        <div className="space-y-5 rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground">
              1. ຂະໜາດວຽກ ແລະ ຈຳນວນ
            </h3>
            <span className="text-xs text-muted-foreground">
              ລະບົບຮອງຮັບ mm, cm, m
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            {/* Width */}
            <div className="space-y-1.5">
              <Label
                htmlFor="input-width"
                className="text-xs font-semibold text-foreground"
              >
                ລວງກວ້າງ (Width): <span className="text-orange-500">*</span>
              </Label>
              <Input
                id="input-width"
                type="number"
                min="0"
                step="any"
                placeholder="ເຊັ່ນ: 200"
                value={formData.dimensions.width}
                onChange={(e) => handleDimensionChange("width", e.target.value)}
                className="font-medium"
              />
            </div>

            {/* Height */}
            <div className="space-y-1.5">
              <Label
                htmlFor="input-height"
                className="text-xs font-semibold text-foreground"
              >
                ລວງສູງ (Height): <span className="text-orange-500">*</span>
              </Label>
              <Input
                id="input-height"
                type="number"
                min="0"
                step="any"
                placeholder="ເຊັ່ນ: 100"
                value={formData.dimensions.height}
                onChange={(e) =>
                  handleDimensionChange("height", e.target.value)
                }
                className="font-medium"
              />
            </div>

            {/* Unit */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                ໜ່ວຍວັດແທກ (Unit):
              </Label>
              <div className="flex rounded-lg border border-border bg-muted/30 p-1">
                {(["cm", "m", "mm"] as DimensionUnit[]).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => handleUnitChange(u)}
                    className={cn(
                      "flex-1 rounded-md py-1.5 text-xs font-bold transition-all",
                      formData.dimensions.unit === u
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-1.5">
              <Label
                htmlFor="input-qty"
                className="text-xs font-semibold text-foreground"
              >
                ຈຳນວນ (ຊິ້ນ/ແຜ່ນ): <span className="text-orange-500">*</span>
              </Label>
              <Input
                id="input-qty"
                type="number"
                min="1"
                placeholder="1"
                value={formData.quantity}
                onChange={(e) => {
                  const val =
                    e.target.value === "" ? "" : parseInt(e.target.value, 10);
                  updateFormData({
                    quantity: isNaN(val as number)
                      ? ""
                      : Math.max(1, val as number),
                  });
                }}
                className="font-medium"
              />
            </div>
          </div>

          {/* Interactive Scale Preview Component */}
          <div className="pt-2">
            <ScalePreview
              width={formData.dimensions.width}
              height={formData.dimensions.height}
              unit={formData.dimensions.unit}
            />
          </div>
        </div>
      )}

      {/* 5.1-B (FOR CNC / LASER) */}
      {isCnc && (
        <div className="space-y-4 rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
          <h3 className="text-base font-bold text-foreground">
            1. ຂໍ້ຄວາມ, ຂະໜາດໂດຍປະມານ ແລະ ຈຳນວນ
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <Label
                htmlFor="cnc-specs"
                className="text-xs font-semibold text-foreground"
              >
                ຂໍ້ຄວາມປ້າຍ ຫຼື ຂະໜາດລວມໂດຍປະມານ:{" "}
                <span className="text-orange-500">*</span>
              </Label>
              <Input
                id="cnc-specs"
                placeholder="ເຊັ່ນ: ຕົວໜັງສື 'INDIE SIGN' ສູງ 25 cm, ຄວາມຍາວລວມ 2.5 ແມັດ"
                value={formData.description}
                onChange={(e) =>
                  updateFormData({ description: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="cnc-qty"
                className="text-xs font-semibold text-foreground"
              >
                ຈຳນວນຊຸດ: <span className="text-orange-500">*</span>
              </Label>
              <Input
                id="cnc-qty"
                type="number"
                min="1"
                placeholder="1"
                value={formData.quantity}
                onChange={(e) => {
                  const val =
                    e.target.value === "" ? "" : parseInt(e.target.value, 10);
                  updateFormData({
                    quantity: isNaN(val as number)
                      ? ""
                      : Math.max(1, val as number),
                  });
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 5.1-C (FOR BEACH FLAG) */}
      {isBeachFlag && (
        <div className="space-y-4 rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
          <h3 className="text-base font-bold text-foreground">
            1. ຈຳນວນຊຸດທຸງຊາຍຫາດ
          </h3>
          <div className="max-w-xs space-y-1.5">
            <Label
              htmlFor="flag-qty"
              className="text-xs font-semibold text-foreground"
            >
              ຈຳນວນຊຸດ (ທຸງ + ເສົາ + ຖານ):{" "}
              <span className="text-orange-500">*</span>
            </Label>
            <Input
              id="flag-qty"
              type="number"
              min="1"
              placeholder="1"
              value={formData.quantity}
              onChange={(e) => {
                const val =
                  e.target.value === "" ? "" : parseInt(e.target.value, 10);
                updateFormData({
                  quantity: isNaN(val as number)
                    ? ""
                    : Math.max(1, val as number),
                });
              }}
            />
          </div>
        </div>
      )}

      {/* 5.2 PRINT RESOLUTION (FOR VINYL & STICKER) */}
      {isVinylOrSticker && (
        <div className="space-y-3 rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
          <Label className="text-base font-bold text-foreground">
            2. ຄວາມລະອຽດໃນການພິມ (Print Quality):
          </Label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {PRINT_RESOLUTIONS.map((res) => {
              const isSelected = formData.printResolution === res.id;
              return (
                <div
                  key={res.id}
                  onClick={() => updateFormData({ printResolution: res.id })}
                  className={cn(
                    "flex flex-col justify-between rounded-xl border p-4 text-left transition-all cursor-pointer",
                    isSelected
                      ? "border-orange-500 bg-orange-500/10 shadow-xs ring-1 ring-orange-500/40"
                      : "border-border/70 bg-muted/20 hover:border-orange-500/30",
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">
                        {res.titleLao}
                      </span>
                      {res.badge && (
                        <span className="rounded-full bg-orange-500/15 px-1.5 py-0.2 text-[9px] font-bold text-orange-600 dark:text-orange-400">
                          {res.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                      {res.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5.3 FINISHING OPTIONS (FOR VINYL & STICKER) */}
      {category === "vinyl" && (
        <div className="space-y-3 rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <Label className="text-base font-bold text-foreground">
              3. ຕົວເລືອກງານສຳເລັດຮູບ (ສາມາດເລືອກໄດ້ຫຼາຍລາຍການ):
            </Label>
            <span className="text-xs text-muted-foreground">
              ເລືອກຕາມການນຳໃຊ້
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {VINYL_FINISHING_OPTIONS.map((opt) => {
              const isChecked = formData.finishingOptions?.includes(opt.id);
              return (
                <div
                  key={opt.id}
                  onClick={() => handleFinishingToggle(opt.id, false)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-3.5 transition-all cursor-pointer",
                    isChecked
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-border/70 bg-muted/20 hover:border-orange-500/30",
                  )}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => handleFinishingToggle(opt.id, false)}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      {opt.titleLao}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      {opt.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {category === "sticker" && (
        <div className="space-y-3 rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
          <Label className="text-base font-bold text-foreground">
            3. ຕົວເລືອກງານສຳເລັດຮູບສະຕິກເກີ (ເລືອກ 1 ຢ່າງ):
          </Label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {STICKER_FINISHING_OPTIONS.map((opt) => {
              const isChecked = formData.finishingOptions?.includes(opt.id);
              return (
                <div
                  key={opt.id}
                  onClick={() => handleFinishingToggle(opt.id, true)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-3.5 transition-all cursor-pointer",
                    isChecked
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-border/70 bg-muted/20 hover:border-orange-500/30",
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                      isChecked
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-muted-foreground/30",
                    )}
                  >
                    {isChecked && (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      {opt.titleLao}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      {opt.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5.4 DATE & URGENCY (FOR ALL PRODUCTS) */}
      <div className="space-y-4 rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
        <h3 className="text-base font-bold text-foreground">
          {isVinylOrSticker ? "4." : "2."} ວັນທີຕ້ອງການນຳວຽກໄປໃຊ້ & ຄວາມຮີບດ່ວນ
        </h3>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Target Due Date */}
          <div className="space-y-1.5">
            <Label
              htmlFor="due-date"
              className="text-xs font-semibold text-foreground flex items-center gap-1.5"
            >
              <Calendar className="h-3.5 w-3.5 text-orange-500" />
              ວັນທີຕ້ອງການຮັບວຽກ: <span className="text-orange-500">*</span>
            </Label>
            <Input
              id="due-date"
              type="date"
              value={formData.dueDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => updateFormData({ dueDate: e.target.value })}
              className="font-medium"
            />
            <p className="text-[10px] text-muted-foreground">
              ກະລຸນາເລືອກວັນທີທີ່ທ່ານຕ້ອງການຕິດຕັ້ງ ຫຼື ນຳວຽກໄປໃຊ້ຕົວຈິງ
            </p>
          </div>

          {/* Urgency Segmented Control */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-orange-500" />
              ສະຖານະຄວາມຮີບດ່ວນ:
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateFormData({ isUrgent: false })}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg border py-2.5 px-3 text-xs font-bold transition-all",
                  !formData.isUrgent
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : "border-border bg-muted/20 text-muted-foreground",
                )}
              >
                <Clock className="h-4 w-4" />
                <span>ປົກກະຕິ (Standard)</span>
              </button>

              <button
                type="button"
                onClick={() => updateFormData({ isUrgent: true })}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg border py-2.5 px-3 text-xs font-bold transition-all",
                  formData.isUrgent
                    ? "border-orange-500 bg-orange-500/15 text-orange-600 dark:text-orange-400 shadow-xs"
                    : "border-border bg-muted/20 text-muted-foreground",
                )}
              >
                <Zap className="h-4 w-4 text-orange-500" />
                <span>ງານດ່ວນ (Urgent)</span>
              </button>
            </div>
            {formData.isUrgent && (
              <p className="text-[10px] text-orange-600 dark:text-orange-400 font-medium flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                ທີມງານຈະເລັ່ງຄິວຜະລິດໃຫ້ເປັນກໍລະນີພິເສດຕາມເວລາທີ່ທ່ານກຳນົດ
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 5.5 DESIGN FILE STATUS & UPLOAD */}
      <div className="space-y-4 rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
        <h3 className="text-base font-bold text-foreground">
          {isVinylOrSticker ? "5." : "3."} ສະຖານະໄຟລ໌ອອກແບບ (Design Status)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              id: "ready" as DesignFileStatus,
              title: "ມີໄຟລ໌ / ແບບພ້ອມພິມແລ້ວ",
              desc: "ມີໄຟລ໌ AI, PDF, PSD, PNG ຫຼື ຮູບແບບແລ້ວ",
            },
            {
              id: "none" as DesignFileStatus,
              title: "ຍັງບໍ່ມີແບບ (ຕ້ອງການໃຫ້ຮ້ານອອກແບບໃຫ້)",
              desc: "ມີພຽງແນວຄິດ, ຂໍ້ຄວາມ ຫຼື ຕ້ອງການໃຫ້ຊ່ວຍຈັດວາງແບບ",
            },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => updateFormData({ designStatus: item.id })}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                formData.designStatus === item.id
                  ? "border-orange-500 bg-orange-500/10 font-bold text-foreground shadow-xs ring-1 ring-orange-500/40"
                  : "border-border bg-muted/20 text-muted-foreground hover:border-border/80",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">
                  {item.title}
                </span>
                <div
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border",
                    formData.designStatus === item.id
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-muted-foreground/30",
                  )}
                >
                  {formData.designStatus === item.id && (
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </div>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground font-normal">
                {item.desc}
              </p>
            </button>
          ))}
        </div>

        {formData.designStatus === "ready" && (
          <div className="flex items-start gap-2.5 rounded-xl border border-orange-500/30 bg-orange-500/5 p-3.5 text-xs text-orange-950 dark:text-orange-200">
            <Info className="h-4 w-4 shrink-0 text-orange-500 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-foreground">
                ຄຳແນະນຳການສົ່ງໄຟລ໌ / ຮູບພາບ:
              </p>
              <p className="text-muted-foreground">
                ທ່ານສາມາດສົ່ງຮູບແບບ ຫຼື ໄຟລ໌ຕົວຢ່າງ (AI, PDF, ຮູບພາບ)
                ໃຫ້ຮ້ານໂດຍກົງໃນແຊັດ WhatsApp ໄດ້ເລີຍ
                ເມື່ອກົດສົ່ງຂໍ້ມູນໃນຂັ້ນຕອນສຸດທ້າຍ.
              </p>
            </div>
          </div>
        )}

        {formData.designStatus === "none" && (
          <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3.5 text-xs text-muted-foreground">
            <Info className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
            <p>
              ບໍ່ເປັນຫຍັງ! ທ່ານສາມາດລະບຸລາຍລະອຽດ, ຂໍ້ຄວາມ, ຫຼື
              ໂທນສີທີ່ຕ້ອງການໃນຊ່ອງລຸ່ມນີ້ ເພື່ອໃຫ້ທີມງານຊ່ວຍອອກແບບ ແລະ
              ປະເມີນໃຫ້.
            </p>
          </div>
        )}
      </div>

      {/* 5.6 NOTES / DESCRIPTION */}
      <div className="space-y-2 rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
        <Label
          htmlFor="notes-textarea"
          className="text-base font-bold text-foreground flex items-center gap-1.5"
        >
          <FileText className="h-4 w-4 text-orange-500" />
          {isVinylOrSticker ? "6." : "4."} ລາຍລະອຽດ ຫຼື ຄວາມຕ້ອງການເພີ່ມເຕີມ:
        </Label>
        <p className="text-xs text-muted-foreground">
          ຂຽນລາຍລະອຽດເຊັ່ນ: ສະຖານທີ່ຕິດຕັ້ງ, ໂທນສີທີ່ຕ້ອງການ, ວິທີການນຳໄປໃຊ້,
          ຫຼື ຂໍ້ກຳນົດພິເສດອື່ນໆ
        </p>
        <textarea
          id="notes-textarea"
          rows={3}
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          placeholder="ຕົວຢ່າງ: ຕ້ອງການຕິດຕັ້ງຢູ່ໜ້າຮ້ານຊັ້ນ 1 ແຖວຕະຫຼາດເຊົ້າ, ຕ້ອງການສີພື້ນສີຂາວ ແລະ ຕົວໜັງສືສີສົ້ມເດັ່ນໆ..."
          className="w-full rounded-xl border border-input bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-orange-500/50"
        />
      </div>
    </div>
  );
};
