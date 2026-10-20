import React from "react";
import { DimensionUnit } from "@/types/questionnaire";
import { Maximize2, User, Ruler } from "lucide-react";

interface ScalePreviewProps {
  width: number | "";
  height: number | "";
  unit: DimensionUnit;
}

export const ScalePreview: React.FC<ScalePreviewProps> = ({ width, height, unit }) => {
  // Convert dimensions to meters and centimeters for standardized calculation
  const numW = typeof width === "number" && !isNaN(width) && width > 0 ? width : 0;
  const numH = typeof height === "number" && !isNaN(height) && height > 0 ? height : 0;

  const toMeters = (val: number, u: DimensionUnit): number => {
    if (u === "mm") return val / 1000;
    if (u === "cm") return val / 100;
    return val;
  };

  const toCm = (val: number, u: DimensionUnit): number => {
    if (u === "mm") return val / 10;
    if (u === "cm") return val;
    return val * 100;
  };

  const widthInM = toMeters(numW, unit);
  const heightInM = toMeters(numH, unit);
  const widthInCm = toCm(numW, unit);
  const heightInCm = toCm(numH, unit);

  const areaM2 = widthInM * heightInM;
  const hasValidDimensions = widthInM > 0 && heightInM > 0;

  // Reference human height = 1.75 meters (175 cm)
  const humanHeightM = 1.75;

  // Viewport bounds
  const maxContainerHeightPx = 180;
  const maxContainerWidthPx = 320;

  const maxWorldHeight = Math.max(humanHeightM * 1.15, heightInM * 1.15, 2.0);
  const scaleY = maxContainerHeightPx / maxWorldHeight;

  const bannerHeightPx = Math.min(Math.max(heightInM * scaleY, 24), maxContainerHeightPx);
  const bannerWidthPx = Math.min(Math.max(widthInM * scaleY, 28), maxContainerWidthPx);
  const humanHeightPx = humanHeightM * scaleY;

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs transition-all">
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30">
            <Maximize2 className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Scale Preview (ພາບຈຳລອງສັດສ່ວນຕົວຈິງ)</h4>
            <p className="text-[11px] text-muted-foreground">ປຽບທຽບຂະໜາດປ້າຍກັບລວງສູງຄົນມາດຕະຖານ (175 cm)</p>
          </div>
        </div>

        {hasValidDimensions && (
          <div className="flex items-center gap-1.5 rounded-xl bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-600 dark:text-orange-400 border border-orange-500/25">
            <Ruler className="h-3.5 w-3.5" />
            <span>
              {areaM2.toLocaleString("lo-LA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²
            </span>
          </div>
        )}
      </div>

      {!hasValidDimensions ? (
        <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground mb-2">
            <Ruler className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-foreground">ກະລຸນາປ້ອນລວງກວ້າງ ແລະ ລວງສູງ</p>
          <p className="mt-1 text-[11px] text-muted-foreground max-w-xs">
            ລະບົບຈະສະແດງພາບຈຳລອງສັດສ່ວນ ແລະ ຄຳນວນເນື້ອທີ່ (m²) ໃຫ້ທັນທີ
          </p>
        </div>
      ) : (
        <div className="relative flex h-56 items-end justify-center gap-8 overflow-hidden rounded-xl border border-border/60 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] bg-muted/15 p-4">
          {/* Ground surface line */}
          <div className="absolute bottom-4 left-4 right-4 h-0.5 bg-border rounded-full" />

          {/* Reference Human Silhouette */}
          <div
            className="relative z-10 flex flex-col items-center justify-end text-muted-foreground/80 transition-all duration-300"
            style={{ height: `${humanHeightPx}px` }}
          >
            <div className="absolute -top-7 rounded-md bg-background px-2 py-0.5 text-[9px] font-bold text-muted-foreground shadow-xs border border-border/60 whitespace-nowrap">
              ຄົນ (175 cm)
            </div>
            <div className="flex h-full flex-col items-center justify-end">
              <User className="h-full w-auto text-muted-foreground/60 drop-shadow-xs" strokeWidth={1.5} />
            </div>
          </div>

          {/* Proportional Custom Banner Preview */}
          <div
            className="group relative z-10 flex flex-col items-center justify-center rounded-lg border-2 border-orange-500 bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-amber-500/20 p-2 text-center shadow-md shadow-orange-500/10 backdrop-blur-xs transition-all duration-300"
            style={{
              width: `${bannerWidthPx}px`,
              height: `${bannerHeightPx}px`,
            }}
          >
            {/* Simulated Eyelets / Grommets on 4 corners */}
            <span className="absolute top-1 left-1 h-1.5 w-1.5 rounded-full border border-orange-600 bg-white dark:bg-zinc-900" />
            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full border border-orange-600 bg-white dark:bg-zinc-900" />
            <span className="absolute bottom-1 left-1 h-1.5 w-1.5 rounded-full border border-orange-600 bg-white dark:bg-zinc-900" />
            <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full border border-orange-600 bg-white dark:bg-zinc-900" />

            {/* Width Badge (Top) */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-orange-600 px-2 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
              {widthInCm.toFixed(0)} cm ({widthInM.toFixed(2)} m)
            </div>

            {/* Height Badge (Left) */}
            <div className="absolute -left-14 top-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap rounded-md bg-orange-600 px-2 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
              {heightInCm.toFixed(0)} cm
            </div>

            <span className="text-xs font-black text-orange-600 dark:text-orange-400">
              {areaM2.toFixed(2)} m²
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold">
              {widthInCm} × {heightInCm} cm
            </span>
          </div>
        </div>
      )}

      {hasValidDimensions && (
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground border-t border-border/40 pt-2.5">
          <span>ກວ້າງ: <strong className="text-foreground">{widthInM.toFixed(2)} ແມັດ</strong> ({widthInCm.toFixed(0)} cm)</span>
          <span>ສູງ: <strong className="text-foreground">{heightInM.toFixed(2)} ແມັດ</strong> ({heightInCm.toFixed(0)} cm)</span>
          <span className="rounded-md bg-muted px-2 py-0.5 font-semibold text-foreground">
            {widthInM > heightInM ? "ແນວນອນ (Landscape)" : widthInM < heightInM ? "ແນວຕັ້ງ (Portrait)" : "ຈັດຕຸລັດ (Square)"}
          </span>
        </div>
      )}
    </div>
  );
};
