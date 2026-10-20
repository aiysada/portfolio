/**
 * Indie Sign — Client-Side PDF Generation & Printing Utility
 *
 * Architecture & Lao Typography:
 * Uses high-DPI HTML-to-Canvas + jsPDF to guarantee 100% accurate Lao script
 * rendering (vowels, tone marks, subscripts) without glyph distortion or missing tone marks,
 * leveraging the browser's native text shaping engine (Noto Sans Lao).
 *
 * Supports:
 * 1. A4 standard multi-page documents (Quotation & Invoice)
 * 2. Custom-width thermal/compact receipts (default 80mm) with auto-adapting height
 * 3. Native browser print integration
 */

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export interface PdfGenerationOptions {
  filename?: string;
  isReceipt?: boolean;
  paperWidthMm?: number; // e.g. 80 for thermal receipt, 210 for A4
}

/**
 * Generate and download a PDF from a DOM element.
 */
export async function generateDocumentPdf(
  element: HTMLElement,
  options: PdfGenerationOptions = {}
): Promise<void> {
  const {
    filename = "document.pdf",
    isReceipt = false,
    paperWidthMm = isReceipt ? 80 : 210,
  } = options;

  // 1. Render high-resolution canvas with html2canvas
  // Use scale: 2 for sharp, crisp rendering while keeping file size reasonable
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    windowWidth: element.scrollWidth,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  if (isReceipt) {
    // ── Compact / Thermal Receipt (Single continuous page) ──
    const pdfWidth = paperWidthMm;
    const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [pdfWidth, pdfHeight],
    });

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
  } else {
    // ── Standard A4 Document (Quotation & Invoice) ──
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const scaledHeight = (imgHeight * pageWidth) / imgWidth;

    if (scaledHeight <= pageHeight) {
      // Single A4 page
      pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, scaledHeight);
    } else {
      // Multi-page A4
      let heightLeft = scaledHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, pageWidth, scaledHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, pageWidth, scaledHeight);
        heightLeft -= pageHeight;
      }
    }

    pdf.save(filename);
  }
}

/**
 * Print a document directly using the browser's native print engine.
 * Opens an isolated print window with all relevant styles and fonts.
 */
export function printDocumentElement(element: HTMLElement, title = "Print Document"): void {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    // Fallback: print current window
    window.print();
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="lo">
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Noto Sans Lao', 'Plus Jakarta Sans', sans-serif;
          }
          body {
            background: #ffffff;
            color: #0f172a;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          @page {
            size: auto;
            margin: 10mm;
          }
          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        ${element.outerHTML}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
