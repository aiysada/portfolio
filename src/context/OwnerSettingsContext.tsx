/**
 * Indie Sign — OwnerSettingsContext
 * Global React context for reactive settings, live syncing, and PIN authentication.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type {
  CompleteOwnerSettings,
  OwnerAuthState,
  MaterialPricingEntry,
  AdditionalFeesConfig,
  OwnerDocumentSettings,
  TaxDiscountDefaults,
  SeoAnalyticsSettings,
  BackupPayload,
} from "@/types/ownerSettings";
import type { CalcProduct } from "@/types/calculator";
import type { BusinessInfo } from "@/types/settings";
import type { QuoteHistoryRecord } from "@/types/quoteHistory";
import {
  loadSettingsFromStorage,
  saveSettingsToStorage,
  getDefaultOwnerSettings,
  generateBackupJsonString,
  validateBackupJson,
  restoreFromBackup,
  AUTH_SESSION_KEY,
} from "@/lib/settingsStorage";
import { hashPin, verifyPin } from "@/lib/crypto";

interface OwnerSettingsContextValue {
  settings: CompleteOwnerSettings;
  authState: OwnerAuthState;
  isLockedOut: boolean;
  lockoutRemainingSec: number;

  // Authentication
  loginWithPin: (pin: string) => Promise<{ success: boolean; errorLao?: string }>;
  logout: () => void;
  changePin: (
    currentPin: string,
    newPin: string
  ) => Promise<{ success: boolean; errorLao?: string }>;

  // Section updates
  updateProducts: (products: CalcProduct[]) => void;
  addProduct: (product: CalcProduct) => void;
  editProduct: (id: string, updates: Partial<CalcProduct>) => void;
  deleteProduct: (id: string) => void;

  updateMaterials: (materials: MaterialPricingEntry[]) => void;
  updateFees: (fees: Partial<AdditionalFeesConfig>) => void;
  updateBusiness: (business: Partial<BusinessInfo>) => void;
  updateDocuments: (documents: Partial<OwnerDocumentSettings>) => void;
  updateTaxDiscount: (taxDiscount: Partial<TaxDiscountDefaults>) => void;
  updateSeo: (seo: Partial<SeoAnalyticsSettings>) => void;

  // Backup & Restore
  exportBackup: () => string;
  restoreBackup: (jsonString: string) => { success: boolean; errorLao?: string; payload?: BackupPayload };
  resetToDefaults: () => void;

  // Quote History
  saveQuoteRecord: (record: QuoteHistoryRecord) => { success: boolean; errorLao?: string };
  updateQuoteRecord: (id: string, updates: Partial<QuoteHistoryRecord>) => { success: boolean; errorLao?: string };
  deleteQuoteRecord: (id: string) => { success: boolean; errorLao?: string };
  getQuoteHistory: () => QuoteHistoryRecord[];
}

const OwnerSettingsContext = createContext<OwnerSettingsContextValue | null>(null);

export const OwnerSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<CompleteOwnerSettings>(() =>
    loadSettingsFromStorage()
  );

  // Authentication session state (in sessionStorage so closing browser logs out)
  const [authState, setAuthState] = useState<OwnerAuthState>(() => {
    try {
      if (typeof sessionStorage !== "undefined") {
        const session = sessionStorage.getItem(AUTH_SESSION_KEY);
        if (session) {
          const parsed = JSON.parse(session);
          if (parsed && parsed.isAuthenticated) {
            return { isAuthenticated: true, loginTimestamp: parsed.loginTimestamp };
          }
        }
      }
    } catch {
      // Ignore
    }
    return { isAuthenticated: false };
  });

  // Lockout countdown timer
  const [now, setNow] = useState<number>(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isLockedOut = settings.security.lockoutUntil > now;
  const lockoutRemainingSec = isLockedOut
    ? Math.max(0, Math.ceil((settings.security.lockoutUntil - now) / 1000))
    : 0;

  // Sync settings state to localStorage on update
  const persistSettings = useCallback((newSettings: CompleteOwnerSettings) => {
    setSettings(newSettings);
    saveSettingsToStorage(newSettings);
  }, []);

  // ─── PIN Authentication Actions ───

  const loginWithPin = useCallback(
    async (pin: string): Promise<{ success: boolean; errorLao?: string }> => {
      // 1. Check lockout
      if (settings.security.lockoutUntil > Date.now()) {
        const remaining = Math.ceil(
          (settings.security.lockoutUntil - Date.now()) / 1000
        );
        return {
          success: false,
          errorLao: `ລະບົບຖືກລັອກຊົ່ວຄາວ ເນື່ອງຈາກໃສ່ລະຫັດຜິດຫຼາຍຄັ້ງ. ກະລຸນາລໍຖ້າອີກ ${remaining} ວິນາທີ.`,
        };
      }

      // 2. Verify PIN
      const isMatch = await verifyPin(pin, settings.security.pinHash);
      if (isMatch) {
        // Reset failed attempts & clear lockout
        const updated: CompleteOwnerSettings = {
          ...settings,
          security: {
            ...settings.security,
            failedAttempts: 0,
            lockoutUntil: 0,
          },
        };
        persistSettings(updated);

        const newAuth: OwnerAuthState = {
          isAuthenticated: true,
          loginTimestamp: Date.now(),
        };
        setAuthState(newAuth);
        try {
          if (typeof sessionStorage !== "undefined") {
            sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(newAuth));
          }
        } catch {
          // Ignore
        }
        return { success: true };
      } else {
        // Increment failed attempts
        const attempts = settings.security.failedAttempts + 1;
        let lockoutUntil = 0;
        let errorLao = "ລະຫັດ PIN ບໍ່ຖືກຕ້ອງ. ກະລຸນາລອງໃໝ່.";

        if (attempts >= settings.security.lockoutThreshold) {
          lockoutUntil = Date.now() + settings.security.lockoutDurationSec * 1000;
          errorLao = `ໃສ່ລະຫັດ PIN ຜິດເກີນກຳນົດ (${attempts} ຄັ້ງ). ລະບົບຖືກລັອກຊົ່ວຄາວ ${settings.security.lockoutDurationSec} ວິນາທີ.`;
        }

        const updated: CompleteOwnerSettings = {
          ...settings,
          security: {
            ...settings.security,
            failedAttempts: attempts,
            lockoutUntil,
          },
        };
        persistSettings(updated);
        return { success: false, errorLao };
      }
    },
    [settings, persistSettings]
  );

  const logout = useCallback(() => {
    setAuthState({ isAuthenticated: false });
    try {
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.removeItem(AUTH_SESSION_KEY);
      }
    } catch {
      // Ignore
    }
  }, []);

  const changePin = useCallback(
    async (
      currentPin: string,
      newPin: string
    ): Promise<{ success: boolean; errorLao?: string }> => {
      // Verify current PIN first
      const isMatch = await verifyPin(currentPin, settings.security.pinHash);
      if (!isMatch) {
        return { success: false, errorLao: "ລະຫັດ PIN ປັດຈຸບັນບໍ່ຖືກຕ້ອງ" };
      }

      if (!newPin || newPin.length < 4 || newPin.length > 8) {
        return {
          success: false,
          errorLao: "ລະຫັດ PIN ໃໝ່ຕ້ອງມີຄວາມຍາວ 4 ຫາ 8 ຕົວເລກ",
        };
      }

      if (!/^\d+$/.test(newPin)) {
        return {
          success: false,
          errorLao: "ລະຫັດ PIN ຕ້ອງເປັນຕົວເລກ (0-9) ເທົ່ານັ້ນ",
        };
      }

      const newHash = await hashPin(newPin);
      const updated: CompleteOwnerSettings = {
        ...settings,
        security: {
          ...settings.security,
          pinHash: newHash,
          failedAttempts: 0,
          lockoutUntil: 0,
        },
      };
      persistSettings(updated);
      return { success: true };
    },
    [settings, persistSettings]
  );

  // ─── Products & Pricing Updates ───

  const updateProducts = useCallback(
    (products: CalcProduct[]) => {
      persistSettings({ ...settings, products });
    },
    [settings, persistSettings]
  );

  const addProduct = useCallback(
    (product: CalcProduct) => {
      persistSettings({
        ...settings,
        products: [...settings.products, product],
      });
    },
    [settings, persistSettings]
  );

  const editProduct = useCallback(
    (id: string, updates: Partial<CalcProduct>) => {
      persistSettings({
        ...settings,
        products: settings.products.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      });
    },
    [settings, persistSettings]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      persistSettings({
        ...settings,
        products: settings.products.filter((p) => p.id !== id),
      });
    },
    [settings, persistSettings]
  );

  // ─── Section Updates ───

  const updateMaterials = useCallback(
    (materials: MaterialPricingEntry[]) => {
      persistSettings({ ...settings, materials });
    },
    [settings, persistSettings]
  );

  const updateFees = useCallback(
    (fees: Partial<AdditionalFeesConfig>) => {
      persistSettings({
        ...settings,
        fees: { ...settings.fees, ...fees },
      });
    },
    [settings, persistSettings]
  );

  const updateBusiness = useCallback(
    (business: Partial<BusinessInfo>) => {
      persistSettings({
        ...settings,
        business: { ...settings.business, ...business },
      });
    },
    [settings, persistSettings]
  );

  const updateDocuments = useCallback(
    (documents: Partial<OwnerDocumentSettings>) => {
      persistSettings({
        ...settings,
        documents: { ...settings.documents, ...documents },
      });
    },
    [settings, persistSettings]
  );

  const updateTaxDiscount = useCallback(
    (taxDiscount: Partial<TaxDiscountDefaults>) => {
      persistSettings({
        ...settings,
        taxDiscount: { ...settings.taxDiscount, ...taxDiscount },
      });
    },
    [settings, persistSettings]
  );

  const updateSeo = useCallback(
    (seo: Partial<SeoAnalyticsSettings>) => {
      persistSettings({
        ...settings,
        seo: { ...settings.seo, ...seo },
      });
    },
    [settings, persistSettings]
  );

  // ─── Backup & Restore ───

  const exportBackup = useCallback(() => {
    return generateBackupJsonString(settings);
  }, [settings]);

  const restoreBackup = useCallback(
    (
      jsonString: string
    ): { success: boolean; errorLao?: string; payload?: BackupPayload } => {
      const validation = validateBackupJson(jsonString);
      if (!validation.isValid || !validation.payload) {
        return { success: false, errorLao: validation.errorLao };
      }

      const restored = restoreFromBackup(settings, validation.payload);
      setSettings(restored);
      return { success: true, payload: validation.payload };
    },
    [settings]
  );

  const resetToDefaults = useCallback(() => {
    const defaults = getDefaultOwnerSettings();
    persistSettings(defaults);
  }, [persistSettings]);

  // ─── Quote History CRUD ───

  const saveQuoteRecord = useCallback(
    (record: QuoteHistoryRecord): { success: boolean; errorLao?: string } => {
      // Guard: avoid duplicates by checking if record ID already exists
      const exists = settings.quoteHistory.some((r) => r.id === record.id);
      if (exists) {
        return { success: false, errorLao: "ໃບປະເມີນນີ້ຖືກບັນທຶກແລ້ວ (ID ຊ້ຳກັນ)" };
      }
      try {
        persistSettings({
          ...settings,
          quoteHistory: [record, ...settings.quoteHistory],
        });
        return { success: true };
      } catch {
        return { success: false, errorLao: "ພື້ນທີ່ເກັບຂໍ້ມູນໃນ Browser ເຕັມ — ກະລຸນາລົບຂໍ້ມູນເກົ່າ ຫຼື Export Backup ກ່ອນ" };
      }
    },
    [settings, persistSettings]
  );

  const updateQuoteRecord = useCallback(
    (id: string, updates: Partial<QuoteHistoryRecord>): { success: boolean; errorLao?: string } => {
      const idx = settings.quoteHistory.findIndex((r) => r.id === id);
      if (idx === -1) {
        return { success: false, errorLao: "ບໍ່ພົບໃບປະເມີນທີ່ຕ້ອງການອັບເດດ" };
      }
      try {
        const updated = [
          ...settings.quoteHistory.slice(0, idx),
          { ...settings.quoteHistory[idx], ...updates, updatedAt: new Date().toISOString() },
          ...settings.quoteHistory.slice(idx + 1),
        ];
        persistSettings({ ...settings, quoteHistory: updated });
        return { success: true };
      } catch {
        return { success: false, errorLao: "ເກີດຂໍ້ຜິດພາດໃນການອັບເດດໃບປະເມີນ" };
      }
    },
    [settings, persistSettings]
  );

  const deleteQuoteRecord = useCallback(
    (id: string): { success: boolean; errorLao?: string } => {
      const exists = settings.quoteHistory.some((r) => r.id === id);
      if (!exists) {
        return { success: false, errorLao: "ບໍ່ພົບໃບປະເມີນທີ່ຕ້ອງການລົບ" };
      }
      persistSettings({
        ...settings,
        quoteHistory: settings.quoteHistory.filter((r) => r.id !== id),
      });
      return { success: true };
    },
    [settings, persistSettings]
  );

  const getQuoteHistory = useCallback(
    (): QuoteHistoryRecord[] => settings.quoteHistory ?? [],
    [settings.quoteHistory]
  );

  const value = useMemo(
    () => ({
      settings,
      authState,
      isLockedOut,
      lockoutRemainingSec,
      loginWithPin,
      logout,
      changePin,
      updateProducts,
      addProduct,
      editProduct,
      deleteProduct,
      updateMaterials,
      updateFees,
      updateBusiness,
      updateDocuments,
      updateTaxDiscount,
      updateSeo,
      exportBackup,
      restoreBackup,
      resetToDefaults,
      saveQuoteRecord,
      updateQuoteRecord,
      deleteQuoteRecord,
      getQuoteHistory,
    }),
    [
      settings,
      authState,
      isLockedOut,
      lockoutRemainingSec,
      loginWithPin,
      logout,
      changePin,
      updateProducts,
      addProduct,
      editProduct,
      deleteProduct,
      updateMaterials,
      updateFees,
      updateBusiness,
      updateDocuments,
      updateTaxDiscount,
      updateSeo,
      exportBackup,
      restoreBackup,
      resetToDefaults,
      saveQuoteRecord,
      updateQuoteRecord,
      deleteQuoteRecord,
      getQuoteHistory,
    ]
  );

  return (
    <OwnerSettingsContext.Provider value={value}>
      {children}
    </OwnerSettingsContext.Provider>
  );
};

export function useOwnerSettings(): OwnerSettingsContextValue {
  const context = useContext(OwnerSettingsContext);
  if (!context) {
    throw new Error(
      "useOwnerSettings must be used within an OwnerSettingsProvider"
    );
  }
  return context;
}
