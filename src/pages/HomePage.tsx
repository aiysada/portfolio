import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
  Lightbulb,
  Printer,
  PenTool,
  FileSpreadsheet,
  Wrench,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  ClipboardList,
} from "lucide-react";
import { PageContainer } from "@/components/common/PageContainer";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BUSINESS_CONFIG } from "@/constants/business";
import { PORTFOLIO_ITEMS } from "@/data/portfolioData";
import { SERVICE_CATEGORIES } from "@/data/servicesData";

export function HomePage() {
  const featuredPortfolio = PORTFOLIO_ITEMS.filter((item) => item.featured).slice(0, 4);

  const categoryIcons: Record<string, React.ReactNode> = {
    Printer: <Printer className="h-6 w-6 text-primary" />,
    Lightbulb: <Lightbulb className="h-6 w-6 text-amber-500" />,
    Layers: <Layers className="h-6 w-6 text-orange-600" />,
    PenTool: <PenTool className="h-6 w-6 text-primary" />,
    FileSpreadsheet: <FileSpreadsheet className="h-6 w-6 text-amber-600" />,
    Wrench: <Wrench className="h-6 w-6 text-orange-500" />,
  };

  const whyChooseUs = [
    {
      title: "ຄົບທຸກວຽກປ້າຍໃນບ່ອນດຽວ",
      description: "ຕັ້ງແຕ່ປ້າຍໄຟ, ຕົວອັກສອນ 3D, ງານພິມໄວນິວ, ສະຕິກເກີ, ຈົນເຖິງນາມບັດ ແລະ ງານກຣາຟິກ.",
    },
    {
      title: "ອອກແບບຕາມຄວາມຕ້ອງການສະເພາະ",
      description: "ໃຫ້ຄຳປຶກສາ ແລະ ປັບແຕ່ງຂະໜາດ, ໂທນສີ, ແລະ ວັດສະດຸໃຫ້ເຂົ້າກັບເອກະລັກແບຣນ ແລະ ງົບປະມານຂອງທ່ານ.",
    },
    {
      title: "ດູແລຄົບວົງຈອນ Design to Install",
      description: "ທີມງານດູແລທຸກຂັ້ນຕອນ ຕັ້ງແຕ່ສຳຫຼວດໜ້າວຽກ, ຂຶ້ນແບບ 3D Mockup, ຜະລິດ ແລະ ຕິດຕັ້ງຢ່າງປອດໄພ.",
    },
    {
      title: "ປະເມີນລາຄາເບື້ອງຕົ້ນຢ່າງໂປ່ງໃສ",
      description: "ມີລະບົບຄຳນວນລາຄາປ້າຍອັດຕະໂນມັດ ຊ່ວຍໃຫ້ທ່ານວາງແຜນງົບປະມານໄດ້ງ່າຍ ແລະ ຊັດເຈນ.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 py-16 sm:py-24 lg:py-28">
        {/* Subtle Background Glows */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 right-0 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-orange-500/15 via-amber-400/10 to-transparent blur-3xl" />
          <div className="absolute top-1/2 -left-32 h-[350px] w-[350px] rounded-full bg-gradient-to-tr from-orange-600/10 via-red-500/5 to-transparent blur-3xl" />
        </div>

        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" />
                <span>Indie Sign — ທຸລະກິດອອກແບບ ແລະ ຜະລິດປ້າຍຄົບວົງຈອນ</span>
              </div>

              {/* Exact Lao Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
                {BUSINESS_CONFIG.sloganLao}
              </h1>

              {/* Concise Supporting Text */}
              <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed mx-auto lg:mx-0">
                ຜູ້ຊ່ຽວຊານດ້ານການອອກແບບ ແລະ ຜະລິດປ້າຍໂຄສະນາຄົບວົງຈອນ ສຳລັບຮ້ານຄ້າ, ບໍລິສັດ, ແລະ ອົງກອນ.
                ພວກເຮົາພ້ອມໃຫ້ຄຳປຶກສາ ແລະ ປະເມີນລາຄາເບື້ອງຕົ້ນຢ່າງວ່ອງໄວ ດ້ວຍມາດຕະຖານວັດສະດຸຄຸນນະພາບສູງ.
              </p>

              {/* Primary CTA (/order) & Secondary CTA (/portfolio) */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-2xl font-bold text-sm sm:text-base px-6 h-13 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 hover:scale-[1.02] transition-all"
                >
                  <Link to="/order" className="flex items-center gap-2.5">
                    <ClipboardList className="h-5 w-5" />
                    <span>ສັ່ງເຮັດປ້າຍ & ປະເມີນລາຄາ</span>
                    <ArrowRight className="h-4 w-4 ml-0.5" />
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg" className="rounded-2xl font-semibold text-sm sm:text-base px-6 h-13 border-border hover:bg-muted/50">
                  <Link to="/portfolio" className="flex items-center gap-2">
                    <span>ເບິ່ງຕົວຢ່າງຜົນງານ</span>
                  </Link>
                </Button>
              </div>

              {/* Key Features Quick Line */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>ວັດສະດຸມາດຕະຖານ</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>ອອກແບບກ່ອນຜະລິດຈິງ</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>ຕິດຕັ້ງປອດໄພ</span>
                </div>
              </div>
            </div>

            {/* Hero Right Signage Visual (Strong signage-related illustration) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border/80 bg-card p-3 shadow-2xl shadow-orange-500/10">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
                  <img
                    src="/images/portfolio/lightbox-sample.svg"
                    alt="ຕົວຢ່າງປ້າຍກ່ອງໄຟ LED Indie Sign"
                    width={600}
                    height={450}
                    fetchPriority="high"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 rounded-md bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-amber-300 backdrop-blur-md">
                    ຕົວຢ່າງປ້າຍກ່ອງໄຟ LED
                  </div>
                </div>
                <div className="p-3 text-center">
                  <p className="text-xs text-muted-foreground">
                    ຮູບແບບປ້າຍຕົວຢ່າງ • ສາມາດປັບແຕ່ງຂະໜາດ ແລະ ຮູບແບບໄດ້ຕາມຕ້ອງການ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 2. Services Overview (Main 6 Service Categories) */}
      <section className="py-16 sm:py-20 bg-muted/20 border-b border-border/40">
        <PageContainer>
          <SectionHeading
            badge="ບໍລິການຂອງພວກເຮົາ"
            title="ໝວດໝູ່ບໍລິການປ້າຍ ແລະ ງານພິມຫຼັກ"
            subtitle="Indie Sign ໃຫ້ບໍລິການວຽກປ້າຍໂຄສະນາຄົບວົງຈອນ ຮອງຮັບທຸກຄວາມຕ້ອງການຂອງທຸລະກິດທ່ານ"
            action={
              <Button asChild variant="outline" size="sm" className="rounded-xl">
                <Link to="/services" className="flex items-center gap-1.5">
                  <span>ເບິ່ງລາຄາ ແລະ ລາຍລະອຽດທັງໝົດ</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_CATEGORIES.map((cat) => (
              <Card
                key={cat.id}
                className="group border-border/80 bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <CardHeader>
                  <div className="mb-3 rounded-xl bg-primary/10 p-3 w-fit transition-transform group-hover:scale-105">
                    {categoryIcons[cat.iconName]}
                  </div>
                  <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                    {cat.nameLao}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground font-sans">
                    {cat.nameEn}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {cat.descriptionLao}
                  </p>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <span>ເບິ່ງຕົວເລືອກ & ລາຄາເລີ່ມຕົ້ນ</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* 3. Featured Portfolio (4 items) */}
      <section className="py-16 sm:py-20 border-b border-border/40">
        <PageContainer>
          <SectionHeading
            badge="ຕົວຢ່າງຜົນງານ"
            title="ຕົວຢ່າງຮູບແບບປ້າຍທີ່ໂດດເດັ່ນ"
            subtitle="ເລືອກຊົມຕົວຢ່າງປ້າຍໂຄສະນາ ແລະ ວັດສະດຸທີ່ Indie Sign ຮັບຜະລິດ"
            action={
              <Button asChild variant="outline" size="sm" className="rounded-xl">
                <Link to="/portfolio" className="flex items-center gap-1.5">
                  <span>ເບິ່ງຄັງຜົນງານທັງໝົດ</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPortfolio.map((item) => (
              <Link
                key={item.id}
                to="/portfolio"
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:border-primary/50 hover:shadow-lg transition-all duration-200 flex flex-col"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  <img
                    src={item.image}
                    alt={item.altTextLao}
                    loading="lazy"
                    width={400}
                    height={300}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/images/portfolio/lightbox-sample.svg";
                    }}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-amber-300 backdrop-blur-sm">
                    ຕົວຢ່າງ
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {item.titleLao}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {item.descriptionLao}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-border/60 text-[11px] text-primary font-medium flex items-center justify-between">
                    <span>ເບິ່ງລາຍລະອຽດ</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* 4. Why Choose Indie Sign (Grounded & Non-exaggerated) */}
      <section className="py-16 sm:py-20 bg-muted/20 border-b border-border/40">
        <PageContainer>
          <SectionHeading
            badge="ຈຸດເດັ່ນຂອງພວກເຮົາ"
            title="ເຫດຜົນທີ່ຄວນເລືອກ Indie Sign"
            subtitle="ພວກເຮົາເນັ້ນໃສ່ຄວາມຖືກຕ້ອງ, ຄຸນນະພາບວັດສະດຸ, ແລະ ຄວາມສະດວກສະບາຍຂອງລູກຄ້າ"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* 5. Closing CTA */}
      <section className="py-16 sm:py-20">
        <PageContainer>
          <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card to-orange-500/10 p-8 sm:p-14 text-center max-w-4xl mx-auto shadow-xl">
            <Badge variant="orange" className="mb-4 text-xs font-semibold">
              ເລີ່ມຕົ້ນໂຄງການປ້າຍຂອງທ່ານມື້ນີ້
            </Badge>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-snug">
              ພ້ອມໃຫ້ຄຳປຶກສາ ແລະ ປະເມີນລາຄາປ້າຍ
            </h2>

            <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-muted-foreground leading-relaxed">
              ທ່ານສາມາດທົດລອງຄຳນວນລາຄາເບື້ອງຕົ້ນດ້ວຍຕົນເອງ ຫຼື ສົ່ງຂະໜາດ ແລະ ຮູບແບບປ້າຍທີ່ຕ້ອງການມາໃຫ້ທີມງານຂອງພວກເຮົາປະເມີນຜ່ານ WhatsApp ໄດ້ທັນທີ.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-2xl font-bold text-sm sm:text-base px-7 h-13 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/30 hover:scale-[1.02] transition-all"
              >
                <Link to="/order" className="flex items-center gap-2.5">
                  <ClipboardList className="h-5 w-5" />
                  <span>ສັ່ງເຮັດປ້າຍ & ປະເມີນລາຄາ</span>
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="rounded-xl font-medium">
                <a
                  href={BUSINESS_CONFIG.social.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-5 w-5 text-emerald-500" />
                  <span>ຕິດຕໍ່ສອບຖາມຜ່ານ WhatsApp</span>
                </a>
              </Button>

              <Button asChild variant="ghost" size="lg" className="rounded-xl">
                <a href={`tel:${BUSINESS_CONFIG.contact.phone}`} className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4 text-primary" />
                  <span>{BUSINESS_CONFIG.contact.displayPhone}</span>
                </a>
              </Button>
            </div>
          </div>
        </PageContainer>
      </section>
    </div>
  );
}
