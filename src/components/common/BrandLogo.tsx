import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  showSubtitle?: boolean;
}

export function BrandLogo({ className, showSubtitle = true }: BrandLogoProps) {
  return (
    <Link
      to="/"
      className={cn(
        "group flex items-center gap-3 transition-opacity hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg",
        className
      )}
    >
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 transition-transform group-hover:scale-105">
        <span className="font-extrabold text-xl tracking-tighter">I</span>
        <span className="font-extrabold text-xl tracking-tighter text-amber-200">S</span>
        <Sparkles className="absolute -top-1 -right-1 h-3.5 w-3.5 text-amber-300 animate-pulse" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-foreground">
            Indie<span className="text-primary font-black ml-1">Sign</span>
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] text-muted-foreground font-medium tracking-wide -mt-0.5">
            ອອກແບບ & ຜະລິດປ້າຍຄົບວົງຈອນ
          </span>
        )}
      </div>
    </Link>
  );
}
