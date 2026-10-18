export type SignCategory =
  | "acrylic"
  | "stainless"
  | "lightbox"
  | "neon"
  | "billboard"
  | "vinyl"
  | "other";

export interface MaterialOption {
  id: string;
  name: string;
  nameLao: string;
  pricePerUnit: number;
  unit: "m2" | "cm" | "m" | "piece";
  description?: string;
}

export interface SignageProduct {
  id: string;
  title: string;
  titleLao: string;
  category: SignCategory;
  description: string;
  descriptionLao: string;
  basePrice: number;
  unit: string;
  imageUrl?: string;
  popular?: boolean;
}

export interface CalculationInput {
  widthCm: number;
  heightCm: number;
  quantity: number;
  materialId: string;
  hasLedLighting: boolean;
  ledType?: string;
  installationRequired: boolean;
  notes?: string;
}

export interface CalculationResult {
  areaM2: number;
  perimeterM: number;
  materialCost: number;
  lightingCost: number;
  installationCost: number;
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
}
