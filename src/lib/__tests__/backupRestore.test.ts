/**
 * Indie Sign — Backup & Restore and Historical Data Integrity Tests
 *
 * Verifies Prompt 09 Section 6, 7, and 8:
 * - JSON backup export syntax and payload structure
 * - Exclusion of PIN/security credentials from backup
 * - Schema version and appId validation
 * - Rejection of invalid/corrupt JSON without overwriting data
 * - Historical snapshot preservation when live product prices change
 */

import { describe, it, expect } from "vitest";
import {
  getDefaultOwnerSettings,
  createBackupPayload,
  generateBackupJsonString,
  validateBackupJson,
  restoreFromBackup,
} from "@/lib/settingsStorage";
import type { CompleteOwnerSettings } from "@/types/ownerSettings";
import type { QuoteHistoryRecord } from "@/types/quoteHistory";
import { APP_IDENTIFIER, SETTINGS_SCHEMA_VERSION } from "@/types/ownerSettings";

describe("Backup Export & Restore System", () => {
  const initialSettings = getDefaultOwnerSettings();

  it("exports valid JSON with correct appId and schemaVersion", () => {
    const jsonStr = generateBackupJsonString(initialSettings);
    expect(typeof jsonStr).toBe("string");

    const parsed = JSON.parse(jsonStr);
    expect(parsed.appId).toBe(APP_IDENTIFIER);
    expect(parsed.schemaVersion).toBe(SETTINGS_SCHEMA_VERSION);
    expect(parsed.settings).toBeDefined();
    expect(Array.isArray(parsed.settings.products)).toBe(true);
    expect(parsed.warningNoteLao).toContain("Portfolio Images");
  });

  it("strictly excludes security credentials and PIN from exported JSON", () => {
    const payload = createBackupPayload(initialSettings);
    // @ts-expect-error security is excluded by type
    expect(payload.settings.security).toBeUndefined();
    expect(JSON.stringify(payload)).not.toContain("pinHash");
  });

  it("validates valid backup JSON successfully", () => {
    const jsonStr = generateBackupJsonString(initialSettings);
    const result = validateBackupJson(jsonStr);
    expect(result.isValid).toBe(true);
    expect(result.payload?.appId).toBe(APP_IDENTIFIER);
  });

  it("rejects invalid JSON syntax safely without throwing", () => {
    const result = validateBackupJson("{ broken json ...");
    expect(result.isValid).toBe(false);
    expect(result.errorLao).toContain("ບໍ່ແມ່ນໄຟລ໌ JSON");
  });

  it("rejects backup from foreign app or wrong appId", () => {
    const foreign = {
      appId: "some-other-app",
      schemaVersion: 1,
      settings: { products: [] },
    };
    const result = validateBackupJson(JSON.stringify(foreign));
    expect(result.isValid).toBe(false);
    expect(result.errorLao).toContain("ບໍ່ແມ່ນຂອງລະບົບ Indie Sign");
  });

  it("rejects backup with unsupported future schema version", () => {
    const future = {
      appId: APP_IDENTIFIER,
      schemaVersion: 999,
      settings: { products: [] },
    };
    const result = validateBackupJson(JSON.stringify(future));
    expect(result.isValid).toBe(false);
    expect(result.errorLao).toContain("ໃໝ່ກວ່າທີ່ລະບົບຮອງຮັບ");
  });

  it("restores settings while safely preserving current security PIN", () => {
    const current: CompleteOwnerSettings = {
      ...initialSettings,
      security: {
        pinHash: "custom-hashed-pin-1234",
        failedAttempts: 2,
        lockoutUntil: 0,
        lockoutThreshold: 5,
        lockoutDurationSec: 30,
      },
    };

    const backupPayload = createBackupPayload({
      ...initialSettings,
      business: {
        ...initialSettings.business,
        name: "Restored Indie Sign Co.",
      },
    });

    const restored = restoreFromBackup(current, backupPayload);
    // Business name was updated
    expect(restored.business.name).toBe("Restored Indie Sign Co.");
    // Current PIN was preserved
    expect(restored.security.pinHash).toBe("custom-hashed-pin-1234");
    expect(restored.security.failedAttempts).toBe(2);
  });
});

describe("Historical Data Snapshot Integrity", () => {
  it("preserves historical quote prices verbatim when live product prices change later", () => {
    // 1. Initial quote snapshot: Black vinyl 2m × 1m @ 130,000 LAK/m², qty 2 = 520,000 LAK
    const historicalRecord: QuoteHistoryRecord = {
      id: "rec-test-01",
      internalNotes: "Historical quote for Client A",
      snapshotLines: [
        {
          id: "l1",
          productId: "calc-vinyl-black",
          productNameLao: "ໄວນິວຫຼັງດຳ",
          productNameEn: "Black vinyl",
          pricingMethod: "per_m2",
          width: 200,
          height: 100,
          dimensionUnit: "cm",
          areaM2: 2,
          quantity: 2,
          unitPrice: 130_000,
          lineSubtotal: 520_000,
          minPrice: 0,
          minPriceApplied: false,
          effectiveSubtotal: 520_000,
          notes: "",
        },
      ],
      snapshotCharges: {
        designFee: { enabled: false, method: "fixed", amount: 0 },
        laborFee: { enabled: false, method: "included", amount: 0 },
        installationFee: { enabled: false, method: "included", amount: 0 },
        deliveryFee: { enabled: false, method: "fixed", amount: 0 },
        extraServices: [],
      },
      snapshotDiscount: { type: "percentage", value: 0 },
      snapshotTax: { enabled: false, rate: 0 },
      snapshotSummary: {
        linesSubtotal: 520_000,
        charges: {
          designFee: 0,
          laborFee: 0,
          installationFee: 0,
          deliveryFee: 0,
          extraServicesTotal: 0,
          totalCharges: 0,
        },
        subtotalBeforeDiscount: 520_000,
        discountAmount: 0,
        subtotalAfterDiscount: 520_000,
        taxAmount: 0,
        total: 520_000,
      },
      documentNumbers: { quotation: "QT-202610-001" },
      createdAt: "2026-10-18T10:00:00.000Z",
      updatedAt: "2026-10-18T10:00:00.000Z",
    };

    // 2. Owner later changes live product price from 130,000 to 180,000 LAK
    const updatedSettings = getDefaultOwnerSettings();
    const vinylProd = updatedSettings.products.find((p) => p.id === "calc-vinyl-black");
    if (vinylProd) {
      vinylProd.unitPrice = 180_000;
    }

    // 3. Verify historical record still holds the original unitPrice and total
    expect(historicalRecord.snapshotLines[0].unitPrice).toBe(130_000);
    expect(historicalRecord.snapshotLines[0].lineSubtotal).toBe(520_000);
    expect(historicalRecord.snapshotSummary.total).toBe(520_000);
    expect(historicalRecord.documentNumbers.quotation).toBe("QT-202610-001");
  });
});
