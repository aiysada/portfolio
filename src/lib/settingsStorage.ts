/**
 * Indie Sign — Settings Storage, Migration, Backup & Restore Utilities
 *
 * Single source of truth for browser-stored configuration.
 * Safe JSON parsing, schema validation, and atomic restore.
 */

import {
  type CompleteOwnerSettings,
  type BackupPayload,
  type MaterialPricingEntry,
  type AdditionalFeesConfig,
  type OwnerDocumentSettings,
  type TaxDiscountDefaults,
  type OwnerSecuritySettings,
  type SeoAnalyticsSettings,
  SETTINGS_SCHEMA_VERSION,
  APP_IDENTIFIER,
} from "@/types/ownerSettings";
import { CALC_PRODUCTS } from "@/data/calculatorProducts";
import { DEFAULT_BUSINESS_INFO } from "@/data/businessInfo";
import { DEFAULT_PIN_HASH } from "@/lib/crypto";

export const SETTINGS_STORAGE_KEY = "indie_sign_settings_v1";
export const AUTH_SESSION_KEY = "indie_sign_owner_auth_session";

// In-memory fallback for environments without localStorage (tests, private browsing)
const memoryStorage = new Map<string, string>();

function storageGet(key: string): string | null {
  try {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem(key);
    }
  } catch {
    // Ignore
  }
  return memoryStorage.get(key) || null;
}

function storageSet(key: string, value: string): void {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, value);
      return;
    }
  } catch {
    // Ignore
  }
  memoryStorage.set(key, value);
}

export function clearSettingsStorage(): void {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_SESSION_KEY);
    }
  } catch {
    // Ignore
  }
  memoryStorage.clear();
}

// ─── Default Initial Settings ───

export function getDefaultOwnerSettings(): CompleteOwnerSettings {
  const defaultMaterials: MaterialPricingEntry[] = [
    {
      id: "mat-vinyl-black",
      nameLao: "ຜ້າໄວນິວຫຼັງດຳ (Black-back Vinyl)",
      nameEn: "Black-back Vinyl Roll",
      category: "vinyl",
      unit: "m²",
      sellingPrice: 130_000,
      costPrice: 85_000,
      isActive: true,
      notes: "ກັນແສງແດດ 100%, ເໝາະສຳລັບປ້າຍກາງແຈ້ງ",
    },
    {
      id: "mat-vinyl-white",
      nameLao: "ຜ້າໄວນິວຫຼັງຂາວ (White-back Vinyl)",
      nameEn: "White-back Vinyl Roll",
      category: "vinyl",
      unit: "m²",
      sellingPrice: 120_000,
      costPrice: 75_000,
      isActive: true,
      notes: "ເນື້ອຜ້າຂາວມາດຕະຖານ ສຳລັບປ້າຍທົ່ວໄປ",
    },
    {
      id: "mat-sticker-pvc",
      nameLao: "ສະຕິກເກີ PVC ຂາວເງົາ",
      nameEn: "White Glossy PVC Sticker",
      category: "vinyl",
      unit: "m²",
      sellingPrice: 250_000,
      costPrice: 140_000,
      isActive: true,
      notes: "ກັນນ້ຳ ກັນແດດ ສຳລັບຕິດກະຈົກ ແລະ ລົດ",
    },
    {
      id: "mat-acrylic-sheet",
      nameLao: "ແຜ່ນອະຄຣີລິກ 3mm",
      nameEn: "3mm Acrylic Sheet",
      category: "acrylic",
      unit: "m²",
      sellingPrice: 450_000,
      costPrice: 280_000,
      isActive: true,
      notes: "ອະຄຣີລິກຂາວນົມ/ໃສ ສຳລັບຕັດຕົວອັກສອນ",
    },
    {
      id: "mat-led-module",
      nameLao: "ຫຼອດໄຟ LED Module 3 ຕາ ກັນນ້ຳ",
      nameEn: "Waterproof LED Module 3-Eye",
      category: "lightbox",
      unit: "ອັນ",
      sellingPrice: 15_000,
      costPrice: 8_000,
      isActive: true,
      notes: "ໄຟ LED ສຳລັບກ່ອງໄຟ ແລະ ຕົວອັກສອນ 3D",
    },
  ];

  const defaultFees: AdditionalFeesConfig = {
    designFee: {
      enabled: false,
      method: "fixed",
      amount: 150_000,
      notes: "ຄ່າອອກແບບກາຟິກ/ໂລໂກ້",
    },
    laborFee: {
      enabled: false,
      method: "included",
      amount: 30_000,
      notes: "ຄ່າແຮງງານຜະລິດ",
    },
    installationFee: {
      enabled: false,
      method: "fixed",
      amount: 200_000,
      notes: "ຄ່າຕິດຕັ້ງໜ້າວຽກ",
    },
    deliveryFee: {
      enabled: false,
      method: "fixed",
      amount: 50_000,
      notes: "ຄ່າຈັດສົ່ງໃນເທດສະບານ",
    },
    extraServicePresets: [
      {
        id: "svc-uv-coating",
        nameLao: "ເຄືອບເງົາ UV ກັນຮອຍ",
        nameEn: "UV Protective Coating",
        amount: 50_000,
        description: "ເພີ່ມຄວາມທົນທານຕໍ່ແສງແດດ ແລະ ຮອຍຂີດຂ່ວນ",
      },
      {
        id: "svc-metal-frame",
        nameLao: "ໂຄງເຫຼັກກ່ອງມາດຕະຖານ",
        nameEn: "Standard Steel Box Frame",
        amount: 250_000,
        description: "ໂຄງເຫຼັກຮອງຮັບປ້າຍຂະໜາດກາງ-ໃຫຍ່",
      },
      {
        id: "svc-eyelets",
        nameLao: "ຕອກຕາໄກ່ + ພັບຂອບ",
        nameEn: "Grommets & Hemming",
        amount: 30_000,
        description: "ຕອກຕາໄກ່ຮອບດ້ານພ້ອມພັບເສີມຂອບ",
      },
      {
        id: "svc-alu-border",
        nameLao: "ຂອບອະລູມີນຽມ ສຳລັບກ່ອງໄຟ",
        nameEn: "Aluminum Profile Border",
        amount: 120_000,
        description: "ຂອບອະລູມີນຽມສຳເລັດຮູບ ສວຍງາມ ທັນສະໄໝ",
      },
    ],
  };

  const defaultDocuments: OwnerDocumentSettings = {
    quotationPrefix: "QT",
    invoicePrefix: "INV",
    receiptPrefix: "REC",
    defaultValidityDays: 15,
    defaultQuotationTerms: [
      "ໃບສະເໜີລາຄານີ້ມີຜົນບັງຄັບໃຊ້ 15 ວັນ ນັບຈາກວັນທີອອກເອກະສານ.",
      "ລາຄານີ້ເປັນລາຄາປະເມີນເບື້ອງຕົ້ນ, ລາຄາສຸດທິຕ້ອງໄດ້ຮັບການຢືນຢັນຈາກ Indie Sign ກ່ອນການຜະລິດ.",
      "ລາຍລະອຽດສະເພາະ ແລະ ລາຄາ ແມ່ນອີງຕາມລາຍການ ແລະ ຂະໜາດທີ່ລະບຸໄວ້ຂ້າງເທິງ.",
    ],
    defaultFooterText: "Indie Sign — ຄົບທຸກວຽກປ້າຍ ອອກແບບ ຜະລິດ ແລະຕິດຕັ້ງ. ໂທ: +856 20 5856 3868",
    receiptPaperWidthMm: 80,
    showSignatureLines: true,
    showBankDetailsOnInvoice: true,
  };

  const defaultTaxDiscount: TaxDiscountDefaults = {
    taxEnabled: false,
    taxRatePercent: 7,
    discountType: "percentage",
    defaultDiscountValue: 0,
  };

  const defaultSecurity: OwnerSecuritySettings = {
    pinHash: DEFAULT_PIN_HASH,
    failedAttempts: 0,
    lockoutUntil: 0,
    lockoutThreshold: 5,
    lockoutDurationSec: 30,
  };

  const defaultSeo: SeoAnalyticsSettings = {
    siteUrl: "",
    googleAnalyticsId: "",
    googleSearchConsoleTag: "",
    defaultTitle: "Indie Sign — ທຸລະກິດອອກແບບ ແລະ ຜະລິດປ້າຍຄົບວົງຈອນ",
    defaultDescription: "ຜູ້ຊ່ຽວຊານດ້ານການອອກແບບ ແລະ ຜະລິດປ້າຍໂຄສະນາຄົບວົງຈອນ ຄຳນວນລາຄາ ອອກໃບສະເໜີລາຄາ ພ້ອມຜົນງານຄຸນນະພາບສູງ",
    defaultKeywordsLao: "ຮັບເຮັດປ້າຍ, ອອກແບບປ້າຍ, ຜະລິດປ້າຍ, ຕິດຕັ້ງປ້າຍ, ພິມສະຕິກເກີ, ປ້າຍໄຟ, ນາມບັດ, ປ້າຍໂຄສະນາ, Indie Sign Laos",
  };

  return {
    schemaVersion: SETTINGS_SCHEMA_VERSION,
    products: [...CALC_PRODUCTS],
    materials: defaultMaterials,
    fees: defaultFees,
    business: { ...DEFAULT_BUSINESS_INFO },
    documents: defaultDocuments,
    taxDiscount: defaultTaxDiscount,
    security: defaultSecurity,
    seo: defaultSeo,
    portfolioMeta: {
      featuredProjectIds: [],
      customCategoryLabels: {},
      lastUpdated: new Date().toISOString(),
    },
    quoteHistory: [],
    updatedAt: new Date().toISOString(),
  };
}

// ─── Storage Operations ───

/**
 * Load complete settings from localStorage. If missing or invalid, initializes with safe defaults.
 */
export function loadSettingsFromStorage(): CompleteOwnerSettings {
  const raw = storageGet(SETTINGS_STORAGE_KEY);
  if (!raw) {
    const defaults = getDefaultOwnerSettings();
    saveSettingsToStorage(defaults);
    return defaults;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      throw new Error("Invalid stored settings root");
    }

    // Merge with defaults to ensure all required fields exist safely
    const defaults = getDefaultOwnerSettings();
    const merged: CompleteOwnerSettings = {
      ...defaults,
      ...parsed,
      products: Array.isArray(parsed.products) && parsed.products.length > 0 ? parsed.products : defaults.products,
      materials: Array.isArray(parsed.materials) ? parsed.materials : defaults.materials,
      fees: { ...defaults.fees, ...(parsed.fees || {}) },
      business: { ...defaults.business, ...(parsed.business || {}) },
      documents: { ...defaults.documents, ...(parsed.documents || {}) },
      taxDiscount: { ...defaults.taxDiscount, ...(parsed.taxDiscount || {}) },
      security: { ...defaults.security, ...(parsed.security || {}) },
      seo: { ...defaults.seo, ...(parsed.seo || {}) },
      portfolioMeta: { ...defaults.portfolioMeta, ...(parsed.portfolioMeta || {}) },
      quoteHistory: Array.isArray(parsed.quoteHistory) ? parsed.quoteHistory : [],
      schemaVersion: SETTINGS_SCHEMA_VERSION,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };

    return merged;
  } catch (err) {
    console.warn("Failed to parse stored owner settings. Resetting to defaults.", err);
    const defaults = getDefaultOwnerSettings();
    saveSettingsToStorage(defaults);
    return defaults;
  }
}

/**
 * Save complete settings to localStorage.
 */
export function saveSettingsToStorage(settings: CompleteOwnerSettings): boolean {
  try {
    const toSave: CompleteOwnerSettings = {
      ...settings,
      schemaVersion: SETTINGS_SCHEMA_VERSION,
      updatedAt: new Date().toISOString(),
    };
    storageSet(SETTINGS_STORAGE_KEY, JSON.stringify(toSave));
    return true;
  } catch (err) {
    console.error("Failed to save owner settings to storage:", err);
    return false;
  }
}

// ─── JSON Backup Export ───

/**
 * Create a clean JSON backup payload.
 * Excludes security PIN and auth session.
 */
export function createBackupPayload(settings: CompleteOwnerSettings): BackupPayload {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { security, ...safeSettings } = settings;

  return {
    appId: APP_IDENTIFIER,
    backupVersion: "1.0",
    schemaVersion: settings.schemaVersion,
    exportedAt: new Date().toISOString(),
    settings: safeSettings,
    warningNoteLao:
      "ໝາຍເຫດ: ໄຟລ໌ສຳຮອງນີ້ບັນຈຸສະເພາະຂໍ້ມູນການຕັ້ງຄ່າ, ລາຄາ, ແລະ ຂໍ້ມູນສິນຄ້າໃນ Browser ເທົ່ານັ້ນ. ໄຟລ໌ຮູບພາບຕົວຈິງ (Portfolio Images) ໃນ public/images/portfolio/ ຕ້ອງໄດ້ຮັບການສຳຮອງແຍກຕ່າງຫາກຜ່ານໂຟນເດີໂຄງການ.",
  };
}

/**
 * Generate formatted JSON string for download.
 */
export function generateBackupJsonString(settings: CompleteOwnerSettings): string {
  const payload = createBackupPayload(settings);
  return JSON.stringify(payload, null, 2);
}

// ─── JSON Backup Restore & Validation ───

export interface BackupValidationResult {
  isValid: boolean;
  errorLao?: string;
  payload?: BackupPayload;
}

/**
 * Atomically validate a backup JSON string before modifying any state.
 */
export function validateBackupJson(jsonString: string): BackupValidationResult {
  if (!jsonString || !jsonString.trim()) {
    return { isValid: false, errorLao: "ໄຟລ໌ສຳຮອງວ່າງເປົ່າ ບໍ່ມີຂໍ້ມູນ" };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    return { isValid: false, errorLao: "ຮູບແບບໄຟລ໌ບໍ່ຖືກຕ້ອງ (ບໍ່ແມ່ນໄຟລ໌ JSON ທີ່ສົມບູນ)" };
  }

  if (!parsed || typeof parsed !== "object") {
    return { isValid: false, errorLao: "ໂຄງສ້າງຂໍ້ມູນໃນໄຟລ໌ບໍ່ຖືກຕ້ອງ" };
  }

  const p = parsed as Partial<BackupPayload>;

  // Check Application Identifier
  if (p.appId !== APP_IDENTIFIER) {
    return {
      isValid: false,
      errorLao: `ໄຟລ໌ສຳຮອງນີ້ບໍ່ແມ່ນຂອງລະບົບ Indie Sign (ພົບ appId: ${p.appId || "ບໍ່ມີ"})`,
    };
  }

  // Check Schema Version
  if (typeof p.schemaVersion !== "number" || p.schemaVersion > SETTINGS_SCHEMA_VERSION) {
    return {
      isValid: false,
      errorLao: `ເວີຊັນ Schema ຂອງໄຟລ໌ສຳຮອງ (${p.schemaVersion}) ໃໝ່ກວ່າທີ່ລະບົບຮອງຮັບ (${SETTINGS_SCHEMA_VERSION})`,
    };
  }

  // Check Required Settings Structures
  if (!p.settings || typeof p.settings !== "object") {
    return { isValid: false, errorLao: "ບໍ່ພົບຂໍ້ມູນການຕັ້ງຄ່າ (Settings payload) ໃນໄຟລ໌" };
  }

  const s = p.settings as Partial<CompleteOwnerSettings>;
  if (!Array.isArray(s.products)) {
    return { isValid: false, errorLao: "ຂໍ້ມູນສິນຄ້າ (Products) ໃນໄຟລ໌ບໍ່ຖືກຕ້ອງ" };
  }

  return {
    isValid: true,
    payload: parsed as BackupPayload,
  };
}

/**
 * Atomically apply validated backup payload into current settings without overwriting PIN.
 */
export function restoreFromBackup(
  currentSettings: CompleteOwnerSettings,
  payload: BackupPayload
): CompleteOwnerSettings {
  const restored: CompleteOwnerSettings = {
    ...currentSettings,
    ...payload.settings,
    // Preserve existing security PIN & lockout state
    security: currentSettings.security,
    schemaVersion: SETTINGS_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
  };

  saveSettingsToStorage(restored);
  return restored;
}
