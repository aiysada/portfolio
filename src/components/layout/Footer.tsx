import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/common/BrandLogo";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { BUSINESS_CONFIG } from "@/constants/business";
import { FOOTER_NAV_GROUPS } from "@/constants/navigation";
import { useOwnerSettings } from "@/context/OwnerSettingsContext";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useOwnerSettings();

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
  const displayAddress = settings?.business?.addressLao || settings?.business?.address || BUSINESS_CONFIG.contact.locationLao;
  const displayEmail = settings?.business?.email || BUSINESS_CONFIG.contact.email;

  return (
    <footer className="border-t border-border bg-card text-card-foreground transition-colors duration-200">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info & Primary Slogan */}
          <div className="space-y-4 lg:col-span-2">
            <BrandLogo />

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3.5 max-w-sm">
              <p className="text-sm font-semibold text-primary">
                "{BUSINESS_CONFIG.sloganLao}"
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {BUSINESS_CONFIG.taglineEn}
              </p>
            </div>

            <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
              Indie Sign — ຜູ້ຊ່ຽວຊານດ້ານການອອກແບບ ແລະ ຜະລິດປ້າຍໂຄສະນາທຸກຊະນິດ
              ປ້າຍຕົວອັກສອນ, ປ້າຍໄຟ LED, ປ້າຍກ່ອງໄຟ, ປ້າຍອາຄານ ແລະ ໂຄງສ້າງເຫຼັກ
              ຄຸນນະພາບມາດຕະຖານ ລາຄາຊື່ກົງ.
            </p>
          </div>

          {/* Navigation Link Groups */}
          {FOOTER_NAV_GROUPS.map((group, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                {group.title}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {group.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <Link
                      to={item.href}
                      className="transition-colors hover:text-primary hover:underline underline-offset-4"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
              ຂໍ້ມູນຕິດຕໍ່ (Contact)
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {displayAddress && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{displayAddress}</span>
                </li>
              )}
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a
                  href={`tel:${rawPhone}`}
                  className="hover:text-primary transition-colors font-semibold text-foreground"
                >
                  {displayPhone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-500 transition-colors"
                >
                  WhatsApp: {displayPhone}
                </a>
              </li>
              {displayEmail && (
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <a
                    href={`mailto:${displayEmail}`}
                    className="hover:text-primary transition-colors"
                  >
                    {displayEmail}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <span>ຈັນ - ເສົາ: 08:30 - 17:30</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            © {currentYear} {BUSINESS_CONFIG.brandName}. ສະຫງວນລິຂະສິດທຸກປະການ. (All Rights Reserved).
          </p>
          <div className="flex items-center gap-4">
            <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[11px]">
              v{BUSINESS_CONFIG.version} UI Foundation
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Export SiteFooter as alias for Footer
export const SiteFooter = Footer;
