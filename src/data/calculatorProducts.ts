/**
 * Indie Sign — Calculator Product Catalog
 *
 * Default products with pricing methods.
 * This data will later be editable in Owner Settings.
 */

import type { CalcProduct } from "@/types/calculator";

export const CALC_PRODUCTS: CalcProduct[] = [
  // ── Vinyl & Sticker ──
  {
    id: "calc-vinyl-black",
    nameLao: "ໄວນິວຫຼັງດຳ (Black-back Vinyl)",
    nameEn: "Black-back Vinyl Print",
    category: "vinyl",
    pricingMethod: "per_m2",
    unitPrice: 130_000,
    unit: "m²",
    minPrice: 0,
    popular: true,
  },
  {
    id: "calc-vinyl-white",
    nameLao: "ໄວນິວຫຼັງຂາວ (White-back Vinyl)",
    nameEn: "White-back Vinyl Print",
    category: "vinyl",
    pricingMethod: "per_m2",
    unitPrice: 120_000,
    unit: "m²",
    minPrice: 0,
    popular: true,
  },
  {
    id: "calc-sticker",
    nameLao: "ສະຕິກເກີພິມ (Sticker Printing)",
    nameEn: "Sticker Printing",
    category: "vinyl",
    pricingMethod: "per_m2",
    unitPrice: 250_000,
    unit: "m²",
    minPrice: 0,
    popular: true,
  },

  // ── Lightbox & LED ──
  {
    id: "calc-lightbox",
    nameLao: "ປ້າຍກ່ອງໄຟ LED (Lightbox)",
    nameEn: "LED Lightbox",
    category: "lightbox",
    pricingMethod: "per_m2",
    unitPrice: 650_000,
    unit: "m²",
    minPrice: 0,
    popular: true,
  },
  {
    id: "calc-neon-flex",
    nameLao: "ປ້າຍໄຟນີອອນ Neon Flex",
    nameEn: "Neon Flex Sign",
    category: "lightbox",
    pricingMethod: "per_item",
    unitPrice: 350_000,
    unit: "ອັນ",
    minPrice: 0,
  },

  // ── Acrylic & Letters ──
  {
    id: "calc-acrylic",
    nameLao: "ປ້າຍອະຄຣີລິກ (Acrylic Sign)",
    nameEn: "Acrylic Signboard",
    category: "acrylic",
    pricingMethod: "per_m2",
    unitPrice: 450_000,
    unit: "m²",
    minPrice: 0,
  },
  {
    id: "calc-3d-letter",
    nameLao: "ຕົວອັກສອນ 3D ສະແຕນເລດ",
    nameEn: "Stainless Steel 3D Letter",
    category: "acrylic",
    pricingMethod: "per_m2",
    unitPrice: 850_000,
    unit: "m²",
    minPrice: 0,
  },

  // ── Business Cards & Small Print ──
  {
    id: "calc-business-card",
    nameLao: "ນາມບັດ (Business Card)",
    nameEn: "Business Cards",
    category: "print",
    pricingMethod: "per_item",
    unitPrice: 500,
    unit: "ແຜ່ນ",
    minPrice: 50_000,
  },
  {
    id: "calc-flyer",
    nameLao: "ໃບປິວ / ແຜ່ນພັບ (Flyer)",
    nameEn: "Flyer / Brochure",
    category: "print",
    pricingMethod: "per_item",
    unitPrice: 1_500,
    unit: "ແຜ່ນ",
    minPrice: 30_000,
  },

  // ── Design Services ──
  {
    id: "calc-logo-design",
    nameLao: "ອອກແບບໂລໂກ້ (Logo Design)",
    nameEn: "Logo Design",
    category: "design",
    pricingMethod: "fixed",
    unitPrice: 500_000,
    unit: "ແບບ",
    minPrice: 0,
  },
  {
    id: "calc-signage-design",
    nameLao: "ອອກແບບປ້າຍ 2D / 3D Mockup",
    nameEn: "Signage Design & 3D Mockup",
    category: "design",
    pricingMethod: "fixed",
    unitPrice: 300_000,
    unit: "ແບບ",
    minPrice: 0,
  },

  // ── Custom ──
  {
    id: "calc-custom",
    nameLao: "ລາຍການກຳນົດເອງ (Custom Item)",
    nameEn: "Custom Item",
    category: "custom",
    pricingMethod: "manual",
    unitPrice: 0,
    unit: "ລາຍການ",
    minPrice: 0,
  },
];

/**
 * Lookup a product by ID. Returns undefined if not found.
 */
export function findCalcProduct(id: string): CalcProduct | undefined {
  return CALC_PRODUCTS.find((p) => p.id === id);
}

/**
 * Get unique category IDs from the product list.
 */
export function getProductCategories(): string[] {
  return [...new Set(CALC_PRODUCTS.map((p) => p.category))];
}

/**
 * Category display labels (Lao).
 */
export const CATEGORY_LABELS: Record<string, string> = {
  vinyl: "ໄວນິວ & ສະຕິກເກີ",
  lightbox: "ປ້າຍໄຟ & LED",
  acrylic: "ອະຄຣີລິກ & ຕົວອັກສອນ",
  print: "ງານພິມຂະໜາດນ້ອຍ",
  design: "ອອກແບບກຣາຟິກ",
  custom: "ລາຍການກຳນົດເອງ",
};
