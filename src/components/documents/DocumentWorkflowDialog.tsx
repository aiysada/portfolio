/**
 * Indie Sign — DocumentWorkflowDialog Component
 * Complete client-side document generation, preview, editing, PDF export and printing.
 */

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  FileText,
  Printer,
  Download,
  X,
  AlertCircle,
  FileCheck,
  Receipt,
  Eye,
  CheckCircle2,
  Edit3,
} from "lucide-react";
import type { QuoteLineItem, AdditionalCharges, DiscountConfig, TaxConfig, QuoteSummary } from "@/types/calculator";
import type { DocumentType, DocumentData, CustomerInfo } from "@/types/documents";
import { DEFAULT_BUSINESS_INFO } from "@/data/businessInfo";
import {
  formatDateISO,
  calculateValidityDate,
  generateNextDocumentNumber,
  validateDocumentNumber,
  commitDocumentNumber,
} from "@/lib/documentNumbering";
import { generateDocumentPdf, printDocumentElement } from "@/lib/pdfGenerator";
import { QuotationDocument } from "@/components/documents/QuotationDocument";
import { InvoiceDocument } from "@/components/documents/InvoiceDocument";
import { ReceiptDocument } from "@/components/documents/ReceiptDocument";
import { Button } from "@/components/ui/button";

interface DocumentWorkflowDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lines: QuoteLineItem[];
  charges: AdditionalCharges;
  discount: DiscountConfig;
  tax: TaxConfig;
  summary: QuoteSummary;
}

export const DocumentWorkflowDialog: React.FC<DocumentWorkflowDialogProps> = ({
  isOpen,
  onClose,
  lines,
  charges,
  discount,
  tax,
  summary,
}) => {
  const [docType, setDocType] = useState<DocumentType>("quotation");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("preview");

  // Document metadata state
  const [docNumber, setDocNumber] = useState<string>("");
  const [issueDate, setIssueDate] = useState<string>(() => formatDateISO(new Date()));
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: "",
    phone: "",
    company: "",
    address: "",
  });
  const [notes, setNotes] = useState<string>("");

  // Receipt specific payment fields
  const [amountPaid, setAmountPaid] = useState<number>(summary.total);
  const [paymentMethod, setPaymentMethod] = useState<string>("BCEL One (ໂອນເງິນ)");
  const [receiptPaperWidthMm, setReceiptPaperWidthMm] = useState<number>(80);

  // Status & error
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const printRef = useRef<HTMLDivElement>(null);

  // Initialize or re-generate document number when docType or issueDate changes
  useEffect(() => {
    if (isOpen) {
      const generated = generateNextDocumentNumber(docType, new Date(issueDate));
      setDocNumber(generated);
      setAmountPaid(summary.total);
      setErrorMessage("");
      setSuccessMessage("");
    }
  }, [isOpen, docType, issueDate, summary.total]);

  // Construct DocumentData snapshot from calculator state
  const documentData: DocumentData = useMemo(() => {
    const itemSnapshots = lines.map((l) => ({
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
    }));

    const validUntilDate =
      docType === "quotation" ? calculateValidityDate(issueDate, 15) : undefined;

    return {
      type: docType,
      number: docNumber,
      issueDate,
      validUntilDate,
      customer,
      business: DEFAULT_BUSINESS_INFO,
      items: itemSnapshots,
      charges: {
        designFee: summary.charges.designFee,
        laborFee: summary.charges.laborFee,
        installationFee: summary.charges.installationFee,
        deliveryFee: summary.charges.deliveryFee,
        extraServices: charges.extraServices,
        extraServicesTotal: summary.charges.extraServicesTotal,
        totalCharges: summary.charges.totalCharges,
      },
      linesSubtotal: summary.linesSubtotal,
      totalCharges: summary.charges.totalCharges,
      subtotalBeforeDiscount: summary.subtotalBeforeDiscount,
      discount,
      discountAmount: summary.discountAmount,
      subtotalAfterDiscount: summary.subtotalAfterDiscount,
      tax,
      taxAmount: summary.taxAmount,
      total: summary.total,
      amountPaid: docType === "receipt" ? amountPaid : undefined,
      remainingBalance:
        docType === "receipt" ? Math.max(0, summary.total - amountPaid) : undefined,
      paymentMethod: docType === "receipt" ? paymentMethod : undefined,
      receiptPaperWidthMm,
      notes,
      terms: [],
    };
  }, [
    docType,
    docNumber,
    issueDate,
    customer,
    lines,
    charges,
    discount,
    tax,
    summary,
    amountPaid,
    paymentMethod,
    receiptPaperWidthMm,
    notes,
  ]);

  if (!isOpen) return null;

  // Handle PDF Download
  const handleDownloadPdf = async () => {
    setErrorMessage("");
    const val = validateDocumentNumber(docNumber);
    if (!val.isValid) {
      setErrorMessage(val.error || "ເລກທີເອກະສານບໍ່ຖືກຕ້ອງ");
      return;
    }

    if (!printRef.current) {
      setErrorMessage("ບໍ່ພົບຂໍ້ມູນເອກະສານສຳລັບສ້າງ PDF");
      return;
    }

    setIsGenerating(true);
    try {
      commitDocumentNumber(docType, docNumber, new Date(issueDate));

      const filename = `${docNumber}.pdf`;
      await generateDocumentPdf(printRef.current, {
        filename,
        isReceipt: docType === "receipt",
        paperWidthMm: receiptPaperWidthMm,
      });

      setSuccessMessage(`ດາວໂຫລດໄຟລ໌ ${filename} ສຳເລັດແລ້ວ!`);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setErrorMessage("ເກີດຂໍ້ຜິດພາດໃນການສ້າງ PDF. ກະລຸນາລອງໃໝ່ ຫຼື ໃຊ້ປຸ່ມພິມເອກະສານ.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Native Print
  const handlePrint = () => {
    setErrorMessage("");
    const val = validateDocumentNumber(docNumber);
    if (!val.isValid) {
      setErrorMessage(val.error || "ເລກທີເອກະສານບໍ່ຖືກຕ້ອງ");
      return;
    }

    if (!printRef.current) return;
    commitDocumentNumber(docType, docNumber, new Date(issueDate));
    printDocumentElement(printRef.current, docNumber);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto bg-card rounded-3xl border border-border shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                ລະບົບສ້າງເອກະສານ PDF (Document Generator)
              </h2>
              <p className="text-xs text-muted-foreground">
                ສ້າງໃບສະເໜີລາຄາ, ໃບແຈ້ງໜີ້ ຫຼື ໃບເສັດຮັບເງິນ ຈາກຂໍ້ມູນຄຳນວນຕົວຈິງ
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Document Type Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-border/60 bg-muted/10 shrink-0">
          <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setDocType("quotation")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                docType === "quotation"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileCheck className="h-3.5 w-3.5" />
              1. ໃບສະເໜີລາຄາ (Quotation)
            </button>

            <button
              type="button"
              onClick={() => setDocType("invoice")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                docType === "invoice"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              2. ໃບແຈ້ງໜີ້ (Invoice)
            </button>

            <button
              type="button"
              onClick={() => setDocType("receipt")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                docType === "receipt"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Receipt className="h-3.5 w-3.5" />
              3. ໃບເສັດຮັບເງິນ (Receipt)
            </button>
          </div>

          {/* Toggle between Edit details and Preview */}
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold ${
                activeTab === "edit"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              ແກ້ໄຂຂໍ້ມູນ
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold ${
                activeTab === "preview"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              ເບິ່ງຕົວຢ່າງ (Preview)
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Messages */}
          {errorMessage && (
            <div className="mb-4 flex items-center gap-2 text-xs text-destructive bg-destructive/10 p-3 rounded-xl border border-destructive/20 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 font-medium">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {activeTab === "edit" ? (
            /* ── Tab 1: Edit Document Information ── */
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="p-4 rounded-2xl border border-border/80 bg-muted/10 space-y-3">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  ຂໍ້ມູນເອກະສານ (Document Meta):
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1 font-medium">
                      ເລກທີເອກະສານ (Document No.)
                    </label>
                    <input
                      type="text"
                      value={docNumber}
                      onChange={(e) => setDocNumber(e.target.value)}
                      className="w-full text-xs bg-background border border-border rounded-lg p-2 font-mono font-semibold"
                    />
                    <span className="text-[10px] text-muted-foreground mt-0.5 block">
                      * ບັນທຶກລຳດັບໃນ Local Browser ນີ້ເທົ່ານັ້ນ
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1 font-medium">
                      ວັນທີອອກເອກະສານ (Date)
                    </label>
                    <input
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="w-full text-xs bg-background border border-border rounded-lg p-2 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="p-4 rounded-2xl border border-border/80 bg-muted/10 space-y-3">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  ຂໍ້ມູນລູກຄ້າ (Customer Info):
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1 font-medium">
                      ຊື່ລູກຄ້າ / ບໍລິສັດ (Name)
                    </label>
                    <input
                      type="text"
                      placeholder="ເຊັ່ນ: ທ້າວ ສົມສັກ, ຮ້ານ ກາເຟ..."
                      value={customer.name}
                      onChange={(e) =>
                        setCustomer((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full text-xs bg-background border border-border rounded-lg p-2"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1 font-medium">
                      ເບີໂທລະສັບ / WhatsApp (Phone)
                    </label>
                    <input
                      type="text"
                      placeholder="ເຊັ່ນ: 020 5856 3868"
                      value={customer.phone}
                      onChange={(e) =>
                        setCustomer((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      className="w-full text-xs bg-background border border-border rounded-lg p-2"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-muted-foreground block mb-1 font-medium">
                      ສະຖານທີ່ຕິດຕັ້ງ / ຈັດສົ່ງ (Address)
                    </label>
                    <input
                      type="text"
                      placeholder="ເຊັ່ນ: ບ້ານ ດົງປ່າລານ, ເມືອງ ສີສັດຕະນາກ, ນະຄອນຫຼວງວຽງຈັນ"
                      value={customer.address}
                      onChange={(e) =>
                        setCustomer((prev) => ({ ...prev, address: e.target.value }))
                      }
                      className="w-full text-xs bg-background border border-border rounded-lg p-2"
                    />
                  </div>
                </div>
              </div>

              {/* Receipt-Specific Payment Details */}
              {docType === "receipt" && (
                <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
                  <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    ການຊຳລະເງິນສຳລັບໃບເສັດ (Payment Details):
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-muted-foreground block mb-1 font-medium">
                        ຈຳນວນເງິນທີ່ໄດ້ຮັບ (Amount Received)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={summary.total}
                        step="1000"
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                        className="w-full text-xs bg-background border border-border rounded-lg p-2 font-bold text-emerald-600"
                      />

                      {/* Quick preset buttons */}
                      <div className="flex gap-1.5 mt-2">
                        <button
                          type="button"
                          onClick={() => setAmountPaid(summary.total)}
                          className="px-2 py-0.5 rounded text-[10px] bg-emerald-600 text-white font-bold"
                        >
                          100% (ເຕັມຈຳນວນ)
                        </button>
                        <button
                          type="button"
                          onClick={() => setAmountPaid(Math.round(summary.total * 0.5))}
                          className="px-2 py-0.5 rounded text-[10px] bg-muted font-medium hover:text-foreground"
                        >
                          50% (ມັດຈຳ)
                        </button>
                        <button
                          type="button"
                          onClick={() => setAmountPaid(Math.round(summary.total * 0.3))}
                          className="px-2 py-0.5 rounded text-[10px] bg-muted font-medium hover:text-foreground"
                        >
                          30% (ມັດຈຳ)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block mb-1 font-medium">
                        ວິທີການຊຳລະ (Payment Method)
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full text-xs bg-background border border-border rounded-lg p-2 font-medium"
                      >
                        <option value="BCEL One (ໂອນເງິນ)">BCEL One (ໂອນເງິນ)</option>
                        <option value="ເງິນສົດ (Cash)">ເງິນສົດ (Cash)</option>
                        <option value="ທະນາຄານອື່ນໆ (Bank Transfer)">ທະນາຄານອື່ນໆ (Bank Transfer)</option>
                      </select>

                      <div className="mt-2 text-xs text-muted-foreground">
                        ຍອດເຫຼືອຄ້າງຊຳລະ:{" "}
                        <strong className="text-foreground">
                          {Math.max(0, summary.total - amountPaid).toLocaleString()} ກີບ
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1 font-medium">
                      ຄວາມກວ້າງໜ້າເຈ້ຍໃບເສັດ (Paper Width)
                    </label>
                    <select
                      value={receiptPaperWidthMm}
                      onChange={(e) => setReceiptPaperWidthMm(parseInt(e.target.value, 10))}
                      className="w-full text-xs bg-background border border-border rounded-lg p-2"
                    >
                      <option value="80">80 ມມ (ມາດຕະຖານເຈ້ຍຄວາມຮ້ອນ Thermal Roll)</option>
                      <option value="58">58 ມມ (Mini Thermal Roll)</option>
                      <option value="105">105 ມມ (ເຄິ່ງ A4 A6)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="text-[11px] text-muted-foreground block mb-1 font-medium">
                  ໝາຍເຫດເພີ່ມຕື່ມໃນເອກະສານ (Notes):
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="ເຊັ່ນ: ມັດຈຳ 50% ກ່ອນເລີ່ມຜະລິດ, ກຳນົດຕິດຕັ້ງວັນທີ..."
                  className="w-full text-xs bg-background border border-border rounded-lg p-2"
                />
              </div>

              <div className="pt-2 text-center">
                <Button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className="text-xs"
                >
                  <Eye className="h-4 w-4 mr-1.5" />
                  ເບິ່ງຕົວຢ່າງເອກະສານ (Preview Document)
                </Button>
              </div>
            </div>
          ) : (
            /* ── Tab 2: Document Preview ── */
            <div className="flex justify-center bg-muted/40 p-3 sm:p-6 rounded-2xl overflow-x-auto">
              <div
                ref={printRef}
                className="bg-white shadow-xl rounded-lg overflow-hidden shrink-0"
              >
                {docType === "quotation" && <QuotationDocument data={documentData} />}
                {docType === "invoice" && <InvoiceDocument data={documentData} />}
                {docType === "receipt" && <ReceiptDocument data={documentData} />}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-border bg-muted/20 shrink-0">
          <div className="text-xs text-muted-foreground">
            ເອກະສານ: <strong>{docNumber}</strong> ({lines.length} ລາຍການ)
          </div>

          <div className="flex items-center gap-2">
            {/* Native Browser Print */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              disabled={isGenerating}
              className="text-xs font-semibold h-9"
            >
              <Printer className="h-4 w-4 mr-1.5" />
              ພິມເອກະສານ (Print)
            </Button>

            {/* Download PDF */}
            <Button
              type="button"
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="text-xs font-bold h-9 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Download className="h-4 w-4 mr-1.5" />
              {isGenerating ? "ກຳລັງສ້າງ PDF..." : "ດາວໂຫລດ PDF (Download)"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
