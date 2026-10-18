/**
 * Indie Sign — Money Formatting Utility
 *
 * Centralized LAK currency formatter.
 * Internal values are always numeric; this module is for display only.
 */

/**
 * Format a numeric amount as Lao Kip with thousands separators.
 * Example: 130000 → "130,000 ກີບ"
 *
 * Returns "0 ກີບ" for NaN/Infinity/undefined.
 */
export function formatMoney(amount: number): string {
  if (!isFinite(amount) || isNaN(amount)) return "0 ກີບ";
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
  return `${formatted} ກີບ`;
}

/**
 * Format a number with thousands separators (no currency label).
 * Useful for displaying quantities, areas, etc.
 */
export function formatNumber(value: number, decimals = 2): string {
  if (!isFinite(value) || isNaN(value)) return "0";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format area in m² for display.
 */
export function formatAreaM2(areaM2: number): string {
  if (!isFinite(areaM2) || isNaN(areaM2)) return "0 m²";
  return `${areaM2.toFixed(4)} m²`;
}
