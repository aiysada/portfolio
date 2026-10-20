/**
 * Indie Sign — Document System Type Definitions
 * Shared types for Quotation, Invoice, and Receipt documents.
 */

import type {
  PricingMethod,
  DimensionUnit,
  DiscountConfig,
  TaxConfig,
  ExtraServiceItem,
} from "@/types/calculator";
import type { BusinessInfo } from "@/types/settings";

export type DocumentType = "quotation" | "invoice" | "receipt";

export interface CustomerInfo {
  name: string;
  phone: string;
  address?: string;
  company?: string;
}

export interface DocumentItemSnapshot {
  id: string;
  productNameLao: string;
  productNameEn: string;
  pricingMethod: PricingMethod;
  width: number;
  height: number;
  dimensionUnit: DimensionUnit;
  areaM2: number;
  quantity: number;
  unitPrice: number;
  lineSubtotal: number;
  effectiveSubtotal: number;
  minPriceApplied: boolean;
  minPrice: number;
  notes: string;
}

export interface DocumentChargesSnapshot {
  designFee: number;
  laborFee: number;
  installationFee: number;
  deliveryFee: number;
  extraServices: ExtraServiceItem[];
  extraServicesTotal: number;
  totalCharges: number;
}

export interface DocumentData {
  type: DocumentType;
  number: string;
  issueDate: string; // YYYY-MM-DD
  validUntilDate?: string; // YYYY-MM-DD (15 days for quotation)
  customer: CustomerInfo;
  business: BusinessInfo;
  items: DocumentItemSnapshot[];
  charges: DocumentChargesSnapshot;
  linesSubtotal: number;
  totalCharges: number;
  subtotalBeforeDiscount: number;
  discount: DiscountConfig;
  discountAmount: number;
  subtotalAfterDiscount: number;
  tax: TaxConfig;
  taxAmount: number;
  total: number;

  // Receipt & Payment specific fields
  amountPaid?: number;
  remainingBalance?: number;
  paymentMethod?: string;
  paymentNote?: string;
  receiptPaperWidthMm?: number; // e.g. 80mm for thermal/compact receipt

  notes: string;
  terms: string[];
}
