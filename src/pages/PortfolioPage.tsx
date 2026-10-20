import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Maximize2, Calculator, ArrowRight, Info } from "lucide-react";
import { PageContainer } from "@/components/common/PageContainer";
import { SectionHeading } from "@/components/common/SectionHeading";
import { PortfolioLightbox } from "@/components/common/PortfolioLightbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_ITEMS,
  type PortfolioCategory,
  type PortfolioItem,
} from "@/data/portfolioData";
import { cn } from "@/lib/utils";

export function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory>("all");
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "all") {
      return PORTFOLIO_ITEMS;
    }
    return PORTFOLIO_ITEMS.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <PageContainer>
      {/* Page Header */}
      <SectionHeading
        badge="ຜົນງານ ແລະ ຕົວຢ່າງປ້າຍ"
        title="ຄັງຮວບຮວມຜົນງານ ແລະ ຮູບແບບປ້າຍ"
        subtitle="ເລືອກຊົມຕົວຢ່າງງານປ້າຍໂຄສະນາແຕ່ລະປະເພດ ເພື່ອເປັນແນວທາງໃນການອອກແບບ ແລະ ຕັດສິນໃຈເລືອກວັດສະດຸ"
        action={
          <Button asChild variant="orangeGlow" size="sm" className="rounded-xl">
            <Link to="/calculator" className="flex items-center gap-1.5">
              <Calculator className="h-4 w-4" />
              <span>ຄຳນວນລາຄາປ້າຍ</span>
            </Link>
          </Button>
        }
      />

      {/* Notice regarding sample entries */}
      <div className="mb-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3 text-xs sm:text-sm text-muted-foreground">
        <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>ໝາຍເຫດ:</strong> ຮູບພາບທັງໝົດໃນໜ້ານີ້ເປັນ <em>ຕົວຢ່າງຮູບແບບປ້າຍ ແລະ ງານອອກແບບ (Sample Demonstrations)</em> ເພື່ອສະແດງສະເປັກວັດສະດຸ ແລະ ແນວທາງງານຜະລິດ ໂດຍບໍ່ໄດ້ອ້າງອີງວ່າເປັນໂຄງການຈິງຂອງລູກຄ້າ. (ເຈົ້າຂອງຮ້ານສາມາດເພີ່ມ ຫຼື ແກ້ໄຂຜົນງານໄດ້ໃນໄຟລ໌ໂຄງການ).
        </p>
      </div>

      {/* Category Filter Buttons (NO SEARCH BOX as required) */}
      <div className="mb-10 flex flex-wrap items-center gap-2 pb-2">
        {PORTFOLIO_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
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

      {/* Responsive Gallery Grid & Empty State */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center my-6 bg-card/50">
          <p className="text-sm font-semibold text-foreground">ຍັງບໍ່ມີລາຍການຜົນງານໃນໝວດໝູ່ນີ້</p>
          <p className="text-xs text-muted-foreground mt-1">ທ່ານສາມາດເລືອກເບິ່ງໝວດໝູ່ອື່ນ ຫຼື ກົດປຸ່ມດ້ານລຸ່ມເພື່ອເບິ່ງຜົນງານທັງໝົດ</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedCategory("all")}
            className="mt-4 rounded-xl text-xs font-bold"
          >
            ເບິ່ງຜົນງານທັງໝົດ
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-orange-500/5 cursor-pointer flex flex-col"
            >
              {/* Defined Aspect Ratio to prevent layout shifts */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                <img
                  src={item.image}
                  alt={item.altTextLao}
                  loading="lazy"
                  width={600}
                  height={450}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/images/portfolio/lightbox-sample.svg";
                  }}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Sample Tag */}
                {item.isSample && (
                  <div className="absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300 backdrop-blur-md flex items-center gap-1 border border-amber-500/20">
                    <Sparkles className="h-3 w-3" />
                    <span>ຕົວຢ່າງ</span>
                  </div>
                )}

              {/* Hover Overlay with Preview Icon */}
              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                <div className="rounded-full bg-background/90 p-3 text-foreground shadow-lg transform translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
                  <Maximize2 className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>

            {/* Item Details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {item.titleLao}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {item.descriptionLao}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono text-[11px]">{item.dimensions || "ຂະໜາດຕາມສັ່ງ"}</span>
                <span className="text-primary font-medium flex items-center gap-1 group-hover:underline">
                  <span>ເບິ່ງຮູບໃຫຍ່</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}

      {/* CTA Box linking to Calculator & Contact */}
      <div className="mt-16 rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-card to-orange-500/5 p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <Badge variant="orange" className="text-xs">
            ຕ້ອງການປ້າຍໃນແບບຂອງທ່ານ?
          </Badge>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            ພ້ອມໃຫ້ຄຳປຶກສາ ແລະ ປະເມີນລາຄາເບື້ອງຕົ້ນ
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            ທ່ານສາມາດໃຊ້ລະບົບຄຳນວນລາຄາປ້າຍອັດຕະໂນມັດ ຫຼື ສົ່ງແບບມາໃຫ້ເຮົາປະເມີນຜ່ານ WhatsApp ໄດ້ທັນທີ.
          </p>
        </div>

        <div className="mt-6 sm:mt-0 flex flex-wrap items-center justify-center sm:justify-end gap-3 shrink-0">
          <Button asChild variant="orangeGlow" className="rounded-xl">
            <Link to="/calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span>ໄປໜ້າຄຳນວນລາຄາ</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/contact">ຕິດຕໍ່ພວກເຮົາ</Link>
          </Button>
        </div>
      </div>

      {/* Accessible Lightbox Modal */}
      <PortfolioLightbox
        item={activeItem}
        items={filteredItems}
        onClose={() => setActiveItem(null)}
        onNavigate={(item) => setActiveItem(item)}
      />
    </PageContainer>
  );
}
