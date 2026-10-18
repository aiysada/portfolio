import * as React from "react";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PortfolioItem } from "@/data/portfolioData";

export interface PortfolioLightboxProps {
  item: PortfolioItem | null;
  items: PortfolioItem[];
  onClose: () => void;
  onNavigate: (item: PortfolioItem) => void;
}

export function PortfolioLightbox({
  item,
  items,
  onClose,
  onNavigate,
}: PortfolioLightboxProps) {
  // Handle keyboard events (Escape, Left, Right)
  React.useEffect(() => {
    if (!item) return;

    const currentIndex = items.findIndex((i) => i.id === item.id);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && currentIndex > 0) {
        onNavigate(items[currentIndex - 1]);
      } else if (e.key === "ArrowRight" && currentIndex < items.length - 1) {
        onNavigate(items[currentIndex + 1]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, items, onClose, onNavigate]);

  if (!item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Lightbox Container */}
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-background/80 p-2 text-foreground shadow-md backdrop-blur-md hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          aria-label="ປິດຮູບພາບ (Close preview)"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Previous / Next Arrow Controls */}
        {hasPrev && (
          <button
            type="button"
            onClick={() => onNavigate(items[currentIndex - 1])}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-background/80 p-2 text-foreground shadow-md backdrop-blur-md hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hidden sm:flex items-center justify-center"
            aria-label="ຮູບພາບກ່ອນໜ້າ"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {hasNext && (
          <button
            type="button"
            onClick={() => onNavigate(items[currentIndex + 1])}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-background/80 p-2 text-foreground shadow-md backdrop-blur-md hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hidden sm:flex items-center justify-center"
            aria-label="ຮູບພາບຖັດໄປ"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}

        {/* Media Presentation */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/90 flex items-center justify-center">
          <img
            src={item.image}
            alt={item.altTextLao}
            className="h-full w-full object-contain"
          />

          {item.isSample && (
            <div className="absolute bottom-4 left-4 rounded-md bg-black/70 px-3 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md flex items-center gap-1.5 border border-amber-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>ຕົວຢ່າງຮູບແບບປ້າຍ (Sample Demo)</span>
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-6 sm:p-8 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 id="lightbox-title" className="text-xl sm:text-2xl font-bold text-foreground">
              {item.titleLao}
            </h3>
            <Badge variant="orange" className="text-xs">
              {item.titleEn}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {item.descriptionLao}
          </p>

          {(item.dimensions || item.materials) && (
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-muted-foreground border-t border-border/60">
              {item.dimensions && (
                <div>
                  <span className="font-semibold text-foreground">ຂະໜາດ: </span>
                  <span>{item.dimensions}</span>
                </div>
              )}
              {item.materials && (
                <div>
                  <span className="font-semibold text-foreground">ວັດສະດຸ: </span>
                  <span>{item.materials}</span>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls on Mobile */}
          <div className="flex items-center justify-between pt-4 sm:hidden border-t border-border/60">
            <Button
              variant="outline"
              size="sm"
              disabled={!hasPrev}
              onClick={() => onNavigate(items[currentIndex - 1])}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>ກ່ອນໜ້າ</span>
            </Button>

            <span className="text-xs text-muted-foreground font-mono">
              {currentIndex + 1} / {items.length}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={!hasNext}
              onClick={() => onNavigate(items[currentIndex + 1])}
              className="flex items-center gap-1"
            >
              <span>ຖັດໄປ</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
