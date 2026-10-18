/**
 * Format number into Lao Kip currency string (e.g. 500,000 ₭)
 */
export function formatLAK(amount: number): string {
  if (isNaN(amount)) return "0 ₭";
  const formatted = new Intl.NumberFormat("lo-LA", {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formatted} ₭`;
}

/**
 * Format general numbers with thousands separator
 */
export function formatNumber(value: number, decimals = 2): string {
  if (isNaN(value)) return "0";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format dimensions (e.g. 150 cm x 80 cm)
 */
export function formatDimension(widthCm: number, heightCm: number): string {
  return `${widthCm} × ${heightCm} ຊມ`;
}

/**
 * Calculate and format square meters from cm
 */
export function calculateAreaM2(widthCm: number, heightCm: number): number {
  return (widthCm * heightCm) / 10000;
}

/**
 * Format date in Lao locale
 */
export function formatDateLao(dateStringOrDate: string | Date): string {
  try {
    const date = typeof dateStringOrDate === "string" ? new Date(dateStringOrDate) : dateStringOrDate;
    return new Intl.DateTimeFormat("lo-LA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return String(dateStringOrDate);
  }
}
