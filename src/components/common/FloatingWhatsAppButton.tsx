import { MessageCircle } from "lucide-react";
import { BUSINESS_CONFIG } from "@/constants/business";
import { useOwnerSettings } from "@/context/OwnerSettingsContext";
import { cn } from "@/lib/utils";

interface FloatingWhatsAppButtonProps {
  className?: string;
}

export function FloatingWhatsAppButton({ className }: FloatingWhatsAppButtonProps) {
  const { settings } = useOwnerSettings();

  // Format phone number dynamically from Owner Settings
  const rawPhone = settings?.business?.phone || BUSINESS_CONFIG.contact.phone;
  const digitsOnly = rawPhone.replace(/\D/g, "");
  let waNumber = digitsOnly;
  if (waNumber.startsWith("020")) {
    waNumber = "85620" + waNumber.slice(3);
  } else if (waNumber.startsWith("20") && waNumber.length === 10) {
    waNumber = "856" + waNumber;
  }
  const whatsappUrl = waNumber ? `https://wa.me/${waNumber}` : BUSINESS_CONFIG.social.whatsappUrl;
  const displayPhone = settings?.business?.phone || BUSINESS_CONFIG.contact.displayPhone;

  return (
    <aside aria-label="ຊ່ອງທາງຕິດຕໍ່ດ່ວນ">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`ຕິດຕໍ່ Indie Sign ຜ່ານ WhatsApp (${displayPhone})`}
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
