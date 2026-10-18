import { MessageCircle } from "lucide-react";
import { BUSINESS_CONFIG } from "@/constants/business";
import { cn } from "@/lib/utils";

interface FloatingWhatsAppButtonProps {
  className?: string;
}

export function FloatingWhatsAppButton({ className }: FloatingWhatsAppButtonProps) {
  const whatsappUrl = BUSINESS_CONFIG.social.whatsappUrl;

  return (
    <aside aria-label="ຊ່ອງທາງຕິດຕໍ່ດ່ວນ">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`ຕິດຕໍ່ Indie Sign ຜ່ານ WhatsApp (${BUSINESS_CONFIG.contact.displayPhone})`}
        className={cn(
          "fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-emerald-600 px-4 py-3 text-white shadow-lg shadow-emerald-600/30 transition-all duration-200 hover:bg-emerald-700 hover:shadow-emerald-600/50 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 active:scale-95 group cursor-pointer",
          className
        )}
      >
        <MessageCircle className="h-5 w-5 transition-transform group-hover:rotate-12" />
        <span className="hidden sm:inline-block text-xs font-semibold tracking-wide">
          ຕິດຕໍ່ WhatsApp
        </span>
      </a>
    </aside>
  );
}
