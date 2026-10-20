import { describe, it, expect } from "vitest";
import {
  PRODUCT_OPTIONS,
  VINYL_TYPES,
  VINYL_SURFACES_STANDARD,
  VINYL_SURFACES_KOREAN,
  STICKER_TYPES,
  CNC_MATERIALS,
  PLASTWOOD_THICKNESSES,
  METAL_FINISHES,
  BEACH_FLAG_TYPES,
  BEACH_FLAG_SIZES,
  BEACH_FLAG_BASES,
  PRINT_RESOLUTIONS,
  VINYL_FINISHING_OPTIONS,
  STICKER_FINISHING_OPTIONS,
} from "@/data/questionnaireData";

describe("Questionnaire Data Catalog", () => {
  it("contains all 4 primary product categories", () => {
    expect(PRODUCT_OPTIONS).toHaveLength(4);
    const ids = PRODUCT_OPTIONS.map((p) => p.id);
    expect(ids).toEqual(["vinyl", "sticker", "cnc", "beach_flag"]);
  });

  it("contains valid vinyl types and surface finishes", () => {
    expect(VINYL_TYPES).toHaveLength(2);
    expect(VINYL_SURFACES_STANDARD).toHaveLength(3);
    expect(VINYL_SURFACES_KOREAN).toHaveLength(2);

    const standardSurfaces = VINYL_SURFACES_STANDARD.map((s) => s.id);
    expect(standardSurfaces).toContain("white_back");
    expect(standardSurfaces).toContain("black_back");
    expect(standardSurfaces).toContain("translucent");
  });

  it("contains all 7 required sticker types", () => {
    expect(STICKER_TYPES).toHaveLength(7);
    const stickerIds = STICKER_TYPES.map((s) => s.id);
    expect(stickerIds).toEqual([
      "glossy_white",
      "matte_white",
      "clear",
      "frosted",
      "reflective",
      "translucent",
      "c2",
    ]);
  });

  it("contains all CNC materials including stainless steel and plastwood options", () => {
    expect(CNC_MATERIALS.length).toBeGreaterThanOrEqual(8);
    const cncIds = CNC_MATERIALS.map((m) => m.id);
    expect(cncIds).toContain("plastwood");
    expect(cncIds).toContain("acrylic");
    expect(cncIds).toContain("steel");
    expect(cncIds).toContain("stainless");
    expect(cncIds).toContain("zinc");
    expect(cncIds).toContain("metal_sheet");
    expect(cncIds).toContain("plate");
    expect(cncIds).toContain("wood");

    expect(PLASTWOOD_THICKNESSES).toHaveLength(5);
    expect(METAL_FINISHES).toHaveLength(2);
  });

  it("contains Beach Flag models, S-XL size specifications, and stand bases", () => {
    expect(BEACH_FLAG_TYPES).toHaveLength(3);
    const flagTypes = BEACH_FLAG_TYPES.map((f) => f.id);
    expect(flagTypes).toContain("wing");
    expect(flagTypes).toContain("teardrop");
    expect(flagTypes).toContain("feather");

    expect(BEACH_FLAG_SIZES).toHaveLength(4);
    expect(BEACH_FLAG_SIZES[0].size).toBe("S");
    expect(BEACH_FLAG_SIZES[1].size).toBe("M");
    expect(BEACH_FLAG_SIZES[2].size).toBe("L");
    expect(BEACH_FLAG_SIZES[3].size).toBe("XL");

    expect(BEACH_FLAG_BASES).toHaveLength(4);
  });

  it("contains print resolutions and finishing options", () => {
    expect(PRINT_RESOLUTIONS).toHaveLength(3);
    expect(VINYL_FINISHING_OPTIONS).toHaveLength(3);
    expect(STICKER_FINISHING_OPTIONS).toHaveLength(3);
  });
});
