/**
 * Indie Sign — Quote History Type Definitions
 * Complete snapshot model for saved quotes.
 * Historical accuracy is a primary requirement:
 * changing product prices later must NOT affect saved records.
 */

import type {
  QuoteLineItem,
  AdditionalCharges,
  DiscountConfig,
  TaxConfig,
  QuoteSummary,
} from "@/types/calculator";
import type { DocumentType } from "@/types/documents";

// ─── Saved Quote History Record ───

/**
 * A full, immutable snapshot of a calculator state at save time.
 * All financial fields are stored verbatim and must never be
 * recalculated from current product prices when reopening.
 */
export interface QuoteHistoryRecord {
  /** Stable UUID for this record, never changes. */
  id: string;

  /** Internal notes (editable without touching financial snapshot). */
  internalNotes: string;

  // ─── Snapshot fields (immutable after creation) ───

  /** Deep copy of all line items at save time. */
  snapshotLines: QuoteLineItem[];

  /** Deep copy of all charge configs at save time. */
  snapshotCharges: AdditionalCharges;

  /** Discount config at save time. */
  snapshotDiscount: DiscountConfig;

  /** Tax config at save time. */
  snapshotTax: TaxConfig;

  /** Full computed summary at save time. */
  snapshotSummary: QuoteSummary;

  // ─── Document identifiers (set when document is generated) ───

  /**
   * Optional document number for each type, assigned when PDF was generated.
   * The same underlying snapshot can produce quotation + invoice + receipt.
   */
  documentNumbers: Partial<Record<DocumentType, string>>;

  // ─── Optional customer info (only if owner explicitly saved it) ───

  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerCompany?: string;

  // ─── Timestamps ───

  /** ISO string: when the record was first created. */
  createdAt: string;

  /** ISO string: when any field (even internalNotes) was last updated. */
  updatedAt: string;
}

// ─── Save Quote Dialog State ───

export type SaveQuoteMode = "new" | "update_existing";

export interface SaveQuoteDialogState {
  isOpen: boolean;
  /** Existing record ID if we detected this quote was already saved. */
  existingRecordId?: string;
}
