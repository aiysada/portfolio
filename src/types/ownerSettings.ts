/**
 * Indie Sign — Owner Settings & Local Data Architecture Types
 * Versioned schema for all browser-stored configuration.
 */

import type { CalcProduct, ChargeMethod, DiscountType } from "@/types/calculator";
import type { BusinessInfo } from "@/types/settings";
import type { QuoteHistoryRecord } from "@/types/quoteHistory";

export const SETTINGS_SCHEMA_VERSION = 1;
export const APP_IDENTIFIER = "indie-sign";

// ─── Material Pricing Entry ───

export interface MaterialPricingEntry {
  id: string;
  nameLao: string;
  nameEn: string;
  category: string;
  unit: string; // e.g. "m²", "ແຜ່ນ", "ມ້ວນ"
  sellingPrice: number;
  costPrice?: number;
  isActive: boolean;
  notes?: string;
}

// ─── Fee Preset ───

export interface FeeRateConfig {
  enabled: boolean;
  method: ChargeMethod;
  amount: number;
  notes?: string;
}

export interface AdditionalFeesConfig {
  designFee: FeeRateConfig;
  laborFee: FeeRateConfig;
  installationFee: FeeRateConfig;
  deliveryFee: FeeRateConfig;
  extraServicePresets: {
    id: string;
    nameLao: string;
    nameEn: string;
    amount: number;
    description?: string;
  }[];
}

// ─── Document & PDF Preferences ───

export interface OwnerDocumentSettings {
  quotationPrefix: string; // default "QT"
  invoicePrefix: string;   // default "INV"
  receiptPrefix: string;   // default "REC"
  defaultValidityDays: number; // default 15
  defaultQuotationTerms: string[];
  defaultFooterText: string;
  receiptPaperWidthMm: number; // default 80
  showSignatureLines: boolean;
  showBankDetailsOnInvoice: boolean;
}

// ─── Tax & Discount Defaults ───

export interface TaxDiscountDefaults {
  taxEnabled: boolean;
  taxRatePercent: number; // e.g. 7 or 10
  discountType: DiscountType; // "percentage" | "fixed"
  defaultDiscountValue: number;
}

// ─── Security Settings ───

export interface OwnerSecuritySettings {
  pinHash: string; // Hashed PIN (never plaintext)
  failedAttempts: number;
  lockoutUntil: number; // Timestamp ms, 0 if not locked out
  lockoutThreshold: number; // default 5 attempts
  lockoutDurationSec: number; // default 30 seconds
}

// ─── SEO & Analytics Settings ───

export interface SeoAnalyticsSettings {
  siteUrl: string; // e.g. "https://indiesign.la"
  googleAnalyticsId: string; // e.g. "G-XXXXXXXXXX"
  googleSearchConsoleTag: string; // verification meta tag or token
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywordsLao: string;
}

// ─── Portfolio Browser Metadata ───

export interface PortfolioBrowserMetadata {
  featuredProjectIds: string[];
  customCategoryLabels: Record<string, string>;
  lastUpdated: string;
}

// ─── Complete Versioned Application Settings ───

export interface CompleteOwnerSettings {
  schemaVersion: number;
  products: CalcProduct[];
  materials: MaterialPricingEntry[];
  fees: AdditionalFeesConfig;
  business: BusinessInfo;
  documents: OwnerDocumentSettings;
  taxDiscount: TaxDiscountDefaults;
  security: OwnerSecuritySettings;
  seo: SeoAnalyticsSettings;
  portfolioMeta: PortfolioBrowserMetadata;
  /** Saved quote history snapshots. Never recalculated from live prices. */
  quoteHistory: QuoteHistoryRecord[];
  updatedAt: string;
}

// ─── JSON Backup Payload ───

export interface BackupPayload {
  appId: typeof APP_IDENTIFIER;
  backupVersion: "1.0";
  schemaVersion: number;
  exportedAt: string;
  /** Settings excluding security (PIN hash) but including quoteHistory. */
  settings: Omit<CompleteOwnerSettings, "security">;
  warningNoteLao: string;
}

// ─── Authentication Session State ───

export interface OwnerAuthState {
  isAuthenticated: boolean;
  loginTimestamp?: number;
}
