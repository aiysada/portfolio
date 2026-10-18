/**
 * Step 5 — Customer Form + PDF Download
 * Collects customer info and triggers quotation PDF generation.
 */

import { useState } from "react";
import { User, Building2, Phone, Mail, MapPin, FileDown, ChevronRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CustomerInfo } from "@/types/quote";
import { formatLAK } from "@/lib/calculator";

interface CustomerFormProps {
  customer: CustomerInfo;
  total: number;
  onChange: (customer: CustomerInfo) => void;
  onDownloadPDF: () => void;
}

export function CustomerForm({ customer, total, onChange, onDownloadPDF }: CustomerFormProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});

  const update = (field: keyof CustomerInfo, value: string) => {
    onChange({ ...customer, [field]: value });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerInfo, string>> = {};
    if (!customer.name.trim()) newErrors.name = "ກະລຸນາໃສ່ຊື່ລູກຄ້າ";
    if (!customer.phone.trim()) newErrors.phone = "ກະລຸນາໃສ່ເບີໂທ";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDownload = () => {
    if (validate()) {
      onDownloadPDF();
    }
  };

  return (
    <div className="space-y-8">
      {/* Total reminder */}
      <div className="rounded-2xl bg-primary px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-primary-foreground/70">ລາຄາລວມໃນໃບສະເໜີ</p>
          <p className="text-2xl font-extrabold font-sans text-primary-foreground">{formatLAK(total)}</p>
        </div>
        <Badge className="bg-white/20 text-white border-white/30 text-xs">ຮ່າງ</Badge>
      </div>

      {/* Customer fields */}
      <div className="space-y-6">
        {/* Name (required) */}
        <div className="space-y-2">
          <Label htmlFor="cust-name" className="flex items-center gap-1.5 text-sm font-semibold">
            <User className="h-4 w-4 text-primary" />
            ຊື່ລູກຄ້າ / Customer Name <span className="text-destructive ml-0.5">*</span>
          </Label>
          <Input
            id="cust-name"
            value={customer.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="ເຊັ່ນ: ທ. ສົມໃຈ ໄຊຍະສິດ"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        {/* Company (optional) */}
        <div className="space-y-2">
          <Label htmlFor="cust-company" className="flex items-center gap-1.5 text-sm font-semibold">
            <Building2 className="h-4 w-4 text-primary" />
            ບໍລິສັດ / ຮ້ານ (ຖ້າມີ)
          </Label>
          <Input
            id="cust-company"
            value={customer.company ?? ""}
            onChange={(e) => update("company", e.target.value)}
            placeholder="ເຊັ່ນ: ຮ້ານ XY Coffee & Bakery"
          />
        </div>

        {/* Phone (required) */}
        <div className="space-y-2">
          <Label htmlFor="cust-phone" className="flex items-center gap-1.5 text-sm font-semibold">
            <Phone className="h-4 w-4 text-primary" />
            ເບີໂທ / Phone <span className="text-destructive ml-0.5">*</span>
          </Label>
          <Input
            id="cust-phone"
            type="tel"
            value={customer.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="020 xxxxxxxx"
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
        </div>

        {/* Email (optional) */}
        <div className="space-y-2">
          <Label htmlFor="cust-email" className="flex items-center gap-1.5 text-sm font-semibold">
            <Mail className="h-4 w-4 text-primary" />
            ອີເມລ (ທາງເລືອກ)
          </Label>
          <Input
            id="cust-email"
            type="email"
            value={customer.email ?? ""}
            onChange={(e) => update("email", e.target.value)}
            placeholder="example@email.com"
          />
        </div>

        {/* Address (optional) */}
        <div className="space-y-2">
          <Label htmlFor="cust-addr" className="flex items-center gap-1.5 text-sm font-semibold">
            <MapPin className="h-4 w-4 text-primary" />
            ທີ່ຢູ່ / ສະຖານທີ່ (ທາງເລືອກ)
          </Label>
          <Input
            id="cust-addr"
            value={customer.address ?? ""}
            onChange={(e) => update("address", e.target.value)}
            placeholder="ເຊັ່ນ: ບ. ໂພນສະອາດ, ເມືອງຈັນທະບູລີ, ວຽງຈັນ"
          />
        </div>
      </div>

      {/* Info note */}
      <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          📄 ຂໍ້ມູນຂ້າງເທິງຈະຖືກໃຊ້ໃນໃບສະເໜີລາຄາ PDF ເທົ່ານັ້ນ. ພວກເຮົາ<strong>ບໍ່ສ່ົງ</strong>ຂໍ້ມູນໄປໃສ່ Server.
        </p>
      </div>

      {/* Download button */}
      <Button
        variant="orangeGlow"
        size="lg"
        onClick={handleDownload}
        className="w-full rounded-xl text-base font-bold gap-2"
      >
        <FileDown className="h-5 w-5" />
        ສ້າງ ແລະ ດາວໂຫລດໃບສະເໜີລາຄາ PDF
        <ChevronRight className="h-4 w-4 ml-auto" />
      </Button>
    </div>
  );
}
