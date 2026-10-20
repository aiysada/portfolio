/**
 * Indie Sign — Pricing Calculation Engine
 *
 * Pure functions for computing line item totals, additional charges,
 * discounts, tax, and the full quote summary.
 *
 * ╔════════════════════════════════════════════════════════════════╗
 * ║  CALCULATION ORDER                                           ║
 * ║  1. Calculate base line subtotals (pricing method)           ║
 * ║  2. Apply minimum-price rules where configured               ║
 * ║  3. Sum all line effectiveSubtotals → linesSubtotal          ║
 * ║  4. Calculate design, labor, installation, delivery charges  ║
 * ║  5. subtotalBeforeDiscount = linesSubtotal + totalCharges    ║
 * ║  6. Apply the selected discount                              ║
 * ║  7. Calculate tax on discounted amount (if enabled)          ║
 * ║  8. final total = subtotalAfterDiscount + taxAmount          ║
 * ╚════════════════════════════════════════════════════════════════╝
 */

import type {
  PricingMethod,
  QuoteLineItem,
  AdditionalCharges,
  ChargeConfig,
  DiscountConfig,
  TaxConfig,
  ComputedCharges,
  QuoteSummary,
} from "@/types/calculator";
import { calculateAreaM2 } from "@/lib/units";
import type { DimensionUnit } from "@/types/calculator";

// ─── Safe Math ───

/** Ensure a number is finite and non-NaN; return 0 otherwise. */
function safe(n: number): number {
  return isFinite(n) && !isNaN(n) ? n : 0;
}

// ─── Line Item Calculation ───

/**
 * Compute the area (m²) for a line item based on its dimensions and unit.
 */
export function computeLineArea(
  width: number,
  height: number,
  unit: DimensionUnit
): number {
  return safe(calculateAreaM2(width, height, unit));
}

/**
 * Compute the base line subtotal before minimum-price rules.
 *
 * Formulas:
 *   per_m2:   areaM2 × unitPrice × quantity
 *   per_item: unitPrice × quantity
 *   fixed:    unitPrice × quantity
 *   manual:   unitPrice × quantity
 */
export function computeLineSubtotal(
  pricingMethod: PricingMethod,
  areaM2: number,
  unitPrice: number,
  quantity: number
): number {
  const price = Math.max(0, safe(unitPrice));
  const qty = Math.max(0, safe(quantity));
  const area = Math.max(0, safe(areaM2));

  switch (pricingMethod) {
    case "per_m2":
      return area * price * qty;
    case "per_item":
    case "fixed":
    case "manual":
      return price * qty;
    default:
      return 0;
  }
}

/**
 * Apply the minimum-price rule to a line subtotal.
 * If minPrice > 0 and lineSubtotal < minPrice, return minPrice.
 */
export function applyMinimumPrice(
  lineSubtotal: number,
  minPrice: number
): { effectiveSubtotal: number; minPriceApplied: boolean } {
  const sub = safe(lineSubtotal);
  const min = safe(minPrice);
  if (min > 0 && sub < min) {
    return { effectiveSubtotal: min, minPriceApplied: true };
  }
  return { effectiveSubtotal: sub, minPriceApplied: false };
}

/**
 * Fully compute a single line item.
 * Returns updated areaM2, lineSubtotal, effectiveSubtotal, minPriceApplied.
 */
export function computeLine(
  line: Pick<
    QuoteLineItem,
    "pricingMethod" | "width" | "height" | "dimensionUnit" | "unitPrice" | "quantity" | "minPrice"
  >
): {
  areaM2: number;
  lineSubtotal: number;
  effectiveSubtotal: number;
  minPriceApplied: boolean;
} {
  const areaM2 =
    line.pricingMethod === "per_m2"
      ? computeLineArea(line.width, line.height, line.dimensionUnit)
      : 0;

  const lineSubtotal = computeLineSubtotal(
    line.pricingMethod,
    areaM2,
    line.unitPrice,
    line.quantity
  );

  const { effectiveSubtotal, minPriceApplied } = applyMinimumPrice(
    lineSubtotal,
    line.minPrice
  );

  return { areaM2, lineSubtotal, effectiveSubtotal, minPriceApplied };
}

// ─── Additional Charges ───

/**
 * Compute a single charge amount.
 *
 * @param config     - the charge configuration
 * @param totalAreaM2 - total area of all lines (for per_m2 charges)
 * @param totalItems  - total quantity across all lines (for per_item charges)
 */
export function computeChargeAmount(
  config: ChargeConfig,
  totalAreaM2: number,
  totalItems: number
): number {
  if (!config.enabled) return 0;

  const amount = safe(config.amount);
  switch (config.method) {
    case "included":
      return 0;
    case "fixed":
      return amount;
    case "per_m2":
      return amount * safe(totalAreaM2);
    case "per_item":
      return amount * safe(totalItems);
    case "manual":
      return amount;
    default:
      return 0;
  }
}

/**
 * Compute all additional charges from the charges config.
 */
export function computeAllCharges(
  charges: AdditionalCharges,
  totalAreaM2: number,
  totalItems: number
): ComputedCharges {
  const designFee = computeChargeAmount(charges.designFee, totalAreaM2, totalItems);
  const laborFee = computeChargeAmount(charges.laborFee, totalAreaM2, totalItems);
  const installationFee = computeChargeAmount(charges.installationFee, totalAreaM2, totalItems);
  const deliveryFee = computeChargeAmount(charges.deliveryFee, totalAreaM2, totalItems);
  const extraServicesTotal = charges.extraServices.reduce(
    (sum, svc) => sum + safe(svc.amount),
    0
  );

  return {
    designFee,
    laborFee,
    installationFee,
    deliveryFee,
    extraServicesTotal,
    totalCharges: designFee + laborFee + installationFee + deliveryFee + extraServicesTotal,
  };
}

// ─── Discount ───

/**
 * Compute the discount amount from a subtotal.
 */
export function computeDiscountAmount(
  subtotal: number,
  discount: DiscountConfig
): number {
  const sub = safe(subtotal);
  const val = safe(discount.value);
  if (val <= 0) return 0;

  if (discount.type === "percentage") {
    return Math.round(sub * (Math.min(val, 100) / 100));
  }
  // Fixed discount: cap at subtotal so we never go negative
  return Math.round(Math.min(val, sub));
}

// ─── Tax ───

/**
 * Compute tax amount on a taxable base.
 */
export function computeTaxAmount(
  taxableBase: number,
  tax: TaxConfig
): number {
  if (!tax.enabled) return 0;
  const rate = safe(tax.rate);
  if (rate <= 0) return 0;
  return Math.round(safe(taxableBase) * (rate / 100));
}

// ─── Helper Aliases ───
export const computeDiscount = computeDiscountAmount;
export const computeTax = computeTaxAmount;
export function computeCharges(
  lines: QuoteLineItem[],
  chargesConfig: AdditionalCharges
): ComputedCharges {
  const totalAreaM2 = lines.reduce(
    (sum, line) => sum + safe(line.areaM2) * safe(line.quantity),
    0
  );
  const totalItems = lines.reduce(
    (sum, line) => sum + safe(line.quantity),
    0
  );
  return computeAllCharges(chargesConfig, totalAreaM2, totalItems);
}

// ─── Full Quote Summary ───

/**
 * Compute the complete quote summary from lines, charges, discount, and tax.
 * This is the single source of truth for all totals.
 */
export function computeQuoteSummary(
  lines: QuoteLineItem[],
  chargesConfig: AdditionalCharges,
  discount: DiscountConfig,
  tax: TaxConfig
): QuoteSummary {
  // Step 1–3: Sum line effectiveSubtotals
  const linesSubtotal = Math.round(
    lines.reduce((sum, line) => sum + safe(line.effectiveSubtotal), 0)
  );

  // Aggregate totals for charge calculations
  const totalAreaM2 = lines.reduce(
    (sum, line) => sum + safe(line.areaM2) * safe(line.quantity),
    0
  );
  const totalItems = lines.reduce(
    (sum, line) => sum + safe(line.quantity),
    0
  );

  // Step 4: Calculate charges
  const charges = computeAllCharges(chargesConfig, totalAreaM2, totalItems);

  // Step 5: Subtotal before discount
  const subtotalBeforeDiscount = Math.round(linesSubtotal + charges.totalCharges);

  // Step 6: Apply discount
  const discountAmount = computeDiscountAmount(subtotalBeforeDiscount, discount);
  const subtotalAfterDiscount = Math.max(0, subtotalBeforeDiscount - discountAmount);

  // Step 7: Calculate tax
  const taxAmount = computeTaxAmount(subtotalAfterDiscount, tax);

  // Step 8: Final total
  const total = Math.round(subtotalAfterDiscount + taxAmount);

  return {
    linesSubtotal,
    charges,
    subtotalBeforeDiscount,
    discountAmount,
    subtotalAfterDiscount,
    taxAmount,
    total,
  };
}
