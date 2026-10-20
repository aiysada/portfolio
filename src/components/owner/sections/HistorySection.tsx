/**
 * Indie Sign — Quote History Section (Owner Panel)
 * Full-featured history management: list, search, filter, sort,
 * detail view, PDF regeneration, delete with confirmation.
 * All financial data comes from immutable snapshots only.
 */

import React, { useState, useMemo, useRef, useCallback } from "react";
import {
  Search,
  X,
  ChevronLeft,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  FileText,
  Receipt,
  FileCheck,
  Printer,
  Download,
  Info,
  SortAsc,
  SortDesc,
  CalendarDays,
  RefreshCw,
} from "lucide-react";
import { useOwnerSettings } from "@/context/OwnerSettingsContext";
import type { QuoteHistoryRecord } from "@/types/quoteHistory";
import type { DocumentType } from "@/types/documents";
import { formatLAK } from "@/lib/formatters";
import { formatDateLao } from "@/lib/documentNumbering";
import { generateDocumentPdf, printDocumentElement } from "@/lib/pdfGenerator";
import { QuotationDocument } from "@/components/documents/QuotationDocument";
import { InvoiceDocument } from "@/components/documents/InvoiceDocument";
import { ReceiptDocument } from "@/components/documents/ReceiptDocument";
import { DEFAULT_BUSINESS_INFO } from "@/data/businessInfo";
import type { DocumentData } from "@/types/documents";
import { Button } from "@/components/ui/button";

// ─── Utilities ───────────────────────────────────────────────

function buildDocumentData(
  record: QuoteHistoryRecord,
  docType: DocumentType,
  businessInfo?: typeof DEFAULT_BUSINESS_INFO
): DocumentData {
  const s = record.snapshotSummary;
  return {
    type: docType,
    number: record.documentNumbers[docType] ?? `HIST-${record.id.slice(0, 8)}`,
    issueDate: record.createdAt.slice(0, 10),
    validUntilDate: docType === "quotation"
      ? new Date(new Date(record.createdAt).getTime() + 15 * 86400000).toISOString().slice(0, 10)
      : undefined,
    customer: {
      name: record.customerName ?? "",
      phone: record.customerPhone ?? "",
      address: record.customerAddress,
      company: record.customerCompany,
    },
    business: businessInfo || DEFAULT_BUSINESS_INFO,
    items: record.snapshotLines.map((l) => ({
      id: l.id,
      productNameLao: l.productNameLao,
      productNameEn: l.productNameEn,
      pricingMethod: l.pricingMethod,
      width: l.width,
      height: l.height,
      dimensionUnit: l.dimensionUnit,
      areaM2: l.areaM2,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
      lineSubtotal: l.lineSubtotal,
      effectiveSubtotal: l.effectiveSubtotal,
      minPriceApplied: l.minPriceApplied,
      minPrice: l.minPrice,
      notes: l.notes,
    })),
    charges: {
      designFee: s.charges.designFee,
      laborFee: s.charges.laborFee,
      installationFee: s.charges.installationFee,
      deliveryFee: s.charges.deliveryFee,
      extraServices: record.snapshotCharges.extraServices,
      extraServicesTotal: s.charges.extraServicesTotal,
      totalCharges: s.charges.totalCharges,
    },
    linesSubtotal: s.linesSubtotal,
    totalCharges: s.charges.totalCharges,
    subtotalBeforeDiscount: s.subtotalBeforeDiscount,
    discount: record.snapshotDiscount,
    discountAmount: s.discountAmount,
    subtotalAfterDiscount: s.subtotalAfterDiscount,
    tax: record.snapshotTax,
    taxAmount: s.taxAmount,
    total: s.total,
    notes: record.internalNotes,
    terms: [],
  };
}

function getItemSummary(record: QuoteHistoryRecord): string {
  const names = record.snapshotLines.slice(0, 2).map((l) => l.productNameLao);
  const extra = record.snapshotLines.length > 2 ? ` +${record.snapshotLines.length - 2}` : "";
  return names.join(", ") + extra;
}

type SortKey = "newest" | "oldest" | "total_asc" | "total_desc";

// ─── Main Component ───────────────────────────────────────────

export const HistorySection: React.FC = () => {
  const { settings, getQuoteHistory, deleteQuoteRecord, updateQuoteRecord } = useOwnerSettings();
  const allRecords = getQuoteHistory();

  // ─── View State ───
  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedRecord, setSelectedRecord] = useState<QuoteHistoryRecord | null>(null);
  const [pdfDocType, setPdfDocType] = useState<DocumentType>("quotation");
  const printRef = useRef<HTMLDivElement>(null);

  // ─── Search & Filter ───
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("newest");

  // ─── UI State ───
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editNotesId, setEditNotesId] = useState<string | null>(null);
  const [editNotesValue, setEditNotesValue] = useState("");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // ─── Page ───
  const PAGE_SIZE = 20;
  const [page, setPage] = useState(1);

  // ─── Filtered & Sorted Records ───
  const filteredRecords = useMemo(() => {
    let result = [...allRecords];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((r) => {
        const docNums = Object.values(r.documentNumbers).join(" ").toLowerCase();
        const items = r.snapshotLines.map((l) => l.productNameLao + " " + l.productNameEn).join(" ").toLowerCase();
        const customer = (r.customerName ?? "").toLowerCase();
        return docNums.includes(q) || items.includes(q) || customer.includes(q);
      });
    }

    // Date range
    if (dateFrom) {
      result = result.filter((r) => r.createdAt.slice(0, 10) >= dateFrom);
    }
    if (dateTo) {
      result = result.filter((r) => r.createdAt.slice(0, 10) <= dateTo);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortKey) {
        case "newest": return b.createdAt.localeCompare(a.createdAt);
        case "oldest": return a.createdAt.localeCompare(b.createdAt);
        case "total_desc": return b.snapshotSummary.total - a.snapshotSummary.total;
        case "total_asc": return a.snapshotSummary.total - b.snapshotSummary.total;
      }
    });

    return result;
  }, [allRecords, searchQuery, dateFrom, dateTo, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const paginatedRecords = filteredRecords.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearSearch = () => {
    setSearchQuery("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  // ─── Detail View ───
  const openDetail = (record: QuoteHistoryRecord) => {
    setSelectedRecord(record);
    setView("detail");
    setSuccessMsg("");
    setErrorMsg("");
  };

  const backToList = () => {
    setView("list");
    setSelectedRecord(null);
    setSuccessMsg("");
    setErrorMsg("");
  };

  // ─── Delete ───
  const handleDelete = (id: string) => {
    const result = deleteQuoteRecord(id);
    if (result.success) {
      setDeleteConfirmId(null);
      if (view === "detail") backToList();
      setSuccessMsg("ລົບໃບປະເມີນ ສຳເລັດ!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      setErrorMsg(result.errorLao ?? "ເກີດຂໍ້ຜິດພາດ");
    }
  };

  // ─── Edit Notes ───
  const startEditNotes = (record: QuoteHistoryRecord) => {
    setEditNotesId(record.id);
    setEditNotesValue(record.internalNotes);
  };

  const saveNotes = (id: string) => {
    const result = updateQuoteRecord(id, { internalNotes: editNotesValue });
    if (result.success) {
      setEditNotesId(null);
      setSuccessMsg("ອັບເດດໝາຍເຫດ ສຳເລັດ!");
      setTimeout(() => setSuccessMsg(""), 2500);
      // Refresh selectedRecord if in detail view
      if (selectedRecord?.id === id) {
        setSelectedRecord((prev) => prev ? { ...prev, internalNotes: editNotesValue, updatedAt: new Date().toISOString() } : prev);
      }
    } else {
      setErrorMsg(result.errorLao ?? "ເກີດຂໍ້ຜິດພາດ");
    }
  };

  // ─── PDF Regeneration ───
  const handleGeneratePdf = useCallback(async () => {
    if (!selectedRecord || !printRef.current) return;
    setIsGeneratingPdf(true);
    setErrorMsg("");
    try {
      const docNum = selectedRecord.documentNumbers[pdfDocType] ?? `HIST-${selectedRecord.id.slice(0, 8)}`;
      await generateDocumentPdf(printRef.current, {
        filename: `${docNum}.pdf`,
        isReceipt: pdfDocType === "receipt",
        paperWidthMm: 80,
      });
      setSuccessMsg(`ດາວໂຫລດ PDF ${docNum} ສຳເລັດ!`);
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg("ເກີດຂໍ້ຜິດພາດໃນການສ້າງ PDF. ກະລຸນາລອງໃໝ່.");
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [selectedRecord, pdfDocType]);

  const handlePrint = useCallback(() => {
    if (!selectedRecord || !printRef.current) return;
    setErrorMsg("");
    const docNum = selectedRecord.documentNumbers[pdfDocType] ?? `HIST-${selectedRecord.id.slice(0, 8)}`;
    printDocumentElement(printRef.current, docNum);
  }, [selectedRecord, pdfDocType]);

  const docData = selectedRecord ? buildDocumentData(selectedRecord, pdfDocType, settings.business) : null;

  const inputCls = "text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/40";

  // ─── Render ───────────────────────────────────────────────────

  if (view === "detail" && selectedRecord) {
    return (
      <div className="space-y-5">
        {/* Back + Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={backToList} className="text-xs h-8">
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              ກັບຄືນລາຍການ
            </Button>
            <div>
              <h2 className="text-base font-bold text-foreground">ລາຍລະອຽດໃບປະເມີນ</h2>
              <p className="text-xs text-muted-foreground">ID: {selectedRecord.id.slice(0, 16)}...</p>
            </div>
          </div>
          {/* Delete from detail */}
          {deleteConfirmId === selectedRecord.id ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-destructive font-semibold">ຢືນຢັນລົບ?</span>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(selectedRecord.id)} className="text-xs h-8">ລົບ</Button>
              <Button size="sm" variant="outline" onClick={() => setDeleteConfirmId(null)} className="text-xs h-8">ຍົກເລີກ</Button>
            </div>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setDeleteConfirmId(selectedRecord.id)} className="text-xs h-8 text-destructive border-destructive/30 hover:bg-destructive/10">
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              ລົບ
            </Button>
          )}
        </div>

        {/* Historical snapshot notice */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
          <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
          <span>
            <strong>ຂໍ້ມູນປະຫວັດ (Historical Snapshot)</strong> — ລາຄາ ແລະ ລາຍລະອຽດໃນໃບນີ້ ແມ່ນຂໍ້ມູນ ณ ເວລາທີ່ບັນທຶກ ແລະ ຈະ<strong>ບໍ່ປ່ຽນແປງ</strong>ເມື່ອລາຄາສິນຄ້າມີການອັບເດດ.
          </span>
        </div>

        {/* Messages */}
        {successMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        {/* Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-muted/30 space-y-1">
            <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] block">ວັນທີ / ຂໍ້ມູນ</span>
            <p>ສ້າງ: <strong>{formatDateLao(selectedRecord.createdAt.slice(0, 10))}</strong></p>
            {selectedRecord.updatedAt !== selectedRecord.createdAt && (
              <p className="text-muted-foreground">ອັບເດດ: {formatDateLao(selectedRecord.updatedAt.slice(0, 10))}</p>
            )}
            <p>{selectedRecord.snapshotLines.length} ລາຍການ</p>
          </div>
          {(selectedRecord.customerName || selectedRecord.customerPhone) && (
            <div className="p-3 rounded-xl bg-muted/30 space-y-1">
              <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] block">ຂໍ້ມູນລູກຄ້າ</span>
              {selectedRecord.customerName && <p><strong>{selectedRecord.customerName}</strong></p>}
              {selectedRecord.customerCompany && <p>{selectedRecord.customerCompany}</p>}
              {selectedRecord.customerPhone && <p>☎ {selectedRecord.customerPhone}</p>}
              {selectedRecord.customerAddress && <p>📍 {selectedRecord.customerAddress}</p>}
            </div>
          )}
        </div>

        {/* Document Numbers */}
        {Object.keys(selectedRecord.documentNumbers).length > 0 && (
          <div className="p-3 rounded-xl bg-muted/20 space-y-1 text-xs">
            <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] block">ເລກທີເອກະສານ</span>
            {(Object.entries(selectedRecord.documentNumbers) as [DocumentType, string][]).map(([t, n]) => (
              <p key={t}><span className="capitalize">{t === "quotation" ? "ໃບສະເໜີ" : t === "invoice" ? "ໃບແຈ້ງໜີ້" : "ໃບເສັດ"}</span>: <strong className="font-mono">{n}</strong></p>
            ))}
          </div>
        )}

        {/* Line Items Table */}
        <div>
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">ລາຍການ (ຂໍ້ມູນ Snapshot)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-muted/40 text-left">
                  <th className="px-3 py-2 font-bold text-muted-foreground">#</th>
                  <th className="px-3 py-2 font-bold text-muted-foreground">ສິນຄ້າ</th>
                  <th className="px-3 py-2 font-bold text-muted-foreground text-right">ຂະໜາດ</th>
                  <th className="px-3 py-2 font-bold text-muted-foreground text-right">ຈຳນວນ</th>
                  <th className="px-3 py-2 font-bold text-muted-foreground text-right">ຍອດລວມ</th>
                </tr>
              </thead>
              <tbody>
                {selectedRecord.snapshotLines.map((l, i) => (
                  <tr key={l.id} className="border-b border-border/40 hover:bg-muted/20">
                    <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                    <td className="px-3 py-2">
                      <div className="font-semibold text-foreground">{l.productNameLao}</div>
                      {l.notes && <div className="text-muted-foreground text-[11px]">{l.notes}</div>}
                    </td>
                    <td className="px-3 py-2 text-right text-muted-foreground">
                      {l.pricingMethod === "per_m2"
                        ? `${l.width}×${l.height} ${l.dimensionUnit} (${l.areaM2.toFixed(2)} m²)`
                        : "—"}
                    </td>
                    <td className="px-3 py-2 text-right">{l.quantity}</td>
                    <td className="px-3 py-2 text-right font-semibold">{formatLAK(l.effectiveSubtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="p-4 rounded-xl bg-muted/20 border border-border space-y-1.5 text-xs">
          <h3 className="font-bold uppercase tracking-wider text-muted-foreground text-[10px] mb-2">ສະຫຼຸບລາຄາ</h3>
          {[
            { label: "ຍອດລວມສິນຄ້າ", val: selectedRecord.snapshotSummary.linesSubtotal },
            { label: "ຄ່າອອກແບບ", val: selectedRecord.snapshotSummary.charges.designFee },
            { label: "ຄ່າແຮງ", val: selectedRecord.snapshotSummary.charges.laborFee },
            { label: "ຄ່າຕິດຕັ້ງ", val: selectedRecord.snapshotSummary.charges.installationFee },
            { label: "ຄ່າຈັດສົ່ງ", val: selectedRecord.snapshotSummary.charges.deliveryFee },
            { label: "ບໍລິການເສີມ", val: selectedRecord.snapshotSummary.charges.extraServicesTotal },
          ].filter(r => r.val > 0).map((r) => (
            <div key={r.label} className="flex justify-between text-muted-foreground">
              <span>{r.label}</span><span>+{formatLAK(r.val)}</span>
            </div>
          ))}
          <div className="flex justify-between font-medium border-t border-border/50 pt-1.5">
            <span>ລວມກ່ອນຫຼຸດ</span><span>{formatLAK(selectedRecord.snapshotSummary.subtotalBeforeDiscount)}</span>
          </div>
          {selectedRecord.snapshotSummary.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span>ສ່ວນຫຼຸດ</span><span>-{formatLAK(selectedRecord.snapshotSummary.discountAmount)}</span>
            </div>
          )}
          {selectedRecord.snapshotSummary.taxAmount > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>ອາກອນ ({selectedRecord.snapshotTax.rate}%)</span>
              <span>+{formatLAK(selectedRecord.snapshotSummary.taxAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-extrabold text-primary text-sm border-t-2 border-primary/30 pt-2">
            <span>ຍອດລວມສຸດທິ</span><span>{formatLAK(selectedRecord.snapshotSummary.total)}</span>
          </div>
        </div>

        {/* Internal Notes (editable) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">ໝາຍເຫດພາຍໃນ (ແກ້ໄຂໄດ້)</span>
            {editNotesId !== selectedRecord.id ? (
              <button onClick={() => startEditNotes(selectedRecord)} className="text-[11px] text-primary hover:underline">ແກ້ໄຂ</button>
            ) : (
              <div className="flex gap-1.5">
                <button onClick={() => saveNotes(selectedRecord.id)} className="text-[11px] text-emerald-600 hover:underline font-bold">ບັນທຶກ</button>
                <button onClick={() => setEditNotesId(null)} className="text-[11px] text-muted-foreground hover:underline">ຍົກເລີກ</button>
              </div>
            )}
          </div>
          {editNotesId === selectedRecord.id ? (
            <textarea
              rows={3}
              value={editNotesValue}
              onChange={(e) => setEditNotesValue(e.target.value)}
              className="w-full text-xs bg-background border border-border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          ) : (
            <p className="text-xs text-muted-foreground bg-muted/20 rounded-lg p-2.5 min-h-[40px]">
              {selectedRecord.internalNotes || <em>ຍັງບໍ່ມີໝາຍເຫດ</em>}
            </p>
          )}
        </div>

        {/* PDF Regeneration */}
        <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 space-y-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-foreground">ສ້າງ PDF ໃໝ່ຈາກ Snapshot ນີ້</span>
          </div>
          <p className="text-[11px] text-muted-foreground">PDF ທີ່ສ້າງຈາກລາຍການນີ້ ຈະໃຊ້ລາຄາ ແລະ ຂໍ້ມູນ ≠ ໃນ Snapshot — ບໍ່ໃຊ້ລາຄາໄໝ.</p>

          {/* Doc type selector */}
          <div className="flex gap-1.5">
            {(["quotation", "invoice", "receipt"] as DocumentType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setPdfDocType(t)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                  pdfDocType === t
                    ? t === "quotation" ? "bg-primary text-primary-foreground border-primary"
                      : t === "invoice" ? "bg-slate-800 text-white border-slate-800"
                      : "bg-emerald-600 text-white border-emerald-600"
                    : "border-border text-muted-foreground hover:bg-muted/60"
                }`}
              >
                {t === "quotation" ? "ໃບສະເໜີ" : t === "invoice" ? "ໃບແຈ້ງໜີ້" : "ໃບເສັດ"}
              </button>
            ))}
          </div>

          {/* Hidden print target */}
          <div className="hidden">
            <div ref={printRef} className="bg-white">
              {docData && pdfDocType === "quotation" && <QuotationDocument data={docData} />}
              {docData && pdfDocType === "invoice" && <InvoiceDocument data={docData} />}
              {docData && pdfDocType === "receipt" && <ReceiptDocument data={docData} />}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              disabled={isGeneratingPdf}
              className="flex-1 text-xs h-9"
            >
              <Printer className="h-3.5 w-3.5 mr-1.5" />
              ພິມ (Print)
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleGeneratePdf}
              disabled={isGeneratingPdf}
              className="flex-1 text-xs font-bold h-9"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              {isGeneratingPdf ? "ກຳລັງສ້າງ..." : "ດາວໂຫລດ PDF"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── LIST VIEW ──────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h2 className="text-lg font-bold text-foreground">ປະຫວັດໃບປະເມີນລາຄາ (Quote History)</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          ລາຍການໃບປະເມີນທີ່ຖືກບັນທຶກທັງໝົດ — ລາຄາ ແລະ ລາຍລະອຽດເດີມຖືກເກັບໄວ້ຕາມ Snapshot ທີ່ບັນທຶກ
        </p>
      </div>

      {/* Storage Warning */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
        <span>
          ປະຫວັດທັງໝົດ ຖືກເກັບໄວ້ໃນ <strong>Browser ນີ້ເທົ່ານັ້ນ</strong>. Export JSON Backup ເປັນປະຈຳ ກ່ອນລ້າງຂໍ້ມູນ Browser ຫຼື ຍ້າຍໄປເຄື່ອງໃໝ່.
        </span>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Search & Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="ຄົ້ນຫາ ເລກທີ, ລາຍການ, ຊື່ລູກຄ້າ..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className={`w-full pl-8 pr-8 ${inputCls}`}
          />
          {searchQuery && (
            <button type="button" onClick={clearSearch} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
            <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} className={inputCls} title="ຈາກວັນທີ" />
            <span className="text-muted-foreground text-xs">—</span>
            <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} className={inputCls} title="ຮອດວັນທີ" />
          </div>

          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className={inputCls}
          >
            <option value="newest">ໃໝ່ສຸດກ່ອນ</option>
            <option value="oldest">ເກົ່າສຸດກ່ອນ</option>
            <option value="total_desc">ຍອດສູງ → ຕ່ຳ</option>
            <option value="total_asc">ຍອດຕ່ຳ → ສູງ</option>
          </select>

          {(searchQuery || dateFrom || dateTo) && (
            <button type="button" onClick={clearSearch} className="text-xs text-muted-foreground hover:text-foreground underline">ລ້າງການຄົ້ນຫາ</button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {allRecords.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-foreground">ຍັງບໍ່ມີໃບປະເມີນທີ່ບັນທຶກ</h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
            ໄປທີ່ <strong>ໜ້າຄຳນວນລາຄາ</strong> ແລ້ວກົດ <strong>"ບັນທຶກໃບປະເມີນ"</strong> ເພື່ອເລີ່ມເກັບປະຫວັດ
          </p>
        </div>
      )}

      {/* No Results */}
      {allRecords.length > 0 && filteredRecords.length === 0 && (
        <div className="text-center py-10 space-y-2">
          <Search className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="text-sm font-semibold text-foreground">ບໍ່ພົບລາຍການທີ່ຕ້ອງການ</p>
          <p className="text-xs text-muted-foreground">ລອງປ່ຽນຄຳຄົ້ນຫາ ຫຼື ລ້າງຕົວກອງ</p>
          <button type="button" onClick={clearSearch} className="text-xs text-primary hover:underline">ລ້າງການຄົ້ນຫາ</button>
        </div>
      )}

      {/* Desktop Table */}
      {paginatedRecords.length > 0 && (
        <>
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-muted/40 text-left text-muted-foreground">
                  <th className="px-3 py-2.5 font-bold">ວັນທີ</th>
                  <th className="px-3 py-2.5 font-bold">ລາຍການ</th>
                  <th className="px-3 py-2.5 font-bold">ລູກຄ້າ</th>
                  <th className="px-3 py-2.5 font-bold text-right">ຍອດລວມ</th>
                  <th className="px-3 py-2.5 font-bold text-center">ເອກະສານ</th>
                  <th className="px-3 py-2.5 font-bold text-center">ການດຳເນີນການ</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.map((record) => (
                  <tr key={record.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span>{formatDateLao(record.createdAt.slice(0, 10))}</span>
                      {record.updatedAt !== record.createdAt && (
                        <span className="block text-[10px] text-muted-foreground">ອັບ: {formatDateLao(record.updatedAt.slice(0, 10))}</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 max-w-[200px]">
                      <span className="truncate block">{getItemSummary(record)}</span>
                      <span className="text-muted-foreground text-[10px]">{record.snapshotLines.length} ລາຍການ</span>
                    </td>
                    <td className="px-3 py-2.5">
                      {record.customerName ? (
                        <span className="font-medium">{record.customerName}</span>
                      ) : (
                        <span className="text-muted-foreground italic">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right font-bold text-foreground whitespace-nowrap">
                      {formatLAK(record.snapshotSummary.total)}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {record.documentNumbers.quotation && <span title="ໃບສະເໜີ"><FileCheck className="h-3.5 w-3.5 text-primary" /></span>}
                        {record.documentNumbers.invoice && <span title="ໃບແຈ້ງໜີ້"><FileText className="h-3.5 w-3.5 text-slate-500" /></span>}
                        {record.documentNumbers.receipt && <span title="ໃບເສັດ"><Receipt className="h-3.5 w-3.5 text-emerald-500" /></span>}
                        {Object.keys(record.documentNumbers).length === 0 && <span className="text-muted-foreground text-[10px]">ຍັງບໍ່ມີ</span>}
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openDetail(record)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          ເປີດ
                        </button>
                        {deleteConfirmId === record.id ? (
                          <div className="flex gap-1">
                            <button onClick={() => handleDelete(record.id)} className="px-2 py-1 rounded-lg text-[11px] font-bold bg-destructive text-white">ລົບ</button>
                            <button onClick={() => setDeleteConfirmId(null)} className="px-2 py-1 rounded-lg text-[11px] bg-muted text-muted-foreground">ຍົກ</button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(record.id)}
                            className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="ລົບ"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {paginatedRecords.map((record) => (
              <div key={record.id} className="p-4 rounded-2xl border border-border bg-card space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-foreground">{formatDateLao(record.createdAt.slice(0, 10))}</p>
                    {record.customerName && <p className="text-[11px] text-muted-foreground">{record.customerName}</p>}
                  </div>
                  <span className="text-base font-extrabold text-primary whitespace-nowrap">{formatLAK(record.snapshotSummary.total)}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">{getItemSummary(record)}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openDetail(record)} className="flex-1 text-xs h-8">
                    ເປີດລາຍລະອຽດ
                  </Button>
                  {deleteConfirmId === record.id ? (
                    <div className="flex gap-1">
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(record.id)} className="text-xs h-8">ລົບ</Button>
                      <Button size="sm" variant="outline" onClick={() => setDeleteConfirmId(null)} className="text-xs h-8">ຍົກ</Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setDeleteConfirmId(record.id)} className="text-xs h-8 text-destructive border-destructive/30">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded-lg text-xs border border-border disabled:opacity-40 hover:bg-muted transition-colors"
              >
                <SortAsc className="h-3.5 w-3.5 rotate-90" />
              </button>
              <span className="text-xs text-muted-foreground">ໜ້າ {page} / {totalPages}</span>
              <button
                type="button"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded-lg text-xs border border-border disabled:opacity-40 hover:bg-muted transition-colors"
              >
                <SortDesc className="h-3.5 w-3.5 rotate-90" />
              </button>
            </div>
          )}

          <p className="text-[11px] text-center text-muted-foreground">
            ສະແດງ {paginatedRecords.length} / {filteredRecords.length} ລາຍການ (ທັງໝົດ {allRecords.length})
          </p>
        </>
      )}
    </div>
  );
};
