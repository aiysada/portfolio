/**
 * Indie Sign — Price Calculator Engine
 * Full calculation logic for signage pricing.
 */

import type { CalculationInput, CalculationResult } from "@/types/signage";
import type { SignageProduct, MaterialOption } from "@/types/signage";

/** LED lighting cost per m² based on module type */
export const LED_COSTS_PER_M2: Record<string, number> = {
  standard: 180_000,    // Standard warm-white LED modules
  highbright: 280_000,  // High-brightness outdoor modules
  rgb: 420_000,         // RGB color-changing modules
  neon: 350_000,        // Neon Flex (per-meter approximation)
};

/** Installation cost per m² */
export const INSTALLATION_COST_PER_M2 = 120_000;

/** Minimum installation charge (even for small signs) */
export const INSTALLATION_MIN_CHARGE = 200_000;

/** Minimum area for billing (in m²) */
export const MIN_BILLABLE_AREA = 0.25;

/**
 * Compute geometry (area and perimeter) from cm dimensions.
 */
export function calculateSignGeometry(widthCm: number, heightCm: number) {
  const widthM = widthCm / 100;
  const heightM = heightCm / 100;
  const areaM2 = Math.max(MIN_BILLABLE_AREA, widthM * heightM);
  const perimeterM = 2 * (widthM + heightM);
  return {
    areaM2: Number(areaM2.toFixed(4)),
    perimeterM: Number(perimeterM.toFixed(4)),
  };
}

/**
 * Full signage price calculation.
 */
export function calculateSignagePrice(
  input: CalculationInput,
  product: SignageProduct,
  material?: MaterialOption
): CalculationResult {
  const { areaM2, perimeterM } = calculateSignGeometry(input.widthCm, input.heightCm);

  // Material cost: use chosen material if available, otherwise use product base price
  const matPricePerM2 = material ? material.pricePerUnit : product.basePrice;
  const materialCost = matPricePerM2 * areaM2 * input.quantity;

  // LED / lighting cost
  let lightingCost = 0;
  if (input.hasLedLighting && input.ledType) {
    const ledRate = LED_COSTS_PER_M2[input.ledType] ?? LED_COSTS_PER_M2.standard;
    lightingCost = ledRate * areaM2 * input.quantity;
  }

  // Installation cost
  let installationCost = 0;
  if (input.installationRequired) {
    const rawInstall = INSTALLATION_COST_PER_M2 * areaM2 * input.quantity;
    installationCost = Math.max(rawInstall, INSTALLATION_MIN_CHARGE);
  }

  const subtotal = materialCost + lightingCost + installationCost;

  // Volume discount: 5% for 3+, 10% for 5+
  let discountRate = 0;
  if (input.quantity >= 5) discountRate = 0.10;
  else if (input.quantity >= 3) discountRate = 0.05;

  const discount = subtotal * discountRate;
  const total = subtotal - discount;

  return {
    areaM2,
    perimeterM,
    materialCost,
    lightingCost,
    installationCost,
    subtotal,
    discount,
    total,
    currency: "LAK",
  };
}

/**
 * Stub for backward compatibility (used during dev phase).
 * @deprecated Use calculateSignagePrice instead.
 */
export function estimateSignPriceStub(
  input: CalculationInput,
  baseRatePerM2 = 500_000
): CalculationResult {
  const { areaM2, perimeterM } = calculateSignGeometry(input.widthCm, input.heightCm);
  const materialCost = areaM2 * baseRatePerM2 * input.quantity;
  const lightingCost = input.hasLedLighting ? perimeterM * 150_000 * input.quantity : 0;
  const installationCost = input.installationRequired ? 200_000 : 0;
  const subtotal = materialCost + lightingCost + installationCost;
  return {
    areaM2,
    perimeterM,
    materialCost,
    lightingCost,
    installationCost,
    subtotal,
    discount: 0,
    total: subtotal,
    currency: "LAK",
  };
}

/**
 * Format a number as LAK currency string.
 */
export function formatLAK(amount: number): string {
  return (
    new Intl.NumberFormat("lo-LA", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(amount)) + " ₭"
  );
}

/**
 * Format a dimension area to 2 decimal places.
 */
export function formatArea(area: number): string {
  return area.toFixed(2) + " m²";
}
