export type ProductCategory = "vinyl" | "sticker" | "cnc" | "beach_flag";

export type VinylType = "standard" | "korean";
export type VinylSurface = "white_back" | "black_back" | "translucent";

export type StickerType =
  | "glossy_white"
  | "matte_white"
  | "clear"
  | "frosted"
  | "reflective"
  | "translucent"
  | "c2";

export type CncMaterial =
  | "plastwood"
  | "acrylic"
  | "steel"
  | "stainless"
  | "zinc"
  | "metal_sheet"
  | "plate"
  | "wood";

export type PlastwoodType = "hard" | "soft";
export type PlastwoodThickness = "5mm" | "10mm" | "15mm" | "18mm" | "20mm";
export type MetalFinish = "glossy" | "hairline";

export type BeachFlagType = "wing" | "teardrop" | "feather";
export type BeachFlagSize = "S" | "M" | "L" | "XL";
export type BeachFlagBase = "water_weight" | "x_round" | "x_flat" | "water_tank";

export type DimensionUnit = "mm" | "cm" | "m";
export type PrintResolution = "standard" | "fine" | "uv";
export type DesignFileStatus = "ready" | "none";

export interface Dimensions {
  width: number | "";
  height: number | "";
  unit: DimensionUnit;
}

export interface QuestionnaireFormData {
  // Step 1: Product Selection
  category: ProductCategory | null;

  // Step 2: Specific Material Details
  // 2.1 Vinyl
  vinylType: VinylType;
  vinylSurface: VinylSurface;

  // 2.2 Sticker
  stickerType: StickerType;

  // 2.3 CNC / Laser
  cncMaterial: CncMaterial;
  plastwoodType?: PlastwoodType;
  plastwoodThickness?: PlastwoodThickness;
  steelFinish?: MetalFinish;
  stainlessThickness?: string;
  stainlessFinish?: MetalFinish;
  cncLedOption?: "none" | "front_lit" | "back_lit" | "full_lit";
  cncCustomNotes?: string;

  // 2.4 Beach Flag
  beachFlagType: BeachFlagType;
  beachFlagSize: BeachFlagSize;
  beachFlagBase: BeachFlagBase;

  // Step 3: Job Specifications
  dimensions: Dimensions;
  quantity: number | "";
  printResolution: PrintResolution;
  finishingOptions: string[]; // e.g. ["eyelets", "hemming"] or ["diecut"]
  dueDate: string;
  isUrgent: boolean;
  designStatus: DesignFileStatus;
  description: string;

  // Step 4: Customer Contact Info
  customerName: string;
  customerPhone: string;
}
