/**
 * Indie Sign — Document Numbering & Workflow Unit Tests
 *
 * Verifies Prompt 05 requirements:
 * 1. Date-based sequences (QT, INV, REC)
 * 2. Separate sequences per document type and date
 * 3. Validation of manually entered numbers
 * 4. Lao date formatting
 * 5. Validity date calculation (15 days for Quotation)
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  formatDateKey,
  formatDateISO,
  formatDateLao,
  calculateValidityDate,
  generateNextDocumentNumber,
  peekNextDocumentNumber,
  validateDocumentNumber,
  commitDocumentNumber,
  resetSequenceStorage,
} from "@/lib/documentNumbering";

describe("Document Numbering and Dates", () => {
  beforeEach(() => {
    resetSequenceStorage();
  });

  const fixedDate = new Date("2026-10-18T12:00:00Z");

  it("formats date keys and ISO strings correctly", () => {
    expect(formatDateKey(fixedDate)).toBe("20261018");
    expect(formatDateISO(fixedDate)).toBe("2026-10-18");
  });

  it("generates correct prefix and initial sequence for Quotation (QT)", () => {
    const num = generateNextDocumentNumber("quotation", fixedDate);
    expect(num).toBe("QT-20261018-001");
  });

  it("generates correct prefix and initial sequence for Invoice (INV)", () => {
    const num = generateNextDocumentNumber("invoice", fixedDate);
    expect(num).toBe("INV-20261018-001");
  });

  it("generates correct prefix and initial sequence for Receipt (REC)", () => {
    const num = generateNextDocumentNumber("receipt", fixedDate);
    expect(num).toBe("REC-20261018-001");
  });

  it("maintains separate sequences for each document type", () => {
    const q1 = generateNextDocumentNumber("quotation", fixedDate);
    const q2 = generateNextDocumentNumber("quotation", fixedDate);
    const inv1 = generateNextDocumentNumber("invoice", fixedDate);
    const rec1 = generateNextDocumentNumber("receipt", fixedDate);

    expect(q1).toBe("QT-20261018-001");
    expect(q2).toBe("QT-20261018-002");
    expect(inv1).toBe("INV-20261018-001");
    expect(rec1).toBe("REC-20261018-001");
  });

  it("peeks without incrementing the sequence counter", () => {
    const peek1 = peekNextDocumentNumber("quotation", fixedDate);
    const peek2 = peekNextDocumentNumber("quotation", fixedDate);
    expect(peek1).toBe("QT-20261018-001");
    expect(peek2).toBe("QT-20261018-001");

    // After actual generation
    const actual = generateNextDocumentNumber("quotation", fixedDate);
    expect(actual).toBe("QT-20261018-001");

    const peekAfter = peekNextDocumentNumber("quotation", fixedDate);
    expect(peekAfter).toBe("QT-20261018-002");
  });

  it("commits manual edits to the sequence counter", () => {
    commitDocumentNumber("quotation", "QT-20261018-050", fixedDate);
    const next = generateNextDocumentNumber("quotation", fixedDate);
    expect(next).toBe("QT-20261018-051");
  });

  it("validates document numbers strictly", () => {
    expect(validateDocumentNumber("QT-20261018-001").isValid).toBe(true);
    expect(validateDocumentNumber("INV-2026/001").isValid).toBe(true);
    expect(validateDocumentNumber("").isValid).toBe(false);
    expect(validateDocumentNumber("   ").isValid).toBe(false);
    expect(validateDocumentNumber("A").isValid).toBe(false); // too short
    expect(validateDocumentNumber("QT 2026 001").isValid).toBe(false); // spaces not allowed
    expect(validateDocumentNumber("QT-2026<script>").isValid).toBe(false); // dangerous characters
  });

  it("calculates quotation validity date (15 days default)", () => {
    const validity = calculateValidityDate("2026-10-18", 15);
    expect(validity).toBe("2026-11-02");
  });

  it("formats dates nicely in Lao language", () => {
    const laoDate = formatDateLao("2026-10-18");
    expect(laoDate).toContain("18");
    expect(laoDate).toContain("ຕຸລາ");
    expect(laoDate).toContain("2026");
  });
});
