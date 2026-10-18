/**
 * Step 3 — Options Form
 * Material selector, LED lighting toggle, and installation option.
 */

import { Layers, Lightbulb, Wrench } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { MaterialOption } from "@/types/signage";
import { LED_COSTS_PER_M2 } from "@/lib/calculator";

const LED_TYPES = [
  { value: "standard", label: "ມາດຕະຖານ (Standard Warm White)", description: "ເໝາະສຳລັບງານທົ່ວໄປ, ປະຢັດໄຟ" },
  { value: "highbright", label: "ຄວາມສະຫວ່າງສູງ (High Brightness)", description: "ສຳລັບກາງແຈ້ງ, ທົນແດດ IP67" },
  { value: "rgb", label: "RGB ປ່ຽນສີ (RGB Color Changing)", description: "ສີສັນສົດໃສ ດຶງດູດຄວາມສົນໃຈ" },
  { value: "neon", label: "Neon Flex ດັດໄດ້ (Flexible Neon)", description: "ສຳລັບຮ້ານ Café, Bar, ຫ້ອງການ" },
];

interface OptionsFormProps {
  materials: MaterialOption[];
  selectedMaterialId: string;
  hasLedLighting: boolean;
  ledType: string;
  installationRequired: boolean;
  notes: string;
  areaM2: number;
  onMaterialChange: (id: string) => void;
  onLedToggle: (v: boolean) => void;
  onLedTypeChange: (v: string) => void;
  onInstallationToggle: (v: boolean) => void;
  onNotesChange: (v: string) => void;
}

export function OptionsForm({
  materials,
  selectedMaterialId,
  hasLedLighting,
  ledType,
  installationRequired,
  notes,
  areaM2,
  onMaterialChange,
  onLedToggle,
  onLedTypeChange,
  onInstallationToggle,
  onNotesChange,
}: OptionsFormProps) {
  const installCost = Math.max(areaM2 * 120_000, 200_000);
  const ledCostPerM2 = LED_COSTS_PER_M2[ledType] ?? 180_000;

  return (
    <div className="space-y-8">
      {/* 1. Material selector */}
      <div className="space-y-3">
        <Label className="flex items-center gap-1.5 text-sm font-semibold">
          <Layers className="h-4 w-4 text-primary" />
          ເລືອກວັດສະດຸ (Material)
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* No specific material option */}
          <button
            type="button"
            onClick={() => onMaterialChange("")}
            className={cn(
              "flex flex-col text-left rounded-xl border-2 p-4 transition-all duration-150 hover:border-primary/40",
              selectedMaterialId === ""
                ? "border-primary bg-primary/5"
                : "border-border bg-card"
            )}
          >
            <span className="text-sm font-semibold">ໃຊ້ລາຄາໂຄງສ້າງ (ເລີ່ມຕົ້ນ)</span>
            <span className="text-xs text-muted-foreground mt-1">ຄຳນວນຈາກລາຄາຖານຂອງສິນຄ້າ</span>
          </button>

          {materials.map((mat) => (
            <button
              key={mat.id}
              type="button"
              onClick={() => onMaterialChange(mat.id)}
              className={cn(
                "flex flex-col text-left rounded-xl border-2 p-4 transition-all duration-150 hover:border-primary/40",
                selectedMaterialId === mat.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              )}
            >
              <span className="text-sm font-semibold">{mat.nameLao}</span>
              <span className="text-xs text-muted-foreground font-sans mt-0.5">{mat.name}</span>
              <span className="mt-2 text-xs font-bold font-sans text-primary">
                {new Intl.NumberFormat("lo-LA").format(mat.pricePerUnit)} ₭ / {mat.unit}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. LED Lighting toggle */}
      <div
        className={cn(
          "rounded-2xl border-2 transition-all overflow-hidden",
          hasLedLighting ? "border-amber-500/40 bg-amber-500/5" : "border-border bg-card"
        )}
      >
        <button
          type="button"
          onClick={() => onLedToggle(!hasLedLighting)}
          className="w-full flex items-center justify-between p-5 text-left"
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all",
                hasLedLighting
                  ? "bg-amber-500 text-white"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">ລະບົບໄຟ LED</p>
              <p className="text-xs text-muted-foreground">ເພີ່ມໄຟ LED ສຳລັບປ້າຍສະຫວ່າງກາງຄືນ</p>
            </div>
          </div>
          {/* Toggle indicator */}
          <div
            className={cn(
              "relative h-6 w-11 rounded-full transition-colors duration-200",
              hasLedLighting ? "bg-amber-500" : "bg-muted"
            )}
          >
            <div
              className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
                hasLedLighting ? "translate-x-5" : "translate-x-0.5"
              )}
            />
          </div>
        </button>

        {/* LED type selector (shows when enabled) */}
        {hasLedLighting && (
          <div className="px-5 pb-5 space-y-3 border-t border-amber-500/20">
            <Label className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider block pt-4">
              ປະເພດໄຟ LED
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LED_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => onLedTypeChange(type.value)}
                  className={cn(
                    "flex flex-col text-left rounded-xl p-3 border-2 transition-all",
                    ledType === type.value
                      ? "border-amber-500 bg-amber-500/10"
                      : "border-border hover:border-amber-300"
                  )}
                >
                  <span className="text-xs font-semibold">{type.label}</span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">{type.description}</span>
                  <span className="text-[11px] font-bold font-sans text-amber-600 dark:text-amber-400 mt-1">
                    +{new Intl.NumberFormat("lo-LA").format(LED_COSTS_PER_M2[type.value])} ₭/m²
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              ຄ່າໄຟ LED ສຳລັບຂະໜາດນີ້: ~{new Intl.NumberFormat("lo-LA").format(Math.round(ledCostPerM2 * areaM2))} ₭
            </p>
          </div>
        )}
      </div>

      {/* 3. Installation toggle */}
      <div
        className={cn(
          "rounded-2xl border-2 transition-all overflow-hidden",
          installationRequired ? "border-emerald-500/40 bg-emerald-500/5" : "border-border bg-card"
        )}
      >
        <button
          type="button"
          onClick={() => onInstallationToggle(!installationRequired)}
          className="w-full flex items-center justify-between p-5 text-left"
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all",
                installationRequired
                  ? "bg-emerald-500 text-white"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">ຕ້ອງການຕິດຕັ້ງໜ້າວຽກ</p>
              <p className="text-xs text-muted-foreground">
                ທີມງານຂອງພວກເຮົາຕິດຕັ້ງໃຫ້ ≈ {new Intl.NumberFormat("lo-LA").format(Math.round(installCost))} ₭
              </p>
            </div>
          </div>
          <div
            className={cn(
              "relative h-6 w-11 rounded-full transition-colors duration-200",
              installationRequired ? "bg-emerald-500" : "bg-muted"
            )}
          >
            <div
              className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
                installationRequired ? "translate-x-5" : "translate-x-0.5"
              )}
            />
          </div>
        </button>
      </div>

      {/* 4. Notes */}
      <div className="space-y-2">
        <Label htmlFor="calc-notes" className="text-sm font-semibold">
          ໝາຍເຫດ / ຄວາມຕ້ອງການພິເສດ (ທາງເລືອກ)
        </Label>
        <div className="relative">
          <textarea
            id="calc-notes"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={3}
            placeholder="ເຊັ່ນ: ສີພິເສດ, ໂລໂກ້ Custom, ຕ້ອງການ Mockup 3D ກ່ອນ, ກຳນົດເວລາສ່ົງ..."
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
