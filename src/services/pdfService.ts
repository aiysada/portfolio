/**
 * Indie Sign — PDF Quotation Generator
 * Uses the browser's print dialog to produce a styled PDF quotation.
 */

import type { DocumentRecord } from "@/types/quote";
import { formatLAK } from "@/lib/calculator";
import { BUSINESS_CONFIG } from "@/constants/business";

/**
 * Generate and trigger a print/save-as-PDF dialog for a quotation document.
 */
export function printQuotationAsPDF(doc: DocumentRecord): void {
  const html = buildQuotationHTML(doc);

  // Open a new popup window sized for A4 printing
  const win = window.open("", "_blank", "width=900,height=1200,scrollbars=yes");
  if (!win) {
    alert("ກະລຸນາອະນຸຍາດ Popup ໃນ Browser ຂອງທ່ານເພື່ອໂຫລດ PDF.");
    return;
  }

  win.document.write(html);
  win.document.close();

  // Trigger print after fonts/styles are loaded
  win.onload = () => {
    win.focus();
    win.print();
  };
}

function buildQuotationHTML(doc: DocumentRecord): string {
  const issueDate = new Date(doc.issueDate).toLocaleDateString("lo-LA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const validUntil = doc.validUntil
    ? new Date(doc.validUntil).toLocaleDateString("lo-LA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const docTypeLabel =
    doc.type === "quotation"
      ? "ໃບສະເໜີລາຄາ (Quotation)"
      : doc.type === "invoice"
      ? "ໃບແຈ້ງໜີ້ (Invoice)"
      : "ໃບຮັບເງິນ (Receipt)";

  const itemRows = doc.items
    .map(
      (item, i) => `
    <tr>
      <td class="cell-center">${i + 1}</td>
      <td>
        <div class="item-title">${item.descriptionLao}</div>
        ${item.dimension ? `<div class="item-sub">${item.dimension}</div>` : ""}
      </td>
      <td class="cell-right">${item.quantity}</td>
      <td class="cell-right">${formatLAK(item.unitPrice)}</td>
      <td class="cell-right bold">${formatLAK(item.total)}</td>
    </tr>
  `
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="lo">
<head>
  <meta charset="UTF-8" />
  <title>${docTypeLabel} — ${doc.documentNumber}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { font-size: 13px; }
    body {
      font-family: 'Noto Sans Lao', 'Plus Jakarta Sans', sans-serif;
      color: #1a1a2e;
      background: #fff;
      padding: 40px 48px;
      line-height: 1.6;
    }
    /* Header */
    .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 24px; border-bottom: 2px solid #f97316; }
    .brand-name { font-size: 22px; font-weight: 700; color: #f97316; }
    .brand-tagline { font-size: 11px; color: #666; margin-top: 2px; }
    .doc-type { font-size: 20px; font-weight: 700; text-align: right; }
    .doc-number { font-size: 12px; color: #666; text-align: right; margin-top: 4px; }

    /* Meta info grid */
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 24px 0; }
    .meta-section h4 { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #f97316; margin-bottom: 8px; }
    .meta-section p { font-size: 12px; color: #333; margin-bottom: 2px; }
    .meta-section strong { font-weight: 600; }

    /* Items table */
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    thead { background: #f97316; color: white; }
    thead th { padding: 10px 12px; font-size: 11px; font-weight: 700; text-align: left; }
    thead th:last-child, thead th:nth-child(3), thead th:nth-child(4) { text-align: right; }
    tbody tr { border-bottom: 1px solid #f0ede8; }
    tbody tr:nth-child(even) { background: #fafaf8; }
    td { padding: 10px 12px; font-size: 12px; vertical-align: top; }
    .cell-center { text-align: center; }
    .cell-right { text-align: right; font-family: 'Plus Jakarta Sans', sans-serif; }
    .bold { font-weight: 700; }
    .item-title { font-weight: 500; }
    .item-sub { font-size: 11px; color: #888; margin-top: 2px; }

    /* Totals */
    .totals { margin-top: 8px; display: flex; flex-direction: column; align-items: flex-end; }
    .totals-table { min-width: 300px; }
    .totals-table td { padding: 6px 12px; font-size: 13px; }
    .totals-table .label { color: #555; }
    .totals-table .value { text-align: right; font-family: 'Plus Jakarta Sans', sans-serif; }
    .total-row td { border-top: 2px solid #f97316; font-size: 15px; font-weight: 700; padding-top: 10px; }
    .discount-row .value { color: #16a34a; }

    /* Notes */
    .notes { margin-top: 32px; padding: 16px; background: #fff7ed; border-left: 3px solid #f97316; border-radius: 6px; }
    .notes h4 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #f97316; margin-bottom: 6px; }
    .notes p { font-size: 12px; color: #444; line-height: 1.6; }

    /* Footer */
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; display: flex; justify-content: space-between; align-items: flex-end; }
    .footer-contact { font-size: 11px; color: #555; }
    .footer-sig { text-align: right; }
    .footer-sig p { font-size: 11px; color: #555; }
    .sig-line { width: 160px; border-bottom: 1px solid #999; margin-top: 48px; margin-bottom: 4px; }
    .watermark { font-size: 10px; color: #ccc; text-align: center; margin-top: 24px; }

    @media print {
      body { padding: 20px 28px; }
      @page { margin: 15mm; size: A4; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand-name">${BUSINESS_CONFIG.brandName}</div>
      <div class="brand-tagline">${BUSINESS_CONFIG.taglineEn}</div>
      <div style="margin-top:8px;font-size:11px;color:#555;">
        ☎ ${BUSINESS_CONFIG.contact.displayPhone}<br/>
        WhatsApp: ${BUSINESS_CONFIG.contact.whatsappUrl}
      </div>
    </div>
    <div>
      <div class="doc-type">${docTypeLabel}</div>
      <div class="doc-number">ເລກທີ: ${doc.documentNumber}</div>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-section">
      <h4>ຂໍ້ມູນລູກຄ້າ</h4>
      <p><strong>${doc.customer.name}</strong></p>
      ${doc.customer.company ? `<p>${doc.customer.company}</p>` : ""}
      <p>☎ ${doc.customer.phone}</p>
      ${doc.customer.email ? `<p>✉ ${doc.customer.email}</p>` : ""}
      ${doc.customer.address ? `<p>📍 ${doc.customer.address}</p>` : ""}
    </div>
    <div class="meta-section" style="text-align:right;">
      <h4>ລາຍລະອຽດເອກະສານ</h4>
      <p><strong>ວັນທີ:</strong> ${issueDate}</p>
      <p><strong>ໃຊ້ໄດ້ຮອດ:</strong> ${validUntil}</p>
      <p><strong>ສະຖານະ:</strong> ${doc.status === "draft" ? "ຮ່າງ (Draft)" : doc.status === "approved" ? "ອະນຸມັດ" : doc.status === "paid" ? "ຊຳລະແລ້ວ" : doc.status}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:40px;">#</th>
        <th>ລາຍການ / ລາຍລະອຽດ</th>
        <th style="width:80px; text-align:right;">ຈຳນວນ</th>
        <th style="width:140px; text-align:right;">ລາຄາ/ໜ່ວຍ</th>
        <th style="width:160px; text-align:right;">ລວມ</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>

  <div class="totals">
    <table class="totals-table">
      <tbody>
        <tr>
          <td class="label">ລວມກ່ອນສ່ວນຫຼຸດ:</td>
          <td class="value">${formatLAK(doc.subtotal)}</td>
        </tr>
        ${
          doc.discount && doc.discount > 0
            ? `<tr class="discount-row">
                <td class="label">ສ່ວນຫຼຸດ:</td>
                <td class="value">− ${formatLAK(doc.discount)}</td>
              </tr>`
            : ""
        }
        ${
          doc.taxRate && doc.taxRate > 0 && doc.taxAmount
            ? `<tr>
                <td class="label">VAT (${doc.taxRate}%):</td>
                <td class="value">+ ${formatLAK(doc.taxAmount)}</td>
              </tr>`
            : ""
        }
        <tr class="total-row">
          <td class="label">ລວມທັງໝົດ:</td>
          <td class="value">${formatLAK(doc.total)}</td>
        </tr>
      </tbody>
    </table>
  </div>

  ${
    doc.notes
      ? `<div class="notes">
          <h4>ໝາຍເຫດ</h4>
          <p>${doc.notes}</p>
        </div>`
      : ""
  }

  ${
    doc.terms
      ? `<div class="notes" style="margin-top:12px;background:#f8fafc;border-left-color:#64748b;">
          <h4>ເງື່ອນໄຂ</h4>
          <p>${doc.terms}</p>
        </div>`
      : ""
  }

  <div class="footer">
    <div class="footer-contact">
      <strong>${BUSINESS_CONFIG.brandName}</strong><br/>
      ${BUSINESS_CONFIG.contact.displayPhone}<br/>
      ${BUSINESS_CONFIG.contact.whatsappUrl}
    </div>
    <div class="footer-sig">
      <div class="sig-line"></div>
      <p>ລາຍເຊັນຜູ້ອອກໃບ / Authorized Signature</p>
      <p style="margin-top:4px;font-weight:600;">${BUSINESS_CONFIG.brandName}</p>
    </div>
  </div>

  <div class="watermark">
    ສ້າງໂດຍ ${BUSINESS_CONFIG.brandName} Calculator System • ${new Date().toLocaleDateString("lo-LA")}
  </div>
</body>
</html>`;
}
