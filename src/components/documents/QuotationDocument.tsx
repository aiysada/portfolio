/**
 * Indie Sign — Quotation Document Template
 * Standard A4 printable and downloadable Quotation layout with Lao typography.
 */

import React from "react";
import type { DocumentData } from "@/types/documents";
import { formatMoney, formatAreaM2 } from "@/lib/money";
import { formatDateLao } from "@/lib/documentNumbering";

interface QuotationDocumentProps {
  data: DocumentData;
}

export const QuotationDocument: React.FC<QuotationDocumentProps> = ({ data }) => {
  return (
    <div
      id="quotation-print-root"
      className="w-full max-w-[800px] mx-auto bg-white text-slate-900 p-8 sm:p-10 font-lao border border-slate-200 shadow-sm print:border-none print:shadow-none print:p-0 text-sm leading-normal"
      style={{ fontFamily: "'Noto Sans Lao', 'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── Header: Logo + Business Info + Document Meta ── */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b-2 border-orange-500">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-9 w-9 rounded-lg bg-orange-500 flex items-center justify-center text-white font-extrabold text-lg">
              IS
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {data.business.name || "Indie Sign"}
            </h1>
          </div>
          <p className="text-xs font-semibold text-orange-600">
            {data.business.nameLao || "ຮ້ານ ອິນດີ້ ຊາຍ (Indie Sign)"}
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            {data.business.taglineLao || "ຄົບທຸກວຽກປ້າຍ ອອກແບບ ຜະລິດ ແລະຕິດຕັ້ງ"}
          </p>
          <div className="text-xs text-slate-600 mt-2 space-y-0.5">
            <p>ໂທ: {data.business.phone || "+856 20 5856 3868"}</p>
            {data.business.addressLao && <p>ທີ່ຢູ່: {data.business.addressLao}</p>}
            {data.business.taxId && <p>ເລກປະຈຳຕົວຜູ້ເສຍພາສີ: {data.business.taxId}</p>}
          </div>
        </div>

        <div className="text-right">
          <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 font-bold text-xs uppercase tracking-wider rounded-md border border-orange-200 mb-2">
            ໃບສະເໜີລາຄາ
          </span>
          <h2 className="text-xl font-bold text-slate-900">QUOTATION</h2>
          <div className="text-xs text-slate-600 mt-2 space-y-1">
            <p>
              <strong className="text-slate-800">ເລກທີ:</strong> {data.number}
            </p>
            <p>
              <strong className="text-slate-800">ວັນທີອອກ:</strong>{" "}
              {formatDateLao(data.issueDate)}
            </p>
            {data.validUntilDate && (
              <p className="text-orange-600 font-medium">
                <strong>ກຳນົດໃຊ້ຮອດ:</strong> {formatDateLao(data.validUntilDate)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Customer Info ── */}
      <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          ຂໍ້ມູນລູກຄ້າ / ຜູ້ຮັບໃບສະເໜີລາຄາ (Customer Details):
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-slate-500">ຊື່ລູກຄ້າ / ບໍລິສັດ:</p>
            <p className="font-bold text-slate-900 text-sm">
              {data.customer.name || "ລູກຄ້າທົ່ວໄປ (General Customer)"}
            </p>
          </div>
          <div>
            <p className="text-slate-500">ເບີໂທລະສັບ / WhatsApp:</p>
            <p className="font-semibold text-slate-900">
              {data.customer.phone || "-"}
            </p>
          </div>
          {data.customer.company && (
            <div className="sm:col-span-2">
              <p className="text-slate-500">ໜ່ວຍງານ / ບໍລິສັດ:</p>
              <p className="font-medium text-slate-900">{data.customer.company}</p>
            </div>
          )}
          {data.customer.address && (
            <div className="sm:col-span-2">
              <p className="text-slate-500">ສະຖານທີ່ຕິດຕັ້ງ / ຈັດສົ່ງ:</p>
              <p className="font-medium text-slate-900">{data.customer.address}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Items Table ── */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold border-y border-slate-300">
              <th className="py-2.5 px-3 w-10 text-center">ລ/ດ</th>
              <th className="py-2.5 px-3">ລາຍການສິນຄ້າ / ວຽກປ້າຍ</th>
              <th className="py-2.5 px-3 text-center">ຂະໜາດ</th>
              <th className="py-2.5 px-3 text-center">ເນື້ອທີ່ (m²)</th>
              <th className="py-2.5 px-3 text-center">ຈຳນວນ</th>
              <th className="py-2.5 px-3 text-right">ລາຄາຕໍ່ໜ່ວຍ</th>
              <th className="py-2.5 px-3 text-right">ມູນຄ່າລວມ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.items.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-50/50">
                <td className="py-2.5 px-3 text-center text-slate-500">{idx + 1}</td>
                <td className="py-2.5 px-3">
                  <div className="font-bold text-slate-900">{item.productNameLao}</div>
                  {item.productNameEn && (
                    <div className="text-[11px] text-slate-500">{item.productNameEn}</div>
                  )}
                  {item.notes && (
                    <div className="text-[11px] text-orange-600 mt-0.5">
                      ໝາຍເຫດ: {item.notes}
                    </div>
                  )}
                </td>
                <td className="py-2.5 px-3 text-center text-slate-600">
                  {item.pricingMethod === "per_m2"
                    ? `${item.width} x ${item.height} ${item.dimensionUnit}`
                    : "-"}
                </td>
                <td className="py-2.5 px-3 text-center text-slate-600 font-medium">
                  {item.pricingMethod === "per_m2" ? formatAreaM2(item.areaM2) : "-"}
                </td>
                <td className="py-2.5 px-3 text-center font-semibold text-slate-900">
                  {item.quantity}
                </td>
                <td className="py-2.5 px-3 text-right text-slate-700 font-medium">
                  {formatMoney(item.unitPrice)}
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                  {formatMoney(item.effectiveSubtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Summary & Charges Breakdown ── */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-2 pb-6 border-b border-slate-200">
        {/* Left: Notes & Terms */}
        <div className="sm:col-span-7 space-y-3">
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              ເງື່ອນໄຂ ແລະ ຂໍ້ກຳນົດ (Terms & Conditions):
            </h4>
            <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4 leading-relaxed">
              <li>ໃບສະເໜີລາຄານີ້ມີຜົນບັງຄັບໃຊ້ 15 ວັນ ນັບຈາກວັນທີອອກເອກະສານ.</li>
              <li>ລາຄານີ້ເປັນລາຄາປະເມີນເບື້ອງຕົ້ນ, ຕ້ອງໄດ້ຮັບການຢືນຢັນຈາກ Indie Sign ກ່ອນການຜະລິດ.</li>
              <li>ລາຍລະອຽດສະເພາະ ແລະ ລາຄາ ແມ່ນອີງຕາມລາຍການ ແລະ ຂະໜາດທີ່ລະບຸໄວ້ຂ້າງເທິງ.</li>
              {data.notes && <li className="text-orange-700 font-medium">{data.notes}</li>}
            </ul>
          </div>
        </div>

        {/* Right: Calculations */}
        <div className="sm:col-span-5 space-y-1.5 text-xs">
          <div className="flex justify-between py-1 text-slate-600">
            <span>ຍອດລວມສິນຄ້າ:</span>
            <span className="font-semibold text-slate-900">
              {formatMoney(data.linesSubtotal)}
            </span>
          </div>

          {data.charges.designFee > 0 && (
            <div className="flex justify-between py-1 text-slate-600">
              <span>ຄ່າອອກແບບ:</span>
              <span className="font-medium text-slate-900">
                +{formatMoney(data.charges.designFee)}
              </span>
            </div>
          )}

          {data.charges.laborFee > 0 && (
            <div className="flex justify-between py-1 text-slate-600">
              <span>ຄ່າແຮງງານ:</span>
              <span className="font-medium text-slate-900">
                +{formatMoney(data.charges.laborFee)}
              </span>
            </div>
          )}

          {data.charges.installationFee > 0 && (
            <div className="flex justify-between py-1 text-slate-600">
              <span>ຄ່າຕິດຕັ້ງ:</span>
              <span className="font-medium text-slate-900">
                +{formatMoney(data.charges.installationFee)}
              </span>
            </div>
          )}

          {data.charges.deliveryFee > 0 && (
            <div className="flex justify-between py-1 text-slate-600">
              <span>ຄ່າຈັດສົ່ງ:</span>
              <span className="font-medium text-slate-900">
                +{formatMoney(data.charges.deliveryFee)}
              </span>
            </div>
          )}

          {data.charges.extraServicesTotal > 0 && (
            <div className="flex justify-between py-1 text-slate-600">
              <span>ບໍລິການເສີມພິເສດ:</span>
              <span className="font-medium text-slate-900">
                +{formatMoney(data.charges.extraServicesTotal)}
              </span>
            </div>
          )}

          <div className="flex justify-between py-1 text-slate-700 border-t border-slate-200 font-medium">
            <span>ລວມກ່ອນຫຼຸດຜ່ອນ:</span>
            <span>{formatMoney(data.subtotalBeforeDiscount)}</span>
          </div>

          {data.discountAmount > 0 && (
            <div className="flex justify-between py-1 text-emerald-600 font-medium">
              <span>ສ່ວນຫຼຸດ:</span>
              <span>-{formatMoney(data.discountAmount)}</span>
            </div>
          )}

          {data.taxAmount > 0 && (
            <div className="flex justify-between py-1 text-slate-600">
              <span>ອາກອນມູນຄ່າເພີ່ມ (VAT):</span>
              <span className="font-medium text-slate-900">
                +{formatMoney(data.taxAmount)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-2 px-3 mt-2 rounded-lg bg-orange-500 text-white font-extrabold text-sm sm:text-base">
            <span>ຍອດລວມສຸດທິ:</span>
            <span>{formatMoney(data.total)}</span>
          </div>
        </div>
      </div>

      {/* ── Signatures ── */}
      <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
        <div>
          <div className="h-16 border-b border-dashed border-slate-400 mb-2"></div>
          <p className="font-bold text-slate-800">ລາຍເຊັນລູກຄ້າ / ຜູ້ສັ່ງຊື້</p>
          <p className="text-[11px] text-slate-500">Customer's Signature</p>
          <p className="text-[11px] text-slate-400 mt-1">ວັນທີ: ..... / ..... / .........</p>
        </div>

        <div>
          <div className="h-16 border-b border-dashed border-slate-400 mb-2"></div>
          <p className="font-bold text-slate-800">ຜູ້ຕາງໜ້າ Indie Sign</p>
          <p className="text-[11px] text-slate-500">Authorized Signature</p>
          <p className="text-[11px] text-slate-400 mt-1">ວັນທີ: ..... / ..... / .........</p>
        </div>
      </div>
    </div>
  );
};
