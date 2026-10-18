/**
 * Indie Sign — Dimension Unit Conversion Utilities
 *
 * All internal calculations use meters.
 * Conversion factors:
 *   1 m  = 100 cm
 *   1 m  = 1,000 mm
 */

import type { DimensionUnit } from "@/types/calculator";

/** Conversion factors from each unit to meters */
const TO_METERS: Record<DimensionUnit, number> = {
  m: 1,
  cm: 0.01,
  mm: 0.001,
};

/**
 * Convert a dimension value to meters.
 */
export function toMeters(value: number, unit: DimensionUnit): number {
  if (!isFinite(value) || isNaN(value)) return 0;
  return value * TO_METERS[unit];
}

/**
 * Convert a dimension value from meters to the given unit.
 */
export function fromMeters(valueM: number, unit: DimensionUnit): number {
  if (!isFinite(valueM) || isNaN(valueM)) return 0;
  return valueM / TO_METERS[unit];
}

/**
 * Calculate area in m² from width and height in a given unit.
 * Returns 0 for invalid inputs (NaN, Infinity, negative).
 */
export function calculateAreaM2(
  width: number,
  height: number,
  unit: DimensionUnit
): number {
  const wM = toMeters(width, unit);
  const hM = toMeters(height, unit);
  if (wM < 0 || hM < 0) return 0;
  return wM * hM;
}

/**
 * Get the display label for a unit.
 */
export function unitLabel(unit: DimensionUnit): string {
  switch (unit) {
    case "mm":
      return "ມມ (mm)";
    case "cm":
      return "ຊມ (cm)";
    case "m":
      return "ແມັດ (m)";
  }
}

/**
 * Get the short display label for a unit.
 */
export function unitShortLabel(unit: DimensionUnit): string {
  switch (unit) {
    case "mm":
      return "mm";
    case "cm":
      return "cm";
    case "m":
      return "m";
  }
}
