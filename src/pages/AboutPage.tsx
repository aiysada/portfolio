import { Link } from "react-router-dom";
import { Sparkles, Layers, Target, CheckCircle2, ArrowRight } from "lucide-react";
import { PageContainer } from "@/components/common/PageContainer";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BUSINESS_CONFIG } from "@/constants/business";

export function AboutPage() {
  const servicePillars = [
    {
      icon: <Layers className="h-6 w-6 text-primary" />,
      title: "ເນັ້ນໃສ່ການອອກແບບ, ຜະລິດ ແລະ ຕິດຕັ້ງປ້າຍ",
      description: "ພວກເຮົາໃຫ້ຄວາມສຳຄັນກັບຄວາມຖືກຕ້ອງຕາມແບບ, ຄວາມທົນທານຂອງວັດສະດຸ ແລະ ຄວາມປອດໄພໃນການຕິດຕັ້ງ.",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-amber-500" />,
      title: "ຄອບຄຸມທັງງານປ້າຍໂຄສະນາ ແລະ ງານພິມ",
      description: "ຮອງຮັບຕັ້ງແຕ່ປ້າຍກ່ອງໄຟ LED, ປ້າຍຕົວອັກສອນ 3 ມິຕິ, ຜ້າໃບໄວນິວ, ສະຕິກເກີ, ຈົນເຖິງນາມບັດ ແລະ ງານກຣາຟິກ.",
    },
    {
      icon: <Target className="h-6 w-6 text-orange-600" />,
      title: "ເປົ້າໝາຍຊ່ວຍໃຫ້ນຳສະເໜີແບຣນໄດ້ຢ່າງຊັດເຈນ",
      description: "ຊ່ວຍໃຫ້ຮ້ານຄ້າ, ບໍລິສັດ ແລະ ອົງກອນ ສື່ສານເອກະລັກຂອງທຸລະກິດໃຫ້ໂດດເດັ່ນ, ຈື່ຈຳງ່າຍ ແລະ ເປັນມືອາຊີບ.",
    },
  ];

  const focusPoints = [
    "ປ້າຍກ່ອງໄຟ LED & Neon Flex ສຳລັບຮ້ານຄ້າ ແລະ ຮ້ານອາຫານ",
    "ປ້າຍຕົວອັກສອນສະແຕນເລດ ແລະ ອະຄຣີລິກສຳລັບສຳນັກງານ ແລະ ອາຄານ",
    "ງານພິມຜ້າໃບໄວນິວຫຼັງດຳ & ຫຼັງຂາວ ສຳລັບປ້າຍກາງແຈ້ງ ແລະ ບິລບອດ",
    "ງານພິມສະຕິກເກີຄົມຊັດສູງ ຕິດກະຈົກ ແລະ ພາຫະນະ",
    "ອອກແບບໂລໂກ້ ແລະ ພາບຈຳລອງ 3D ກ່ອນລົງມືຜະລິດຈິງ",
  ];

  return (
    <PageContainer>
      {/* Page Header */}
      <SectionHeading
        badge="ກ່ຽວກັບ Indie Sign"
        title="ກ່ຽວກັບພວກເຮົາ (About Indie Sign)"
        subtitle={BUSINESS_CONFIG.sloganLao}
      />

      {/* Main Narrative Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {BUSINESS_CONFIG.brandName}
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-foreground leading-snug">
            ຊ່ວຍໃຫ້ທຸລະກິດຂອງທ່ານ ສື່ສານພາບລັກໄດ້ຢ່າງໂດດເດັ່ນ ແລະ ຊັດເຈນ
          </h3>

          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
            <strong>Indie Sign</strong> ເປັນທຸລະກິດທີ່ເນັ້ນໃສ່ການອອກແບບ, ຜະລິດ ແລະ ຕິດຕັ້ງປ້າຍໂຄສະນາທຸກຮູບແບບ
            ລວມທັງງານພິມດິຈິຕອນຄົບວົງຈອນ.
          </p>

          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
            ເປົ້າໝາຍຫຼັກຂອງພວກເຮົາ ແມ່ນການຊ່ວຍໃຫ້ຜູ້ປະກອບການ, ຮ້ານຄ້າ ແລະ ທຸລະກິດທຸກຂະໜາດ ສາມາດນຳສະເໜີແບຣນ
            ແລະ ຂໍ້ຄວາມໂຄສະນາຜ່ານປ້າຍທີ່ມີຄຸນນະພາບ, ສວຍງາມ, ທົນທານຕໍ່ສະພາບແວດລ້ອມ ແລະ ຄຸ້ມຄ່າຕໍ່ການລົງທຶນ.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Button asChild variant="orangeGlow" className="rounded-xl">
              <Link to="/services" className="flex items-center gap-2">
                <span>ເບິ່ງລາຍການບໍລິການ</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/portfolio">ເບິ່ງຕົວຢ່າງຜົນງານ</Link>
            </Button>
          </div>
        </div>

        {/* Focus Checklist Card */}
        <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-4">
          <h4 className="text-base sm:text-lg font-bold text-foreground border-b border-border/60 pb-3">
            ຂອບເຂດວຽກບໍລິການຫຼັກ
          </h4>

          <div className="space-y-3">
            {focusPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{point}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border/60 text-xs text-muted-foreground">
            <p>
              ຕິດຕໍ່ສອບຖາມ ຫຼື ປຶກສາແນວທາງງານປ້າຍໄດ້ຜ່ານ WhatsApp:{" "}
              <a
                href={BUSINESS_CONFIG.social.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                {BUSINESS_CONFIG.contact.displayPhone}
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Core Principles Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {servicePillars.map((p, i) => (
          <Card key={i} className="border-border/80 bg-card hover:border-primary/40 transition-colors">
            <CardHeader>
              <div className="mb-2 rounded-xl bg-primary/10 p-2.5 w-fit">
                {p.icon}
              </div>
              <CardTitle className="text-base font-bold text-foreground">
                {p.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {p.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
