/**
 * Indie Sign — Receipt Document Template
 * Compact layout (thermal 80mm roll or standard receipt) with Lao typography.
 * Automatically adapts height to content without clipping.
 */

import React from "react";
import type { DocumentData } from "@/types/documents";
import { formatMoney } from "@/lib/money";
import { formatDateLao } from "@/lib/documentNumbering";

interface ReceiptDocumentProps {
  data: DocumentData;
}

export const ReceiptDocument: React.FC<ReceiptDocumentProps> = ({ data }) => {
  const amountPaid = data.amountPaid ?? data.total;
  const remaining = Math.max(0, data.total - amountPaid);
  const isFullPaid = remaining === 0;

  return (
    <div
      id="receipt-print-root"
      className="w-full max-w-[380px] mx-auto bg-white text-slate-900 p-6 font-lao border border-slate-200 shadow-sm print:border-none print:shadow-none print:p-0 text-xs leading-normal"
      style={{ fontFamily: "'Noto Sans Lao', 'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── Business Header ── */}
      <div className="text-center pb-4 border-b border-dashed border-slate-300">
        <div className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-600 text-white font-extrabold text-sm mb-1.5">
          IS
        </div>
        <h2 className="text-base font-extrabold text-slate-900">
          {data.business.name || "Indie Sign"}
        </h2>
        <p className="text-[11px] text-slate-600 font-medium">
          {data.business.nameLao || "ຮ້ານ ອິນດີ້ ຊາຍ (Indie Sign)"}
        </p>
        <p className="text-[10px] text-slate-500 mt-0.5">
          ໂທ: {data.business.phone || "+856 20 5856 3868"}
        </p>

        <div className="mt-3 inline-block px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[11px] uppercase border border-emerald-200">
          ໃບເສັດຮັບເງິນ (RECEIPT)
        </div>
      </div>

      {/* ── Document & Customer Meta ── */}
      <div className="py-3 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
        <div className="flex justify-between">
          <span className="text-slate-500">ເລກທີໃບເສັດ:</span>
          <span className="font-bold text-slate-900">{data.number}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">ວັນທີ:</span>
          <span className="text-slate-800">{formatDateLao(data.issueDate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">ລູກຄ້າ:</span>
          <span className="font-semibold text-slate-900">
            {data.customer.name || "ລູກຄ້າທົ່ວໄປ"}
          </span>
        </div>
        {data.customer.phone && (
          <div className="flex justify-between">
            <span className="text-slate-500">ເບີໂທ:</span>
            <span className="text-slate-800">{data.customer.phone}</span>
          </div>
        )}
      </div>

      {/* ── Itemized List ── */}
      <div className="py-3 border-b border-dashed border-slate-300">
        <div className="flex justify-between font-bold text-slate-600 text-[10px] uppercase pb-1 mb-1 border-b border-slate-200">
          <span>ລາຍການ</span>
          <span>ຈຳນວນ / ມູນຄ່າ</span>
        </div>
        <div className="space-y-1.5">
          {data.items.map((item) => (
            <div key={item.id} className="flex justify-between items-start text-[11px]">
              <div className="pr-2">
                <p className="font-medium text-slate-900 leading-tight">
                  {item.productNameLao}
                </p>
                {item.pricingMethod === "per_m2" && (
                  <p className="text-[10px] text-slate-500">
                    {item.width}x{item.height} {item.dimensionUnit}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-500 block">
                  x{item.quantity}
                </span>
                <span className="font-semibold text-slate-900">
                  {formatMoney(item.effectiveSubtotal)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Payment Summary ── */}
      <div className="py-3 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
        <div className="flex justify-between text-slate-600">
          <span>ມູນຄ່າສິນຄ້າລວມ:</span>
          <span>{formatMoney(data.linesSubtotal)}</span>
        </div>

        {data.totalCharges > 0 && (
          <div className="flex justify-between text-slate-600">
            <span>ຄ່າບໍລິການເພີ່ມຕື່ມ:</span>
            <span>+{formatMoney(data.totalCharges)}</span>
          </div>
        )}

        {data.discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>ສ່ວນຫຼຸດ:</span>
            <span>-{formatMoney(data.discountAmount)}</span>
          </div>
        )}

        {data.taxAmount > 0 && (
          <div className="flex justify-between text-slate-600">
            <span>ອາກອນ (VAT):</span>
            <span>+{formatMoney(data.taxAmount)}</span>
          </div>
        )}

        <div className="flex justify-between font-bold text-slate-800 pt-1 border-t border-slate-200">
          <span>ມູນຄ່າທັງໝົດ:</span>
          <span>{formatMoney(data.total)}</span>
        </div>

        {/* Amount Received / Paid */}
        <div className="flex justify-between font-extrabold text-emerald-700 pt-1 text-xs">
          <span>ຮັບເງິນແລ້ວ (Paid):</span>
          <span>{formatMoney(amountPaid)}</span>
        </div>

        {/* Remaining Balance */}
        <div className="flex justify-between font-semibold text-xs pt-0.5">
          <span className="text-slate-600">ຍອດເຫຼືອຄ້າງ (Balance):</span>
          <span className={remaining > 0 ? "text-amber-600 font-bold" : "text-slate-700"}>
            {formatMoney(remaining)}
          </span>
        </div>

        {/* Payment Status Badge */}
        <div className="text-center pt-2">
          <span
            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
              isFullPaid
                ? "bg-emerald-100 text-emerald-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {isFullPaid ? "✓ ຊຳລະຄົບຖ້ວນ (PAID IN FULL)" : "⚠ ຊຳລະບາງສ່ວນ (PARTIALLY PAID)"}
          </span>
        </div>

        {data.paymentMethod && (
          <div className="flex justify-between text-[10px] text-slate-500 pt-1">
            <span>ວິທີຊຳລະ:</span>
            <span>{data.paymentMethod}</span>
          </div>
        )}
      </div>

      {/* ── Signature & Thank You ── */}
      <div className="pt-4 text-center space-y-3">
        <p className="text-[11px] font-semibold text-slate-800">
          ຂໍຂອບໃຈທີ່ໃຊ້ບໍລິການ Indie Sign!
        </p>

        <div className="pt-4">
          <div className="w-32 mx-auto border-b border-slate-400 mb-1"></div>
          <p className="text-[10px] text-slate-500">ຜູ້ຮັບເງິນ (Cashier)</p>
        </div>
      </div>
    </div>
  );
};
