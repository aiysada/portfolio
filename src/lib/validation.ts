/**
 * Indie Sign — Calculator Validation Utilities
 */

import type { QuoteLineItem } from "@/types/calculator";

export interface LineValidation {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate a quote line item.
 * Returns validation status and Lao-language error messages.
 */
export function validateLine(line: QuoteLineItem): LineValidation {
  const errors: string[] = [];

  if (!line.productNameLao && !line.productNameEn) {
    errors.push("ກະລຸນາເລືອກສິນຄ້າ");
  }

  if (line.pricingMethod === "per_m2") {
    if (!isFinite(line.width) || line.width <= 0) {
      errors.push("ກະລຸນາໃສ່ຄວາມກວ້າງທີ່ຖືກຕ້ອງ");
    }
    if (!isFinite(line.height) || line.height <= 0) {
      errors.push("ກະລຸນາໃສ່ຄວາມສູງທີ່ຖືກຕ້ອງ");
    }
  }

  if (!isFinite(line.quantity) || line.quantity <= 0) {
    errors.push("ຈຳນວນຕ້ອງຫຼາຍກວ່າ 0");
  }

  if (line.pricingMethod !== "manual") {
    if (!isFinite(line.unitPrice) || line.unitPrice < 0) {
      errors.push("ລາຄາຕໍ່ໜ່ວຍບໍ່ຖືກຕ້ອງ");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check if a numeric input is a valid non-negative number.
 */
export function isValidNumber(value: number): boolean {
  return isFinite(value) && !isNaN(value) && value >= 0;
}

/**
 * Parse a string input to a safe number. Returns 0 for invalid inputs.
 */
export function parseNumericInput(value: string): number {
  if (!value || value.trim() === "") return 0;
  const parsed = parseFloat(value);
  if (!isFinite(parsed) || isNaN(parsed)) return 0;
  return parsed;
}
