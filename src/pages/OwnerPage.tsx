import { Link } from "react-router-dom";
import {
  Lock,
  DollarSign,
  Building2,
  FileText,
  Database,
  ArrowLeft,
  Clock,
} from "lucide-react";
import { PageContainer } from "@/components/common/PageContainer";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function OwnerPage() {
  const futureModules = [
    {
      icon: <DollarSign className="h-6 w-6 text-emerald-500" />,
      title: "ຈັດການລາຄາ ແລະ ສິນຄ້າ (Products & Pricing)",
      description: "ແກ້ໄຂລາຄາວັດສະດຸໄວນິວ, ສະຕິກເກີ, ອະຄຣີລິກ, ລະບົບໄຟ LED, ແລະ ເພີ່ມລາຍການສິນຄ້າໃໝ່.",
    },
    {
      icon: <Building2 className="h-6 w-6 text-primary" />,
      title: "ຂໍ້ມູນທຸລະກິດ (Business Information)",
      description: "ແກ້ໄຂຊື່ຮ້ານ, ໂລໂກ້, ຊ່ອງທາງຕິດຕໍ່, ເບີໂທ, WhatsApp, ແລະ ບັນຊີທະນາຄານ.",
    },
    {
      icon: <FileText className="h-6 w-6 text-blue-500" />,
      title: "ຕັ້ງຄ່າເອກະສານ (Document Settings)",
      description: "ກຳນົດເລກທີ Running No. ຂອງໃບສະເໜີລາຄາ (Quotation), ໃບແຈ້ງໜີ້ (Invoice), ແລະ ເງື່ອນໄຂການຊຳລະ.",
    },
    {
      icon: <Database className="h-6 w-6 text-amber-500" />,
      title: "ສຳຮອງ ແລະ ກູ້ຄືນຂໍ້ມູນ (Backup / Restore)",
      description: "ສົ່ງອອກຂໍ້ມູນທັງໝົດເປັນໄຟລ໌ JSON ແລະ ນຳເຂົ້າຂໍ້ມູນສຳຮອງໂດຍບໍ່ຕ້ອງເພິ່ງພາຖານຂໍ້ມູນພາຍນອກ.",
    },
  ];

  return (
    <PageContainer size="default">
      {/* Page Header */}
      <SectionHeading
        badge="ລະບົບຈັດການສຳລັບເຈົ້າຂອງຮ້ານ"
        title="Owner Settings & Administration"
        subtitle="ພື້ນທີ່ຈັດການຂໍ້ມູນຮ້ານ, ປັບປຸງລາຄາສິນຄ້າ ແລະ ການຕັ້ງຄ່າເອກະສານ"
      />

      {/* Security & In-Progress Alert Banner */}
      <div className="mb-12 rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card to-orange-500/10 p-8 sm:p-10 text-center shadow-lg max-w-3xl mx-auto">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
          <Lock className="h-8 w-8" />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-semibold text-orange-600 dark:text-orange-400 mb-3">
          <Clock className="h-3.5 w-3.5" />
          <span>ໂຄງສ້າງໜ້າຮອງຮັບ (Placeholder Mode)</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-foreground">
          ລະບົບຈັດການເຈົ້າຂອງຮ້ານຈະເປີດໃຊ້ງານໃນຂັ້ນຕອນຖັດໄປ
        </h3>

        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
          ລະບົບຄວາມປອດໄພດ້ວຍລະຫັດ PIN, ການແກ້ໄຂລາຄາສິນຄ້າ, ແລະ ການສຳຮອງຂໍ້ມູນ LocalStorage/JSON ຈະຖືກນຳມາເຊື່ອມຕໍ່ໃນຂັ້ນຕອນຕໍ່ໄປຕາມແຜນງານ.
        </p>

        <div className="mt-6 flex justify-center">
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>ກັບຄືນສູ່ໜ້າຫຼັກ</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Feature Preview Cards */}
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center sm:text-left mb-6">
          <Badge variant="orange" className="mb-2 text-xs">
            ລະບົບຈັດການທີ່ຈະພ້ອມໃຊ້ງານ
          </Badge>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            ຟັງຊັນທີ່ຈະເປີດໃຫ້ເຈົ້າຂອງຮ້ານຈັດການໄດ້ດ້ວຍຕົນເອງ
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {futureModules.map((m, idx) => (
            <Card
              key={idx}
              className="border-border/80 bg-card hover:border-primary/40 transition-colors"
            >
              <CardContent className="p-6 space-y-3">
                <div className="rounded-xl bg-muted p-2.5 w-fit">{m.icon}</div>
                <h4 className="text-base font-bold text-foreground">{m.title}</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {m.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
