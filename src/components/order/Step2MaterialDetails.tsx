import React from "react";
import {
  QuestionnaireFormData,
  PlastwoodType,
} from "@/types/questionnaire";
import {
  VINYL_TYPES,
  VINYL_SURFACES_STANDARD,
  VINYL_SURFACES_KOREAN,
  STICKER_TYPES,
  CNC_MATERIALS,
  PLASTWOOD_THICKNESSES,
  METAL_FINISHES,
  BEACH_FLAG_TYPES,
  BEACH_FLAG_SIZES,
  BEACH_FLAG_BASES,
} from "@/data/questionnaireData";
import { Check, Sparkles, HelpCircle, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Step2MaterialDetailsProps {
  formData: QuestionnaireFormData;
  updateFormData: (data: Partial<QuestionnaireFormData>) => void;
}

export const Step2MaterialDetails: React.FC<Step2MaterialDetailsProps> = ({
  formData,
  updateFormData,
}) => {
  const { category } = formData;

  if (!category) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center">
        <HelpCircle className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">ກະລຸນາກັບໄປເລືອກສິນຄ້າໃນຂັ້ນຕອນທີ 1 ກ່ອນ</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ---------------- 4.1 VINYL SECTION ---------------- */}
      {category === "vinyl" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              ລາຍລະອຽດວັດສະດຸຜ້າພິມໄວນິວ
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              ເລືອກປະເພດຜ້າໄວນິວ ແລະ ລັກສະນະຜິວດັດແປງຕາມການນຳໃຊ້ຂອງທ່ານ
            </p>
          </div>

          {/* Sub-step 1: Vinyl Type */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-foreground">1. ເລືອກປະເພດຜ້າໄວນິວ:</Label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {VINYL_TYPES.map((type) => {
                const isSelected = formData.vinylType === type.id;
                return (
                  <div
                    key={type.id}
                    onClick={() => {
                      updateFormData({
                        vinylType: type.id,
                        // If switching to korean and current surface is translucent, fallback to white_back
                        vinylSurface:
                          type.id === "korean" && formData.vinylSurface === "translucent"
                            ? "white_back"
                            : formData.vinylSurface,
                      });
                    }}
                    className={cn(
                      "flex flex-col justify-between rounded-xl border p-4 text-left transition-all cursor-pointer",
                      isSelected
                        ? "border-orange-500 bg-orange-500/10 shadow-sm ring-1 ring-orange-500/50"
                        : "border-border/70 bg-card hover:border-orange-500/40 hover:bg-muted/20"
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{type.titleLao}</span>
                          {type.badge && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-bold text-orange-600 dark:text-orange-400">
                              {type.recommended && <Sparkles className="h-2.5 w-2.5" />}
                              {type.badge}
                            </span>
                          )}
                        </div>
                        <div
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-full border",
                            isSelected
                              ? "border-orange-500 bg-orange-500 text-white"
                              : "border-muted-foreground/30"
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        {type.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sub-step 2: Vinyl Surface (Conditional) */}
          <div className="space-y-3 pt-2 border-t border-border/50">
            <Label className="text-sm font-bold text-foreground">
              2. ເລືອກລັກສະນະຜິວວັດສະດຸ ({formData.vinylType === "standard" ? "ໄວນິວທຳມະດາ" : "ໄວນິວເກົາຫຼີ"}):
            </Label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {(formData.vinylType === "standard"
                ? VINYL_SURFACES_STANDARD
                : VINYL_SURFACES_KOREAN
              ).map((surface) => {
                const isSelected = formData.vinylSurface === surface.id;
                return (
                  <div
                    key={surface.id}
                    onClick={() => updateFormData({ vinylSurface: surface.id })}
                    className={cn(
                      "flex flex-col justify-between rounded-xl border p-4 text-left transition-all cursor-pointer",
                      isSelected
                        ? "border-orange-500 bg-orange-500/10 shadow-sm ring-1 ring-orange-500/50"
                        : "border-border/70 bg-card hover:border-orange-500/40 hover:bg-muted/20"
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-foreground">{surface.titleLao}</span>
                        <div
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                            isSelected
                              ? "border-orange-500 bg-orange-500 text-white"
                              : "border-muted-foreground/30"
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                      </div>
                      {surface.recommended && (
                        <span className="mt-1 inline-block rounded-sm bg-orange-500/15 px-1.5 py-0.2 text-[9px] font-bold text-orange-600 dark:text-orange-400">
                          ແນະນຳ
                        </span>
                      )}
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        {surface.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 4.2 STICKER SECTION ---------------- */}
      {category === "sticker" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              ເລືອກປະເພດສະຕິກເກີ (Sticker Type)
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              ເລືອກເນື້ອສະຕິກເກີໃຫ້ເໝາະສົມກັບໜ້າວຽກ ແລະ ວັດສະດຸທີ່ຕ້ອງການຕິດ
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {STICKER_TYPES.map((sticker) => {
              const isSelected = formData.stickerType === sticker.id;
              return (
                <div
                  key={sticker.id}
                  onClick={() => updateFormData({ stickerType: sticker.id })}
                  className={cn(
                    "flex flex-col justify-between rounded-xl border p-4 text-left transition-all cursor-pointer",
                    isSelected
                      ? "border-orange-500 bg-orange-500/10 shadow-sm ring-1 ring-orange-500/50"
                      : "border-border/70 bg-card hover:border-orange-500/40 hover:bg-muted/20"
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">{sticker.titleLao}</span>
                      <div
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                          isSelected
                            ? "border-orange-500 bg-orange-500 text-white"
                            : "border-muted-foreground/30"
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                    </div>
                    {sticker.badge && (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-sm bg-orange-500/15 px-1.5 py-0.2 text-[9px] font-bold text-orange-600 dark:text-orange-400">
                        {sticker.recommended && <Sparkles className="h-2.5 w-2.5" />}
                        {sticker.badge}
                      </span>
                    )}
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {sticker.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------- 4.3 CNC / LASER SECTION ---------------- */}
      {category === "cnc" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              ເລືອກວັດສະດຸຕັດຕົວໜັງສືນູນ CNC / Laser
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              ເລືອກວັດສະດຸຫຼັກທີ່ຕ້ອງການນຳມາຕັດຂຶ້ນຮູບຕົວໜັງສື ຫຼື ໂລໂກ້ 3D
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CNC_MATERIALS.map((mat) => {
              const isSelected = formData.cncMaterial === mat.id;
              return (
                <div
                  key={mat.id}
                  onClick={() => updateFormData({ cncMaterial: mat.id })}
                  className={cn(
                    "flex flex-col justify-between rounded-xl border p-4 text-left transition-all cursor-pointer",
                    isSelected
                      ? "border-orange-500 bg-orange-500/10 shadow-sm ring-1 ring-orange-500/50"
                      : "border-border/70 bg-card hover:border-orange-500/40 hover:bg-muted/20"
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">{mat.titleLao}</span>
                      <div
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                          isSelected
                            ? "border-orange-500 bg-orange-500 text-white"
                            : "border-muted-foreground/30"
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                    </div>
                    {mat.badge && (
                      <span className="mt-1 inline-block rounded-sm bg-orange-500/15 px-1.5 py-0.2 text-[9px] font-bold text-orange-600 dark:text-orange-400">
                        {mat.badge}
                      </span>
                    )}
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {mat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Conditional Sub-options for Plastwood */}
          {formData.cncMaterial === "plastwood" && (
            <div className="rounded-xl border border-orange-500/30 bg-orange-500/[0.03] p-4 sm:p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Info className="h-4 w-4 text-orange-500" />
                ຕົວເລືອກພິເສດສຳລັບ «ພາສວູດ (PVC Foam Board)»:
              </h3>

              {/* Plastwood Type */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">ຮູບແບບພາສວູດ:</Label>
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  {[
                    { id: "hard" as PlastwoodType, label: "ແບບແຂງ (High Density)", desc: "ແຂງແກ່ນ ຜິວລຽບຕຶງ ເໝາະກັບງານພາຍນອກ" },
                    { id: "soft" as PlastwoodType, label: "ແບບອ່ອນ (Standard)", desc: "ນ້ຳໜັກເບົາ ລາຄາປະຢັດ ເໝາະກັບງານພາຍໃນ" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => updateFormData({ plastwoodType: item.id })}
                      className={cn(
                        "rounded-lg border p-3 text-left transition-all",
                        formData.plastwoodType === item.id
                          ? "border-orange-500 bg-orange-500/15 font-bold text-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-border/80"
                      )}
                    >
                      <p className="text-xs font-bold text-foreground">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Plastwood Thickness */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">ຄວາມໜາຂອງແຜ່ນພາສວູດ:</Label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {PLASTWOOD_THICKNESSES.map((th) => (
                    <button
                      key={th.value}
                      type="button"
                      onClick={() => updateFormData({ plastwoodThickness: th.value })}
                      className={cn(
                        "rounded-lg border p-2.5 text-center transition-all",
                        formData.plastwoodThickness === th.value
                          ? "border-orange-500 bg-orange-500/15 font-bold text-orange-600 dark:text-orange-400"
                          : "border-border bg-card text-muted-foreground hover:border-border/80"
                      )}
                    >
                      <p className="text-xs font-bold">{th.value}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5 truncate">{th.label.split("(")[1]?.replace(")", "")}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Conditional Sub-options for Steel */}
          {formData.cncMaterial === "steel" && (
            <div className="rounded-xl border border-orange-500/30 bg-orange-500/[0.03] p-4 sm:p-5 space-y-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Info className="h-4 w-4 text-orange-500" />
                ເລືອກຜິວເຫຼັກ (Steel Finish):
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                {METAL_FINISHES.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => updateFormData({ steelFinish: f.value })}
                    className={cn(
                      "rounded-lg border p-3 text-left transition-all",
                      formData.steelFinish === f.value
                        ? "border-orange-500 bg-orange-500/15 font-bold text-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-border/80"
                    )}
                  >
                    <p className="text-xs font-bold text-foreground">{f.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{f.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conditional Sub-options for Stainless Steel */}
          {formData.cncMaterial === "stainless" && (
            <div className="rounded-xl border border-orange-500/30 bg-orange-500/[0.03] p-4 sm:p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Info className="h-4 w-4 text-orange-500" />
                ລາຍລະອຽດແຜ່ນສະແຕນເລດ (Stainless Steel):
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="stainlessThickness" className="text-xs font-semibold text-foreground">
                    ຄວາມໜາຂອງແຜ່ນສະແຕນເລດ (ເຊັ່ນ: 1 mm, 1.2 mm, 1.5 mm, 2 mm):
                  </Label>
                  <Input
                    id="stainlessThickness"
                    placeholder="ລະບຸຄວາມໜາ ເຊັ່ນ: 1.2 mm"
                    value={formData.stainlessThickness || ""}
                    onChange={(e) => updateFormData({ stainlessThickness: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">ລັກສະນະຜິວສະແຕນເລດ:</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {METAL_FINISHES.map((f) => (
                      <button
                        key={f.value}
                        type="button"
                        onClick={() => updateFormData({ stainlessFinish: f.value })}
                        className={cn(
                          "rounded-lg border p-2 text-center text-xs font-semibold transition-all",
                          formData.stainlessFinish === f.value
                            ? "border-orange-500 bg-orange-500/15 text-orange-600 dark:text-orange-400"
                            : "border-border bg-card text-muted-foreground"
                        )}
                      >
                        {f.label.split("(")[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lighting option for CNC letterings */}
          <div className="rounded-xl border border-border/80 bg-card p-4 space-y-2">
            <Label className="text-xs font-bold text-foreground">
              ຕົວເລືອກຕິດໄຟ LED (Lighting Option):
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "none", label: "ບໍ່ຕິດໄຟ (Non-lit)", desc: "ຕົວໜັງສືນູນທຳມະດາ" },
                { id: "front_lit", label: "ອອກໄຟໜ້າ (Front-lit)", desc: "ແສງສ່ອງອອກທາງໜ້າ" },
                { id: "back_lit", label: "ອອກໄຟຫຼັງ (Halo Back-lit)", desc: "ແສງສະທ້ອນຫຼັງສະໄຕລ໌ຫຼູ" },
                { id: "full_lit", label: "ອອກໄຟທັງໝົດ (Full-lit)", desc: "ແສງສະຫວ່າງເຕັມຕົວ" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateFormData({ cncLedOption: opt.id as any })}
                  className={cn(
                    "rounded-lg border p-2.5 text-left transition-all",
                    formData.cncLedOption === opt.id
                      ? "border-orange-500 bg-orange-500/10 font-bold text-foreground ring-1 ring-orange-500/30"
                      : "border-border bg-muted/20 text-muted-foreground hover:border-border/80"
                  )}
                >
                  <p className="text-xs font-bold text-foreground">{opt.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 4.4 BEACH FLAG SECTION ---------------- */}
      {category === "beach_flag" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              ລາຍລະອຽດປ້າຍຜ້າທຸງຊາຍຫາດ (Beach Flag)
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              ເລືອກຮູບຊົງທຸງ, ຂະໜາດຄວາມສູງ, ແລະ ປະເພດຖານຂາຕັ້ງທີ່ເໝາະສົມກັບພື້ນທີ່ຕັ້ງ
            </p>
          </div>

          {/* 1. Flag Type */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-foreground">1. ເລືອກຮູບຊົງທຸງ (Flag Shape):</Label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {BEACH_FLAG_TYPES.map((flag) => {
                const isSelected = formData.beachFlagType === flag.id;
                return (
                  <div
                    key={flag.id}
                    onClick={() => updateFormData({ beachFlagType: flag.id })}
                    className={cn(
                      "flex flex-col justify-between rounded-xl border p-4 text-left transition-all cursor-pointer",
                      isSelected
                        ? "border-orange-500 bg-orange-500/10 shadow-sm ring-1 ring-orange-500/50"
                        : "border-border/70 bg-card hover:border-orange-500/40 hover:bg-muted/20"
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-foreground">{flag.titleLao}</span>
                        <div
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                            isSelected
                              ? "border-orange-500 bg-orange-500 text-white"
                              : "border-muted-foreground/30"
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                      </div>
                      {flag.badge && (
                        <span className="mt-1 inline-flex items-center gap-1 rounded-sm bg-orange-500/15 px-1.5 py-0.2 text-[9px] font-bold text-orange-600 dark:text-orange-400">
                          {flag.recommended && <Sparkles className="h-2.5 w-2.5" />}
                          {flag.badge}
                        </span>
                      )}
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        {flag.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Flag Size with Table */}
          <div className="space-y-3 pt-2 border-t border-border/50">
            <Label className="text-sm font-bold text-foreground">
              2. ເລືອກຂະໜາດທຸງ (Flag Size):
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {BEACH_FLAG_SIZES.map((item) => {
                const isSelected = formData.beachFlagSize === item.size;
                return (
                  <div
                    key={item.size}
                    onClick={() => updateFormData({ beachFlagSize: item.size })}
                    className={cn(
                      "rounded-xl border p-3.5 text-center transition-all cursor-pointer",
                      isSelected
                        ? "border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/40 shadow-xs"
                        : "border-border/70 bg-card hover:border-orange-500/30"
                    )}
                  >
                    <span className="inline-block rounded-md bg-orange-500/15 px-2.5 py-0.5 text-sm font-black text-orange-600 dark:text-orange-400">
                      Size {item.size}
                    </span>
                    <div className="mt-2 space-y-1 text-xs">
                      <p className="font-semibold text-foreground">ຜ້າ: {item.clothDimension}</p>
                      <p className="text-muted-foreground font-medium">ເສົາສູງ: {item.poleHeight}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Size details callout */}
            {(() => {
              const currentSpec = BEACH_FLAG_SIZES.find((s) => s.size === formData.beachFlagSize);
              if (!currentSpec) return null;
              return (
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground border border-border/40">
                  <Info className="h-4 w-4 shrink-0 text-orange-500" />
                  <span>
                    <strong>ຂະໜາດ {currentSpec.size}:</strong> ຜ້າທຸງຂະໜາດ <strong>{currentSpec.clothDimension}</strong>, ຄວາມສູງເສົາລວມ <strong>{currentSpec.poleHeight}</strong> • ແນະນຳສຳລັບ: {currentSpec.recommendedFor}
                  </span>
                </div>
              );
            })()}
          </div>

          {/* 3. Stand Base */}
          <div className="space-y-3 pt-2 border-t border-border/50">
            <Label className="text-sm font-bold text-foreground">
              3. ເລືອກປະເພດຖານຂາຕັ້ງ (Stand Base):
            </Label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {BEACH_FLAG_BASES.map((base) => {
                const isSelected = formData.beachFlagBase === base.id;
                return (
                  <div
                    key={base.id}
                    onClick={() => updateFormData({ beachFlagBase: base.id })}
                    className={cn(
                      "flex flex-col justify-between rounded-xl border p-4 text-left transition-all cursor-pointer",
                      isSelected
                        ? "border-orange-500 bg-orange-500/10 shadow-sm ring-1 ring-orange-500/50"
                        : "border-border/70 bg-card hover:border-orange-500/40 hover:bg-muted/20"
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-foreground">{base.titleLao}</span>
                        <div
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                            isSelected
                              ? "border-orange-500 bg-orange-500 text-white"
                              : "border-muted-foreground/30"
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                      </div>
                      {base.badge && (
                        <span className="mt-1 inline-block rounded-sm bg-orange-500/15 px-1.5 py-0.2 text-[9px] font-bold text-orange-600 dark:text-orange-400">
                          {base.badge}
                        </span>
                      )}
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        {base.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
