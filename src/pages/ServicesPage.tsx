import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { PageContainer } from "@/components/common/PageContainer";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  SERVICE_CATEGORIES,
  SERVICES_DATA,
  type ServiceCategory,
} from "@/data/servicesData";
import { formatLAK } from "@/lib/formatters";
import { BUSINESS_CONFIG } from "@/constants/business";
import { cn } from "@/lib/utils";

export function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | "all">("all");

  const filteredServices = activeCategory === "all"
    ? SERVICES_DATA
    : SERVICES_DATA.filter((s) => s.category === activeCategory);

  return (
    <PageContainer>
      {/* Page Header */}
      <SectionHeading
        badge="ລາຍການສິນຄ້າ ແລະ ບໍລິການ"
        title="ບໍລິການອອກແບບ ແລະ ຜະລິດປ້າຍຄົບວົງຈອນ"
        subtitle="ລາຍການວັດສະດຸ, ງານພິມ, ແລະ ປະເພດປ້າຍມາດຕະຖານ ພ້ອມລາຄາເລີ່ມຕົ້ນທີ່ໂປ່ງໃສ"
        action={
          <Button asChild size="sm" className="rounded-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-sm shadow-orange-500/25">
            <Link to="/order" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span>ສັ່ງເຮັດປ້າຍ & ປະເມີນລາຄາ</span>
            </Link>
          </Button>
        }
      />

      {/* Transparent Pricing Disclaimer Alert */}
      <div className="mb-10 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 flex items-start gap-3.5">
        <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          <p className="font-semibold text-foreground mb-0.5">
            ຂໍ້ຄວນຮູ້ກ່ຽວກັບລາຄາເລີ່ມຕົ້ນ (Preliminary Starting Prices):
          </p>
          <p>
            ລາຄາທີ່ສະແດງລຸ່ມນີ້ເປັນ <strong>ລາຄາປະເມີນເລີ່ມຕົ້ນມາດຕະຖານ</strong> ເຊິ່ງລາຄາສຸດທິຕົວຈິງອາດມີການປ່ຽນແປງຂຶ້ນກັບ:
            ຂະໜາດຕົວຈິງ (ກວ້າງ x ສູງ), ຄວາມໜາຂອງວັດສະດຸ, ສະເປັກລະບົບໄຟ LED, ຄວາມຍາກງ່າຍຂອງການຕິດຕັ້ງ, ແລະ ຄວາມຕ້ອງການສະເພາະຂອງແຕ່ລະໜ້າວຽກ.
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="mb-10 flex flex-wrap items-center gap-2 pb-2">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            activeCategory === "all"
              ? "bg-primary text-primary-foreground shadow-sm shadow-orange-500/20"
              : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          ທັງໝົດ ({SERVICES_DATA.length})
        </button>

        {SERVICE_CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm shadow-orange-500/20"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span>{cat.nameLao}</span>
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card
            key={service.id}
            className="flex flex-col justify-between border-border/80 bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-200"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge variant={service.popular ? "orange" : "outline"} className="text-[11px]">
                  {service.category === "vinyl-sticker" && "ງານພິມ / ໄວນິວ"}
                  {service.category === "lightbox" && "ປ້າຍໄຟ LED"}
                  {service.category === "acrylic-letter" && "ອະຄຣີລິກ / 3D"}
                  {service.category === "graphic-design" && "ງານອອກແບບ"}
                  {service.category === "print-small" && "ງານພິມຂະໜາດນ້ອຍ"}
                  {service.category === "installation" && "ງານຕິດຕັ້ງ"}
                </Badge>

                {service.popular && (
                  <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold text-orange-600 dark:text-orange-400">
                    ຍອດນິຍົມ
                  </span>
                )}
              </div>

              <CardTitle className="text-lg font-bold text-foreground">
                {service.titleLao}
              </CardTitle>
              <p className="text-xs text-muted-foreground font-sans">
                {service.titleEn}
              </p>
            </CardHeader>

            <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {service.descriptionLao}
              </p>

              {/* Price Highlight (Featuring 130,000, 120,000, 250,000 etc.) */}
              <div className="rounded-xl border border-border/60 bg-muted/40 p-3.5 space-y-1">
                <div className="text-[11px] text-muted-foreground font-medium">ລາຄາເລີ່ມຕົ້ນປະມານ:</div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-primary font-sans tracking-tight">
                    {formatLAK(service.startingPrice)}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    / {service.unit}
                  </span>
                </div>
                {service.priceNote && (
                  <p className="text-[11px] text-muted-foreground leading-tight pt-1">
                    * {service.priceNote}
                  </p>
                )}
              </div>

              {/* Features List */}
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {service.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button linking to Calculator */}
              <div className="pt-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full justify-between hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-lg transition-colors group"
                >
                  <Link to="/order">
                    <span>ສັ່ງເຮັດປ້າຍປະເພດນີ້</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Prompt Footer Banner */}
      <div className="mt-16 rounded-2xl border border-border bg-card p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            ຕ້ອງການໃບສະເໜີລາຄາ ຫຼື ປ້າຍຂະໜາດພິເສດ?
          </h3>
          <p className="text-sm text-muted-foreground max-w-xl">
            ຕິດຕໍ່ທີມງານ Indie Sign ໄດ້ທັນທີ ຫຼື ຕອບຊຸດສອບຖາມຄວາມຕ້ອງການເພື່ອປະເມີນລາຄາໄດ້ທັນທີ.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <Button asChild size="default" className="rounded-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/25">
            <Link to="/order" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span>ສັ່ງເຮັດປ້າຍ & ປະເມີນລາຄາ</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="rounded-xl">
            <a href={BUSINESS_CONFIG.social.whatsappUrl} target="_blank" rel="noopener noreferrer">
              <span>ສອບຖາມຜ່ານ WhatsApp</span>
            </a>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
