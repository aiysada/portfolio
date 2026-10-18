/**
 * Indie Sign — Calculator Type Definitions
 * All types for the multi-line quote calculator system.
 */

// ─── Dimension Units ───

export type DimensionUnit = "mm" | "cm" | "m";

// ─── Pricing Methods ───

export type PricingMethod = "per_m2" | "per_item" | "fixed" | "manual";

// ─── Charge Calculation Methods ───

export type ChargeMethod =
  | "included"
  | "fixed"
  | "per_m2"
  | "per_item"
  | "manual";

// ─── Product Definition ───

export interface CalcProduct {
  id: string;
  nameLao: string;
  nameEn: string;
  category: string;
  pricingMethod: PricingMethod;
  unitPrice: number; // per-m², per-item, or fixed price
  unit: string; // display unit label e.g. "m²", "ອັນ", etc.
  minPrice: number; // minimum charge for this product (0 = no minimum)
  popular?: boolean;
}

// ─── Quote Line Item ───

export interface QuoteLineItem {
  id: string;
  productId: string;
  productNameLao: string;
  productNameEn: string;
  pricingMethod: PricingMethod;

  // Dimensions (for per_m2 items)
  width: number;
  height: number;
  dimensionUnit: DimensionUnit;
  areaM2: number; // computed: width × height converted to m²

  // Quantity & pricing
  quantity: number;
  unitPrice: number;
  lineSubtotal: number; // computed: based on pricing method

  // Minimum price
  minPrice: number;
  minPriceApplied: boolean; // true when lineSubtotal was raised to minPrice
  effectiveSubtotal: number; // max(lineSubtotal, minPrice) if minPrice > 0

  // Notes
  notes: string;
}

// ─── Additional Charges ───

export interface ChargeConfig {
  enabled: boolean;
  method: ChargeMethod;
  amount: number; // used for fixed / manual / per-m² / per-item
}

export interface AdditionalCharges {
  designFee: ChargeConfig;
  laborFee: ChargeConfig;
  installationFee: ChargeConfig;
  deliveryFee: ChargeConfig;
  extraServices: ExtraServiceItem[];
}

export interface ExtraServiceItem {
  id: string;
  nameLao: string;
  amount: number;
}

// ─── Discount & Tax ───

export type DiscountType = "percentage" | "fixed";

export interface DiscountConfig {
  type: DiscountType;
  value: number; // percentage (0–100) or fixed amount
}

export interface TaxConfig {
  enabled: boolean;
  rate: number; // percentage, e.g. 10
}

// ─── Computed Charge Amounts ───

export interface ComputedCharges {
  designFee: number;
  laborFee: number;
  installationFee: number;
  deliveryFee: number;
  extraServicesTotal: number;
  totalCharges: number;
}

// ─── Quote Summary ───

export interface QuoteSummary {
  /** Sum of all line effectiveSubtotals */
  linesSubtotal: number;
  /** Breakdown of additional charges */
  charges: ComputedCharges;
  /** linesSubtotal + totalCharges */
  subtotalBeforeDiscount: number;
  /** The applied discount amount */
  discountAmount: number;
  /** subtotalBeforeDiscount − discountAmount */
  subtotalAfterDiscount: number;
  /** Tax amount (0 if tax disabled) */
  taxAmount: number;
  /** Final total: subtotalAfterDiscount + taxAmount */
  total: number;
}

// ─── Full Quote State ───

export interface QuoteState {
  lines: QuoteLineItem[];
  charges: AdditionalCharges;
  discount: DiscountConfig;
  tax: TaxConfig;
  summary: QuoteSummary;
}
