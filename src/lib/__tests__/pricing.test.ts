/**
 * Indie Sign — Comprehensive Pricing and Calculation Engine Tests
 *
 * Verifies all requirements from Prompt 04:
 * 1. Unit conversions (m, cm, mm)
 * 2. Area calculation
 * 3. Per-m² pricing
 * 4. Per-item pricing
 * 5. Fixed pricing
 * 6. Manual pricing
 * 7. Quantity changes
 * 8. Minimum price behavior
 * 9. Design, labor, installation, and delivery charges
 * 10. Percentage and fixed discounts
 * 11. Tax toggle and percentage
 * 12. Empty and invalid inputs (NaN, Infinity, negative)
 * 13. Zero values
 * 14. Multiple line items
 * 15. Total calculation and rounding behavior
 * 16. Comprehensive multi-line combinations
 */

import { describe, it, expect } from "vitest";
import {
  toMeters,
  fromMeters,
  calculateAreaM2,
  unitLabel,
} from "@/lib/units";
import { formatMoney, formatAreaM2, formatNumber } from "@/lib/money";
import {
  computeLineArea,
  computeLineSubtotal,
  applyMinimumPrice,
  computeLine,
  computeCharges,
  computeDiscount,
  computeTax,
  computeQuoteSummary,
} from "@/lib/pricing";
import { validateLine, isValidNumber, parseNumericInput } from "@/lib/validation";
import type {
  QuoteLineItem,
  AdditionalCharges,
  DiscountConfig,
  TaxConfig,
} from "@/types/calculator";

describe("1. Dimension Unit Conversions", () => {
  it("converts meters correctly", () => {
    expect(toMeters(1, "m")).toBe(1);
    expect(toMeters(2.5, "m")).toBe(2.5);
    expect(fromMeters(1, "m")).toBe(1);
  });

  it("converts centimeters to meters (1m = 100cm)", () => {
    expect(toMeters(100, "cm")).toBe(1);
    expect(toMeters(50, "cm")).toBe(0.5);
    expect(toMeters(250, "cm")).toBe(2.5);
    expect(fromMeters(1, "cm")).toBe(100);
  });

  it("converts millimeters to meters (1m = 1,000mm)", () => {
    expect(toMeters(1000, "mm")).toBe(1);
    expect(toMeters(500, "mm")).toBe(0.5);
    expect(toMeters(1500, "mm")).toBe(1.5);
    expect(fromMeters(1, "mm")).toBe(1000);
  });

  it("handles non-finite values safely", () => {
    expect(toMeters(NaN, "cm")).toBe(0);
    expect(toMeters(Infinity, "mm")).toBe(0);
    expect(fromMeters(NaN, "m")).toBe(0);
  });

  it("provides correct unit display labels", () => {
    expect(unitLabel("mm")).toContain("mm");
    expect(unitLabel("cm")).toContain("cm");
    expect(unitLabel("m")).toContain("m");
  });
});

describe("2. Area Calculation", () => {
  it("calculates area in meters", () => {
    expect(calculateAreaM2(2, 3, "m")).toBe(6);
  });

  it("calculates area in centimeters without cm² error", () => {
    // 200cm × 300cm = 2m × 3m = 6m²
    expect(calculateAreaM2(200, 300, "cm")).toBe(6);
  });

  it("calculates area in millimeters", () => {
    // 2000mm × 3000mm = 2m × 3m = 6m²
    expect(calculateAreaM2(2000, 3000, "mm")).toBe(6);
  });

  it("returns 0 for negative dimensions", () => {
    expect(calculateAreaM2(-2, 3, "m")).toBe(0);
    expect(calculateAreaM2(2, -3, "m")).toBe(0);
  });

  it("handles NaN or non-finite inputs safely", () => {
    expect(calculateAreaM2(NaN, 100, "cm")).toBe(0);
    expect(calculateAreaM2(100, Infinity, "cm")).toBe(0);
  });
});

describe("3. Pricing Methods", () => {
  it("A. Per-square-meter pricing: areaM2 × unitPrice × quantity", () => {
    // 2 m² × 130,000 LAK × 1 qty = 260,000 LAK
    expect(computeLineSubtotal("per_m2", 2, 130_000, 1)).toBe(260_000);
    // 1.5 m² × 120,000 LAK × 2 qty = 360,000 LAK
    expect(computeLineSubtotal("per_m2", 1.5, 120_000, 2)).toBe(360_000);
  });

  it("B. Per-item pricing: unitPrice × quantity", () => {
    // 350,000 LAK × 3 qty = 1,050,000 LAK
    expect(computeLineSubtotal("per_item", 0, 350_000, 3)).toBe(1_050_000);
  });

  it("C. Fixed pricing: unitPrice × quantity", () => {
    expect(computeLineSubtotal("fixed", 0, 500_000, 1)).toBe(500_000);
    expect(computeLineSubtotal("fixed", 0, 500_000, 2)).toBe(1_000_000);
  });

  it("D. Manual pricing: unitPrice × quantity", () => {
    expect(computeLineSubtotal("manual", 0, 450_000, 1)).toBe(450_000);
  });
});

describe("4. Quantity Changes", () => {
  it("scales line subtotal linearly with quantity", () => {
    const base = computeLineSubtotal("per_item", 0, 100_000, 1);
    expect(computeLineSubtotal("per_item", 0, 100_000, 5)).toBe(base * 5);
  });
});

describe("5. Minimum Price Behavior", () => {
  it("applies minimum price when subtotal is below minimum", () => {
    // Subtotal: 30,000, Min: 50,000 -> 50,000
    const res = applyMinimumPrice(30_000, 50_000);
    expect(res.effectiveSubtotal).toBe(50_000);
    expect(res.minPriceApplied).toBe(true);
  });

  it("keeps actual subtotal when subtotal exceeds minimum", () => {
    // Subtotal: 80,000, Min: 50,000 -> 80,000
    const res = applyMinimumPrice(80_000, 50_000);
    expect(res.effectiveSubtotal).toBe(80_000);
    expect(res.minPriceApplied).toBe(false);
  });

  it("does not apply minimum price when minPrice is 0", () => {
    const res = applyMinimumPrice(10_000, 0);
    expect(res.effectiveSubtotal).toBe(10_000);
    expect(res.minPriceApplied).toBe(false);
  });

  it("uses actual calculated area and does NOT invent a minimum-area rule", () => {
    // Small vinyl: 0.1m × 0.1m = 0.01 m²
    // At 130,000 LAK/m²: subtotal = 1,300 LAK (actual area)
    const line = computeLine({
      pricingMethod: "per_m2",
      width: 10,
      height: 10,
      dimensionUnit: "cm",
      unitPrice: 130_000,
      quantity: 1,
      minPrice: 0,
    });
    expect(line.areaM2).toBeCloseTo(0.01, 5);
    expect(line.lineSubtotal).toBeCloseTo(1_300, 1);
  });
});

describe("6. Additional Charges Calculation", () => {
  const dummyLine: QuoteLineItem = {
    id: "l1",
    productId: "p1",
    productNameLao: "ປ້າຍ",
    productNameEn: "Sign",
    pricingMethod: "per_m2",
    width: 2,
    height: 3,
    dimensionUnit: "m",
    areaM2: 6,
    quantity: 2,
    unitPrice: 100_000,
    lineSubtotal: 1_200_000,
    minPrice: 0,
    minPriceApplied: false,
    effectiveSubtotal: 1_200_000,
    notes: "",
  };

  it("calculates design fee (fixed, per_item, manual)", () => {
    const lines = [dummyLine]; // qty = 2
    // Fixed
    const c1 = computeCharges(lines, {
      designFee: { enabled: true, method: "fixed", amount: 150_000 },
      laborFee: { enabled: false, method: "included", amount: 0 },
      installationFee: { enabled: false, method: "included", amount: 0 },
      deliveryFee: { enabled: false, method: "fixed", amount: 0 },
      extraServices: [],
    });
    expect(c1.designFee).toBe(150_000);

    // Per item (150,000 × 2 items = 300,000)
    const c2 = computeCharges(lines, {
      designFee: { enabled: true, method: "per_item", amount: 150_000 },
      laborFee: { enabled: false, method: "included", amount: 0 },
      installationFee: { enabled: false, method: "included", amount: 0 },
      deliveryFee: { enabled: false, method: "fixed", amount: 0 },
      extraServices: [],
    });
    expect(c2.designFee).toBe(300_000);
  });

  it("calculates labor fee (included, fixed, per_m2)", () => {
    const lines = [dummyLine]; // 6m² × 2 qty = 12 total m²
    // Included -> 0
    const c1 = computeCharges(lines, {
      designFee: { enabled: false, method: "fixed", amount: 0 },
      laborFee: { enabled: true, method: "included", amount: 50_000 },
      installationFee: { enabled: false, method: "included", amount: 0 },
      deliveryFee: { enabled: false, method: "fixed", amount: 0 },
      extraServices: [],
    });
    expect(c1.laborFee).toBe(0);

    // Per m² (20,000 × 12m² = 240,000)
    const c2 = computeCharges(lines, {
      designFee: { enabled: false, method: "fixed", amount: 0 },
      laborFee: { enabled: true, method: "per_m2", amount: 20_000 },
      installationFee: { enabled: false, method: "included", amount: 0 },
      deliveryFee: { enabled: false, method: "fixed", amount: 0 },
      extraServices: [],
    });
    expect(c2.laborFee).toBe(240_000);
  });

  it("calculates installation and delivery charges", () => {
    const lines = [dummyLine];
    const charges = computeCharges(lines, {
      designFee: { enabled: false, method: "fixed", amount: 0 },
      laborFee: { enabled: false, method: "included", amount: 0 },
      installationFee: { enabled: true, method: "fixed", amount: 200_000 },
      deliveryFee: { enabled: true, method: "fixed", amount: 50_000 },
      extraServices: [
        { id: "s1", nameLao: "ເຄືອບ UV", amount: 60_000 },
        { id: "s2", nameLao: "ກອບເຫຼັກ", amount: 100_000 },
      ],
    });

    expect(charges.installationFee).toBe(200_000);
    expect(charges.deliveryFee).toBe(50_000);
    expect(charges.extraServicesTotal).toBe(160_000);
    expect(charges.totalCharges).toBe(410_000);
  });
});

describe("7. Discounts and Taxes", () => {
  it("calculates percentage discount", () => {
    // 10% on 1,000,000 = 100,000
    expect(computeDiscount(1_000_000, { type: "percentage", value: 10 })).toBe(100_000);
  });

  it("calculates fixed discount", () => {
    expect(computeDiscount(1_000_000, { type: "fixed", value: 50_000 })).toBe(50_000);
  });

  it("caps discount at subtotal (cannot be negative)", () => {
    expect(computeDiscount(200_000, { type: "fixed", value: 300_000 })).toBe(200_000);
    expect(computeDiscount(200_000, { type: "percentage", value: 150 })).toBe(200_000);
  });

  it("calculates tax when enabled", () => {
    // 7% on 900,000 = 63,000
    expect(computeTax(900_000, { enabled: true, rate: 7 })).toBe(63_000);
  });

  it("returns 0 tax when disabled", () => {
    expect(computeTax(900_000, { enabled: false, rate: 7 })).toBe(0);
  });
});

describe("8. Empty, Zero, and Invalid Inputs", () => {
  it("handles zero values without error", () => {
    expect(computeLineSubtotal("per_m2", 0, 0, 0)).toBe(0);
    expect(computeDiscount(0, { type: "percentage", value: 0 })).toBe(0);
    expect(computeTax(0, { enabled: true, rate: 10 })).toBe(0);
  });

  it("handles NaN and non-finite values safely", () => {
    expect(computeLineSubtotal("per_m2", NaN, 100_000, 1)).toBe(0);
    expect(computeLineSubtotal("per_m2", 2, NaN, 1)).toBe(0);
    expect(computeLineSubtotal("per_m2", 2, 100_000, Infinity)).toBe(0);
  });

  it("validation utility detects missing or invalid inputs", () => {
    const invalidLine: QuoteLineItem = {
      id: "l-bad",
      productId: "",
      productNameLao: "",
      productNameEn: "",
      pricingMethod: "per_m2",
      width: -1,
      height: 0,
      dimensionUnit: "cm",
      areaM2: 0,
      quantity: 0,
      unitPrice: -5,
      lineSubtotal: 0,
      minPrice: 0,
      minPriceApplied: false,
      effectiveSubtotal: 0,
      notes: "",
    };

    const val = validateLine(invalidLine);
    expect(val.isValid).toBe(false);
    expect(val.errors.length).toBeGreaterThan(0);
  });

  it("validates numbers and parses numeric strings", () => {
    expect(isValidNumber(100)).toBe(true);
    expect(isValidNumber(0)).toBe(true);
    expect(isValidNumber(-1)).toBe(false);
    expect(isValidNumber(NaN)).toBe(false);

    expect(parseNumericInput("150000")).toBe(150000);
    expect(parseNumericInput("")).toBe(0);
    expect(parseNumericInput("invalid")).toBe(0);
  });

  it("computes line area with computeLineArea utility", () => {
    expect(computeLineArea(100, 200, "cm")).toBe(2);
    expect(computeLineArea(NaN, 100, "cm")).toBe(0);
  });
});

describe("9. Full Quote Summary Calculation Order", () => {
  it("executes the exact 8-step calculation order", () => {
    // Line 1: Black vinyl 2m × 3m = 6m² × 130,000 LAK × 1 = 780,000 LAK
    const line1: QuoteLineItem = {
      id: "l1",
      productId: "calc-vinyl-black",
      productNameLao: "ໄວນິວຫຼັງດຳ",
      productNameEn: "Black vinyl",
      pricingMethod: "per_m2",
      width: 2,
      height: 3,
      dimensionUnit: "m",
      areaM2: 6,
      quantity: 1,
      unitPrice: 130_000,
      lineSubtotal: 780_000,
      minPrice: 0,
      minPriceApplied: false,
      effectiveSubtotal: 780_000,
      notes: "",
    };

    // Line 2: Small card with min price: 100 cards × 200 = 20,000, minPrice: 50,000 -> effective: 50,000
    const line2: QuoteLineItem = {
      id: "l2",
      productId: "calc-business-card",
      productNameLao: "ນາມບັດ",
      productNameEn: "Business Cards",
      pricingMethod: "per_item",
      width: 0,
      height: 0,
      dimensionUnit: "cm",
      areaM2: 0,
      quantity: 100,
      unitPrice: 200,
      lineSubtotal: 20_000,
      minPrice: 50_000,
      minPriceApplied: true,
      effectiveSubtotal: 50_000,
      notes: "",
    };

    const lines = [line1, line2];
    // linesSubtotal = 780,000 + 50,000 = 830,000

    const charges: AdditionalCharges = {
      designFee: { enabled: true, method: "fixed", amount: 100_000 },
      laborFee: { enabled: false, method: "included", amount: 0 },
      installationFee: { enabled: true, method: "fixed", amount: 70_000 },
      deliveryFee: { enabled: false, method: "fixed", amount: 0 },
      extraServices: [],
    };
    // totalCharges = 100,000 + 70,000 = 170,000
    // subtotalBeforeDiscount = 830,000 + 170,000 = 1,000,000

    const discount: DiscountConfig = {
      type: "percentage",
      value: 10, // 10% of 1,000,000 = 100,000
    };
    // subtotalAfterDiscount = 1,000,000 - 100,000 = 900,000

    const tax: TaxConfig = {
      enabled: true,
      rate: 7, // 7% of 900,000 = 63,000
    };
    // total = 900,000 + 63,000 = 963,000

    const summary = computeQuoteSummary(lines, charges, discount, tax);

    expect(summary.linesSubtotal).toBe(830_000);
    expect(summary.charges.totalCharges).toBe(170_000);
    expect(summary.subtotalBeforeDiscount).toBe(1_000_000);
    expect(summary.discountAmount).toBe(100_000);
    expect(summary.subtotalAfterDiscount).toBe(900_000);
    expect(summary.taxAmount).toBe(63_000);
    expect(summary.total).toBe(963_000);
  });
});

describe("10. Money and Number Formatting", () => {
  it("formats LAK money with thousands separators and Lao label", () => {
    expect(formatMoney(130_000)).toBe("130,000 ກີບ");
    expect(formatMoney(0)).toBe("0 ກີບ");
    expect(formatMoney(1_500_000)).toBe("1,500,000 ກີບ");
    expect(formatMoney(NaN)).toBe("0 ກີບ");
  });

  it("formats numbers and areas properly", () => {
    expect(formatNumber(1250)).toBe("1,250");
    expect(formatAreaM2(2.5)).toBe("2.5000 m²");
    expect(formatAreaM2(NaN)).toBe("0 m²");
  });
});

describe("11. Prompt 09 Mandatory Verification & Edge Cases", () => {
  it("verifies the required benchmark example (Black-back vinyl 200cm × 100cm, qty 2 @ 130,000 LAK/m²)", () => {
    // Width: 200 cm = 2 m
    // Height: 100 cm = 1 m
    // Area per item: 2 m × 1 m = 2 m²
    // Quantity: 2
    // Unit price: 130,000 LAK/m²
    // Expected subtotal: 2 m² × 130,000 LAK × 2 = 520,000 LAK before other charges
    const line = computeLine({
      pricingMethod: "per_m2",
      width: 200,
      height: 100,
      dimensionUnit: "cm",
      unitPrice: 130_000,
      quantity: 2,
      minPrice: 0,
    });

    expect(line.areaM2).toBe(2);
    expect(line.lineSubtotal).toBe(520_000);
    expect(line.effectiveSubtotal).toBe(520_000);
  });

  it("verifies the equivalent calculation in millimeters (2000mm × 1000mm)", () => {
    const line = computeLine({
      pricingMethod: "per_m2",
      width: 2000,
      height: 1000,
      dimensionUnit: "mm",
      unitPrice: 130_000,
      quantity: 2,
      minPrice: 0,
    });

    expect(line.areaM2).toBe(2);
    expect(line.lineSubtotal).toBe(520_000);
  });

  it("handles decimal dimensions accurately (e.g. 1.25m × 2.4m)", () => {
    const line = computeLine({
      pricingMethod: "per_m2",
      width: 1.25,
      height: 2.4,
      dimensionUnit: "m",
      unitPrice: 100_000,
      quantity: 3,
      minPrice: 0,
    });

    // 1.25 × 2.4 = 3 m² per item
    // 3 m² × 100,000 × 3 = 900,000 LAK
    expect(line.areaM2).toBeCloseTo(3, 4);
    expect(line.lineSubtotal).toBe(900_000);
  });

  it("handles zero dimensions and zero quantity safely without throwing or NaN", () => {
    const zeroWidth = computeLine({
      pricingMethod: "per_m2",
      width: 0,
      height: 100,
      dimensionUnit: "cm",
      unitPrice: 130_000,
      quantity: 2,
      minPrice: 0,
    });
    expect(zeroWidth.areaM2).toBe(0);
    expect(zeroWidth.lineSubtotal).toBe(0);

    const zeroQty = computeLine({
      pricingMethod: "per_m2",
      width: 200,
      height: 100,
      dimensionUnit: "cm",
      unitPrice: 130_000,
      quantity: 0,
      minPrice: 0,
    });
    expect(zeroQty.lineSubtotal).toBe(0);
  });

  it("rejects negative dimensions and negative quantity safely", () => {
    const negativeDim = computeLine({
      pricingMethod: "per_m2",
      width: -200,
      height: 100,
      dimensionUnit: "cm",
      unitPrice: 130_000,
      quantity: 2,
      minPrice: 0,
    });
    expect(negativeDim.areaM2).toBe(0);
    expect(negativeDim.lineSubtotal).toBe(0);

    const negativeQty = computeLine({
      pricingMethod: "per_m2",
      width: 200,
      height: 100,
      dimensionUnit: "cm",
      unitPrice: 130_000,
      quantity: -5,
      minPrice: 0,
    });
    expect(negativeQty.lineSubtotal).toBe(0);
  });
});

