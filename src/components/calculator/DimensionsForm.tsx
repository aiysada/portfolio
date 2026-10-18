/**
 * Step 2 — Dimensions Form
 * Width, height, quantity inputs with live area preview.
 */

import { Ruler, Info, LayoutGrid } from "lucide-react";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import { cn } from "@/lib/utils";
import { formatArea } from "@/lib/calculator";

interface DimensionsFormProps {
  widthCm: number;
  heightCm: number;
  quantity: number;
  onWidthChange: (v: number) => void;
  onHeightChange: (v: number) => void;
  onQuantityChange: (v: number) => void;
}

export function DimensionsForm({
  widthCm,
  heightCm,
  quantity,
  onWidthChange,
  onHeightChange,
  onQuantityChange,
}: DimensionsFormProps) {
  const widthM = widthCm / 100;
  const heightM = heightCm / 100;
  const rawArea = widthM * heightM;
  const billableArea = Math.max(0.25, rawArea);
  const perimeter = 2 * (widthM + heightM);
  const isMinArea = rawArea < 0.25;

  return (
    <div className="space-y-8">
      {/* Dimension inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Width */}
        <div className="space-y-2">
          <Label htmlFor="dim-width" className="flex items-center gap-1.5 text-sm font-semibold">
            <Ruler className="h-4 w-4 text-primary" />
            ຄວາມກວ້າງ (Width)
          </Label>
          <NumberInput
            id="dim-width"
            value={widthCm}
            onChange={onWidthChange}
            min={10}
            max={10000}
            step={10}
            unit="ຊມ"
          />
          <p className="text-xs text-muted-foreground">{widthM.toFixed(2)} ແມັດ</p>
        </div>

        {/* Height */}
        <div className="space-y-2">
          <Label htmlFor="dim-height" className="flex items-center gap-1.5 text-sm font-semibold">
            <Ruler className="h-4 w-4 rotate-90 text-primary" />
            ຄວາມສູງ (Height)
          </Label>
          <NumberInput
            id="dim-height"
            value={heightCm}
            onChange={onHeightChange}
            min={10}
            max={10000}
            step={10}
            unit="ຊມ"
          />
          <p className="text-xs text-muted-foreground">{heightM.toFixed(2)} ແມັດ</p>
        </div>
      </div>

      {/* Quantity */}
      <div className="space-y-2 max-w-xs">
        <Label htmlFor="dim-qty" className="flex items-center gap-1.5 text-sm font-semibold">
          <LayoutGrid className="h-4 w-4 text-primary" />
          ຈຳນວນ (Quantity)
        </Label>
        <NumberInput
          id="dim-qty"
          value={quantity}
          onChange={onQuantityChange}
          min={1}
          max={100}
          step={1}
          unit="ອັນ"
        />
        {quantity >= 3 && (
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            🎉 ສ່ວນຫຼຸດ {quantity >= 5 ? "10%" : "5%"} ສຳລັບ {quantity}+ ອັນ
          </p>
        )}
      </div>

      {/* Live preview card */}
      <div
        className={cn(
          "rounded-2xl border p-5 space-y-4 transition-all",
          "bg-gradient-to-br from-card via-card to-orange-500/5 border-primary/20"
        )}
      >
        <p className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5" />
          ສະຫຼຸບຂະໜາດ
        </p>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-0.5 text-center">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">ເນື້ອທີ່ (m²)</p>
            <p className="text-xl font-bold font-sans text-foreground">{formatArea(billableArea)}</p>
            {isMinArea && (
              <p className="text-[10px] text-amber-500">ຄິດໄລ່ຂັ້ນຕ່ຳ 0.25 m²</p>
            )}
          </div>
          <div className="space-y-0.5 text-center">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">ຂອບ (m)</p>
            <p className="text-xl font-bold font-sans text-foreground">{perimeter.toFixed(2)} m</p>
          </div>
          <div className="space-y-0.5 text-center">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">ຈຳນວນ</p>
            <p className="text-xl font-bold font-sans text-foreground">× {quantity}</p>
          </div>
        </div>

        {/* Visual proportional sign preview */}
        <div className="mt-2 flex items-center justify-center">
          <div
            className="rounded-md border-2 border-primary/40 bg-primary/5 flex items-center justify-center text-[10px] text-primary font-semibold transition-all duration-300"
            style={{
              width: `${Math.min(280, Math.max(60, widthCm / 2.5))}px`,
              height: `${Math.min(120, Math.max(30, heightCm / 2.5))}px`,
            }}
          >
            {widthCm}×{heightCm} ຊມ
          </div>
        </div>
      </div>
    </div>
  );
}
