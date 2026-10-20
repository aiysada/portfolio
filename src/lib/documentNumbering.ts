/**
 * Indie Sign — Document Numbering & Date Utilities
 *
 * Sequence format:
 *   Quotation: QT-YYYYMMDD-001
 *   Invoice:   INV-YYYYMMDD-001
 *   Receipt:   REC-YYYYMMDD-001
 *
 * Sequences are tracked separately per document type and local date in localStorage.
 * Client-side sequence state is local to the current browser.
 */

import type { DocumentType } from "@/types/documents";

const PREFIXES: Record<DocumentType, string> = {
  quotation: "QT",
  invoice: "INV",
  receipt: "REC",
};

const STORAGE_KEY_PREFIX = "indie_sign_seq_";

/**
 * Format a Date object to YYYYMMDD string using local time.
 */
export function formatDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

/**
 * Format a Date object to standard YYYY-MM-DD string.
 */
export function formatDateISO(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Format YYYY-MM-DD to friendly Lao display date (e.g. "18/10/2026" or "18 ຕຸລາ 2026").
 */
export function formatDateLao(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts;
  const laoMonths = [
    "ມັງກອນ",
    "ກຸມພາ",
    "ມີນາ",
    "ເມສາ",
    "ພຶດສະພາ",
    "ມິຖຸນາ",
    "ກໍລະກົດ",
    "ສິງຫາ",
    "ກັນຍາ",
    "ຕຸລາ",
    "ພະຈິກ",
    "ທັນວາ",
  ];
  const monthIdx = parseInt(m, 10) - 1;
  const monthName = laoMonths[monthIdx] || m;
  return `${parseInt(d, 10)} ${monthName} ${y}`;
}

/**
 * Calculate validity date from issue date (default 15 days for Quotation).
 */
export function calculateValidityDate(issueDateStr: string, days = 15): string {
  if (!issueDateStr) return "";
  const d = new Date(issueDateStr);
  if (isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + days);
  return formatDateISO(d);
}

const memoryStore = new Map<string, string>();

function getStorageItem(key: string): string | null {
  try {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem(key);
    }
  } catch {
    // Ignore
  }
  return memoryStore.get(key) || null;
}

function setStorageItem(key: string, value: string): void {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, value);
      return;
    }
  } catch {
    // Ignore
  }
  memoryStore.set(key, value);
}

/**
 * Clear memory store (useful for tests)
 */
export function resetSequenceStorage(): void {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  } catch {
    // Ignore
  }
  memoryStore.clear();
}

/**
 * Get current sequence number from storage for a given type and date key.
 */
function getStoredSequence(type: DocumentType, dateKey: string): number {
  const key = `${STORAGE_KEY_PREFIX}${type}_${dateKey}`;
  const stored = getStorageItem(key);
  return stored ? parseInt(stored, 10) || 0 : 0;
}

/**
 * Peek at the next document number without incrementing storage.
 */
export function peekNextDocumentNumber(
  type: DocumentType,
  date: Date = new Date()
): string {
  const dateKey = formatDateKey(date);
  const prefix = PREFIXES[type];
  const nextSeq = getStoredSequence(type, dateKey) + 1;
  const seqStr = String(nextSeq).padStart(3, "0");
  return `${prefix}-${dateKey}-${seqStr}`;
}

/**
 * Generate the next document number and increment the stored sequence.
 */
export function generateNextDocumentNumber(
  type: DocumentType,
  date: Date = new Date()
): string {
  const dateKey = formatDateKey(date);
  const prefix = PREFIXES[type];
  const nextSeq = getStoredSequence(type, dateKey) + 1;

  const key = `${STORAGE_KEY_PREFIX}${type}_${dateKey}`;
  setStorageItem(key, String(nextSeq));

  const seqStr = String(nextSeq).padStart(3, "0");
  return `${prefix}-${dateKey}-${seqStr}`;
}

/**
 * Commit a manually entered or edited document number if it ends in a numeric sequence.
 */
export function commitDocumentNumber(
  type: DocumentType,
  docNumber: string,
  date: Date = new Date()
): void {
  const dateKey = formatDateKey(date);
  const match = docNumber.match(/-(\d+)$/);
  if (match) {
    const seq = parseInt(match[1], 10);
    if (!isNaN(seq)) {
      const key = `${STORAGE_KEY_PREFIX}${type}_${dateKey}`;
      const current = getStoredSequence(type, dateKey);
      if (seq > current) {
        setStorageItem(key, String(seq));
      }
    }
  }
}

/**
 * Validate a document number format.
 */
export function validateDocumentNumber(docNumber: string): {
  isValid: boolean;
  error?: string;
} {
  const trimmed = docNumber.trim();
  if (!trimmed) {
    return { isValid: false, error: "ກະລຸນາໃສ່ເລກທີເອກະສານ" };
  }
  if (trimmed.length < 5 || trimmed.length > 30) {
    return { isValid: false, error: "ຄວາມຍາວເລກທີເອກະສານບໍ່ຖືກຕ້ອງ (5-30 ຕົວອັກສອນ)" };
  }
  // Check for safe characters: letters, numbers, hyphens, slashes
  if (!/^[A-Za-z0-9\-_/]+$/.test(trimmed)) {
    return {
      isValid: false,
      error: "ເລກທີເອກະສານສາມາດບັນຈຸພຽງຕົວອັກສອນ, ຕົວເລກ, ຂີດຕໍ່ (-) ຫຼື (/)",
    };
  }
  return { isValid: true };
}
