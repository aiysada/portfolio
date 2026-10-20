/**
 * Indie Sign — useQuoteCalculator Hook
 *
 * Main state management for the multi-line quote calculator.
 * All calculation is delegated to pure functions in lib/pricing.ts.
 */

import { useState, useCallback, useMemo } from "react";
import type {
  QuoteLineItem,
  AdditionalCharges,
  DiscountConfig,
  TaxConfig,
  QuoteSummary,
  CalcProduct,
  DimensionUnit,
  PricingMethod,
  ChargeConfig,
  ExtraServiceItem,
} from "@/types/calculator";
import { computeLine, computeQuoteSummary } from "@/lib/pricing";
import { CALC_PRODUCTS, findCalcProduct } from "@/data/calculatorProducts";
import { useOwnerSettings } from "@/context/OwnerSettingsContext";

// ─── ID Generator ───

let lineCounter = 0;
function generateLineId(): string {
  lineCounter++;
  return `line-${Date.now()}-${lineCounter}`;
}

function generateServiceId(): string {
  return `svc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Default Configs ───

const DEFAULT_CHARGES: AdditionalCharges = {
  designFee: { enabled: false, method: "fixed", amount: 0 },
  laborFee: { enabled: false, method: "included", amount: 0 },
  installationFee: { enabled: false, method: "included", amount: 0 },
  deliveryFee: { enabled: false, method: "fixed", amount: 0 },
  extraServices: [],
};

const DEFAULT_DISCOUNT: DiscountConfig = {
  type: "percentage",
  value: 0,
};

const DEFAULT_TAX: TaxConfig = {
  enabled: false,
  rate: 0,
};

// ─── Helper: Create a line from a product ───

function createLineFromProduct(product: CalcProduct): QuoteLineItem {
  const id = generateLineId();
  const base: QuoteLineItem = {
    id,
    productId: product.id,
    productNameLao: product.nameLao,
    productNameEn: product.nameEn,
    pricingMethod: product.pricingMethod,
    width: product.pricingMethod === "per_m2" ? 100 : 0,
    height: product.pricingMethod === "per_m2" ? 100 : 0,
    dimensionUnit: "cm",
    areaM2: 0,
    quantity: 1,
    unitPrice: product.unitPrice,
    lineSubtotal: 0,
    minPrice: product.minPrice,
    minPriceApplied: false,
    effectiveSubtotal: 0,
    notes: "",
  };

  // Compute initial values
  const computed = computeLine(base);
  return {
    ...base,
    areaM2: computed.areaM2,
    lineSubtotal: computed.lineSubtotal,
    effectiveSubtotal: computed.effectiveSubtotal,
    minPriceApplied: computed.minPriceApplied,
  };
}

/**
 * Recalculate a single line's computed fields.
 */
function recalcLine(line: QuoteLineItem): QuoteLineItem {
  const computed = computeLine(line);
  return {
    ...line,
    areaM2: computed.areaM2,
    lineSubtotal: computed.lineSubtotal,
    effectiveSubtotal: computed.effectiveSubtotal,
    minPriceApplied: computed.minPriceApplied,
  };
}

// ─── Hook ───

export function useQuoteCalculator() {
  let ownerContext: ReturnType<typeof useOwnerSettings> | null = null;
  try {
    ownerContext = useOwnerSettings();
  } catch {
    // In environments without provider (e.g. isolated unit tests)
  }

  const liveProducts = ownerContext ? ownerContext.settings.products : CALC_PRODUCTS;

  const [lines, setLines] = useState<QuoteLineItem[]>([]);
  const [charges, setCharges] = useState<AdditionalCharges>(DEFAULT_CHARGES);
  const [discount, setDiscount] = useState<DiscountConfig>(DEFAULT_DISCOUNT);
  const [tax, setTax] = useState<TaxConfig>(DEFAULT_TAX);

  // Helper to find a product in live products or fallback
  const getProduct = useCallback(
    (productId: string): CalcProduct | undefined => {
      return liveProducts.find((p) => p.id === productId) || findCalcProduct(productId);
    },
    [liveProducts]
  );

  // ─── Summary (always computed from current state) ───

  const summary: QuoteSummary = useMemo(
    () => computeQuoteSummary(lines, charges, discount, tax),
    [lines, charges, discount, tax]
  );

  // ─── Line Actions ───

  const addLine = useCallback(
    (productId: string) => {
      const product = getProduct(productId);
      if (!product) return;
      const newLine = createLineFromProduct(product);
      setLines((prev) => [...prev, newLine]);
    },
    [getProduct]
  );

  const addCustomLine = useCallback(() => {
    const custom = getProduct("calc-custom") || findCalcProduct("calc-custom");
    if (custom) {
      const newLine = createLineFromProduct(custom);
      setLines((prev) => [...prev, newLine]);
    }
  }, [getProduct]);

  const removeLine = useCallback((lineId: string) => {
    setLines((prev) => prev.filter((l) => l.id !== lineId));
  }, []);

  const duplicateLine = useCallback((lineId: string) => {
    setLines((prev) => {
      const source = prev.find((l) => l.id === lineId);
      if (!source) return prev;
      const dup: QuoteLineItem = {
        ...source,
        id: generateLineId(),
        notes: source.notes ? `(ສຳເນົາ) ${source.notes}` : "",
      };
      const idx = prev.findIndex((l) => l.id === lineId);
      const next = [...prev];
      next.splice(idx + 1, 0, dup);
      return next;
    });
  }, []);

  const updateLine = useCallback(
    (lineId: string, updates: Partial<QuoteLineItem>) => {
      setLines((prev) =>
        prev.map((line) => {
          if (line.id !== lineId) return line;
          const merged = { ...line, ...updates };
          return recalcLine(merged);
        })
      );
    },
    []
  );

  const updateLineDimensions = useCallback(
    (
      lineId: string,
      width: number,
      height: number,
      unit: DimensionUnit
    ) => {
      updateLine(lineId, { width, height, dimensionUnit: unit });
    },
    [updateLine]
  );

  const updateLineQuantity = useCallback(
    (lineId: string, quantity: number) => {
      updateLine(lineId, { quantity });
    },
    [updateLine]
  );

  const updateLineUnitPrice = useCallback(
    (lineId: string, unitPrice: number) => {
      updateLine(lineId, { unitPrice });
    },
    [updateLine]
  );

  const updateLineNotes = useCallback(
    (lineId: string, notes: string) => {
      updateLine(lineId, { notes });
    },
    [updateLine]
  );

  const updateLinePricingMethod = useCallback(
    (lineId: string, pricingMethod: PricingMethod) => {
      updateLine(lineId, { pricingMethod });
    },
    [updateLine]
  );

  const updateLineProduct = useCallback(
    (lineId: string, productId: string) => {
      const product = getProduct(productId);
      if (!product) return;
      updateLine(lineId, {
        productId: product.id,
        productNameLao: product.nameLao,
        productNameEn: product.nameEn,
        pricingMethod: product.pricingMethod,
        unitPrice: product.unitPrice,
        minPrice: product.minPrice,
        width: product.pricingMethod === "per_m2" ? 100 : 0,
        height: product.pricingMethod === "per_m2" ? 100 : 0,
      });
    },
    [updateLine]
  );

  // ─── Charge Actions ───

  const updateCharge = useCallback(
    (
      key: "designFee" | "laborFee" | "installationFee" | "deliveryFee",
      config: Partial<ChargeConfig>
    ) => {
      setCharges((prev) => ({
        ...prev,
        [key]: { ...prev[key], ...config },
      }));
    },
    []
  );

  const addExtraService = useCallback((nameLao: string, amount: number) => {
    const svc: ExtraServiceItem = {
      id: generateServiceId(),
      nameLao,
      amount,
    };
    setCharges((prev) => ({
      ...prev,
      extraServices: [...prev.extraServices, svc],
    }));
  }, []);

  const removeExtraService = useCallback((svcId: string) => {
    setCharges((prev) => ({
      ...prev,
      extraServices: prev.extraServices.filter((s) => s.id !== svcId),
    }));
  }, []);

  const updateExtraService = useCallback(
    (svcId: string, updates: Partial<ExtraServiceItem>) => {
      setCharges((prev) => ({
        ...prev,
        extraServices: prev.extraServices.map((s) =>
          s.id === svcId ? { ...s, ...updates } : s
        ),
      }));
    },
    []
  );

  // ─── Discount Actions ───

  const updateDiscount = useCallback((updates: Partial<DiscountConfig>) => {
    setDiscount((prev) => ({ ...prev, ...updates }));
  }, []);

  // ─── Tax Actions ───

  const updateTax = useCallback((updates: Partial<TaxConfig>) => {
    setTax((prev) => ({ ...prev, ...updates }));
  }, []);

  // ─── Reset ───

  const resetAll = useCallback(() => {
    setLines([]);
    setCharges(DEFAULT_CHARGES);
    setDiscount(DEFAULT_DISCOUNT);
    setTax(DEFAULT_TAX);
  }, []);

  return {
    // State
    lines,
    charges,
    discount,
    tax,
    summary,
    products: liveProducts,

    // Line actions
    addLine,
    addCustomLine,
    removeLine,
    duplicateLine,
    updateLine,
    updateLineDimensions,
    updateLineQuantity,
    updateLineUnitPrice,
    updateLineNotes,
    updateLinePricingMethod,
    updateLineProduct,

    // Charge actions
    updateCharge,
    addExtraService,
    removeExtraService,
    updateExtraService,

    // Discount & Tax
    updateDiscount,
    updateTax,

    // Reset
    resetAll,
  };
}
