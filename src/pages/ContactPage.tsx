import { useState } from "react";
import {
  Phone,
  MessageCircle,
  ExternalLink,
  Send,
  HelpCircle,
} from "lucide-react";
import { PageContainer } from "@/components/common/PageContainer";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BUSINESS_CONFIG } from "@/constants/business";

export function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [signType, setSignType] = useState("ປ້າຍກ່ອງໄຟ LED");
  const [details, setDetails] = useState("");

  // Build direct WhatsApp link with prefilled message
  const generateWhatsAppUrl = () => {
    const text = `ສະບາຍດີ Indie Sign,\nຂ້າພະເຈົ້າຊື່: ${name || "-"}\nເບີໂທ: ${phone || "-"}\nສົນໃຈປ້າຍປະເພດ: ${signType}\nລາຍລະອຽດເພີ່ມເຕີມ: ${details || "ຕ້ອງການສອບຖາມລາຄາ ແລະ ປຶກສາແນວທາງ"}`;
    return `${BUSINESS_CONFIG.social.whatsappUrl}?text=${encodeURIComponent(text)}`;
  };

  const handleSendViaWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const url = generateWhatsAppUrl();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <PageContainer>
      {/* Page Header */}
      <SectionHeading
        badge="ຕິດຕໍ່ສອບຖາມ"
        title="ຕິດຕໍ່ Indie Sign (Contact Us)"
        subtitle="ປຶກສາ, ສອບຖາມລາຍລະອຽດວຽກປ້າຍ ແລະ ປະເມີນລາຄາເບື້ອງຕົ້ນກັບທີມງານ"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Information Channel Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. Official WhatsApp Channel (Primary & Verified) */}
          <Card className="border-emerald-500/30 bg-emerald-500/5 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                  <MessageCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <span>WhatsApp ທາງການ (ແນະນຳ)</span>
                </CardTitle>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  ຕອບໄວທີ່ສຸດ
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-xs text-muted-foreground leading-relaxed">
                ສົ່ງຮູບພາບໜ້າວຽກ, ແບບຮ່າງ, ຫຼື ຂະໜາດທີ່ຕ້ອງການມາໃຫ້ທີມງານປະເມີນໄດ້ຕະຫຼອດເວລາ:
              </p>
              <div className="pt-1">
                <a
                  href={BUSINESS_CONFIG.social.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-base font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <span>{BUSINESS_CONFIG.contact.displayPhone}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* 2. Direct Phone Call */}
          <Card className="border-border/80 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                <Phone className="h-5 w-5 text-primary" />
                <span>ເບີໂທລະສັບຕິດຕໍ່</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <a
                href={`tel:${BUSINESS_CONFIG.contact.phone}`}
                className="text-base font-bold text-foreground hover:text-primary transition-colors block"
              >
                {BUSINESS_CONFIG.contact.displayPhone}
              </a>
              <p className="text-xs text-muted-foreground">
                ກົດເພື່ອໂທອອກໄດ້ທັນທີ ສຳລັບສອບຖາມຂໍ້ມູນດ່ວນ
              </p>
            </CardContent>
          </Card>

          {/* 3. Facebook / Messenger Placeholder (No invented URLs) */}
          <Card className="border-border/80 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-foreground">
                ຊ່ອງທາງໂຊຊຽວອື່ນໆ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground leading-relaxed">
              <div className="flex items-center justify-between py-1 border-b border-border/60">
                <span>Facebook Page:</span>
                <span className="font-mono text-[11px] text-muted-foreground/80">
                  {BUSINESS_CONFIG.contact.facebookUrl || "[ກຳນົດໃນລະບົບຈັດການ]"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Messenger:</span>
                <span className="font-mono text-[11px] text-muted-foreground/80">
                  {BUSINESS_CONFIG.contact.facebookMessengerUrl || "[ກຳນົດໃນລະບົບຈັດການ]"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground pt-1">
                * ຊ່ອງທາງ Facebook ແລະ ເບີສຳຮອງ ສາມາດເພີ່ມເຕີມໄດ້ໃນໜ້າ Owner Settings ເມື່ອລະບົບພ້ອມໃຊ້ງານ.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Customer Inquiry Form */}
        <div className="lg:col-span-7">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-foreground">
                ແບບຟອມຝາກຂໍ້ມູນສອບຖາມ
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                ປ້ອນຂໍ້ມູນເບື້ອງຕົ້ນເພື່ອສົ່ງຕໍ່ໄປຍັງ WhatsApp ຂອງທີມງານໄດ້ທັນທີ ໂດຍບໍ່ຕ້ອງພິມຂໍ້ຄວາມໃໝ່.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSendViaWhatsApp} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="inquiry-name" required>
                      ຊື່ຂອງທ່ານ ຫຼື ຊື່ຮ້ານ
                    </Label>
                    <Input
                      id="inquiry-name"
                      placeholder="ຕົວຢ່າງ: ສົມສັກ ຫຼື ຮ້ານກາເຟ ສຸກໃຈ"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="inquiry-phone" required>
                      ເບີໂທລະສັບ (WhatsApp)
                    </Label>
                    <Input
                      id="inquiry-phone"
                      type="tel"
                      placeholder="020 xxxx xxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="inquiry-type">ປະເພດປ້າຍທີ່ຕ້ອງການສອບຖາມ</Label>
                  <Select
                    id="inquiry-type"
                    value={signType}
                    onChange={(e) => setSignType(e.target.value)}
                  >
                    <option value="ປ້າຍກ່ອງໄຟ LED">ປ້າຍກ່ອງໄຟ LED (Light Box)</option>
                    <option value="ປ້າຍຕົວອັກສອນສະແຕນເລດ 3D">ປ້າຍຕົວອັກສອນສະແຕນເລດ 3D (Stainless Letter)</option>
                    <option value="ປ້າຍອະຄຣີລິກເລເຊີ">ປ້າຍອະຄຣີລິກເລເຊີ (Acrylic Sign)</option>
                    <option value="ປ້າຍໄຟນີອອນດັດ Neon Flex">ປ້າຍໄຟນີອອນດັດ (Neon Flex)</option>
                    <option value="ງານພິມໄວນິວຫຼັງດຳ/ຫຼັງຂາວ">ງານພິມໄວນິວຫຼັງດຳ / ຫຼັງຂາວ (Vinyl)</option>
                    <option value="ງານພິມສະຕິກເກີຕິດກະຈົກ/ຕິດລົດ">ງານພິມສະຕິກເກີ (Stickers)</option>
                    <option value="ງານພິມນາມບັດ ແລະ ໃບປິວ">ງານພິມນາມບັດ ແລະ ໃບປິວ (Business Cards)</option>
                    <option value="ອອກແບບໂລໂກ້ ແລະ ກຣາຟິກ">ອອກແບບໂລໂກ້ ແລະ ກຣາຟິກ (Graphic Design)</option>
                    <option value="ປ້າຍຮູບແບບອື່ນໆ">ປ້າຍຮູບແບບອື່ນໆ (Other)</option>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="inquiry-details">
                    ລາຍລະອຽດເພີ່ມເຕີມ / ຂະໜາດໂດຍປະມານ
                  </Label>
                  <textarea
                    id="inquiry-details"
                    rows={4}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="ລະບຸຂະໜາດ ກວ້າງ x ສູງ, ສະຖານທີ່ຕິດຕັ້ງ, ຫຼື ງົບປະມານໂດຍປະມານ..."
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                {/* Honest Submission Transparency Notice */}
                <div className="rounded-xl border border-border/80 bg-muted/40 p-3.5 flex items-start gap-2.5 text-xs text-muted-foreground">
                  <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>ແຈ້ງການ:</strong> ລະບົບເວັບໄຊບໍ່ໄດ້ບັນທຶກຂໍ້ມູນລົງ Server ພາຍນອກ. ເມື່ອກົດປຸ່ມດ້ານລຸ່ມ, ລະບົບຈະເປີດ WhatsApp ພ້ອມຂໍ້ຄວາມທີ່ທ່ານກອກໄວ້ໂດຍກົງ ເພື່ອໃຫ້ທ່ານສົ່ງຫາທີມງານໄດ້ທັນທີ.
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="orangeGlow"
                    size="lg"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl"
                  >
                    <Send className="h-4 w-4" />
                    <span>ສົ່ງຂໍ້ຄວາມສອບຖາມຜ່ານ WhatsApp</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
