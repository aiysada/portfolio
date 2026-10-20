/**
 * Indie Sign — SeoManager Component
 * Dynamically handles document title, meta tags, Open Graph, canonical links,
 * Google Search Console verification, and optional Google Analytics 4 integration.
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useOwnerSettings } from "@/context/OwnerSettingsContext";

interface RouteSeoConfig {
  title: string;
  description: string;
  keywords?: string;
  noindex?: boolean;
}

const ROUTE_SEO: Record<string, RouteSeoConfig> = {
  "/": {
    title: "Indie Sign — ທຸລະກິດອອກແບບ ແລະ ຜະລິດປ້າຍຄົບວົງຈອນ",
    description: "Indie Sign ຜູ້ຊ່ຽວຊານດ້ານການອອກແບບ ແລະ ຜະລິດປ້າຍໂຄສະນາຄົບວົງຈອນ ຄຳນວນລາຄາ ອອກໃບສະເໜີລາຄາ ພ້ອມຜົນງານຄຸນນະພາບສູງ",
    keywords: "ຮັບເຮັດປ້າຍ, ອອກແບບປ້າຍ, ຜະລິດປ້າຍ, ຕິດຕັ້ງປ້າຍ, ພິມສະຕິກເກີ, ປ້າຍໄຟ, ນາມບັດ, Indie Sign Laos",
  },
  "/services": {
    title: "ບໍລິການເຮັດປ້າຍ ແລະ ວັດສະດຸ — Indie Sign",
    description: "ບໍລິການຜະລິດປ້າຍຄົບວົງຈອນ: ປ້າຍໄຟ LED, ປ້າຍຕົວອັກສອນໂລຫະ, ປ້າຍໄວນິນໂຄງເຫຼັກ, ປ້າຍນີອອນດັດ, ແລະ ງານພິມສະຕິກເກີຄຸນນະພາບສູງ",
    keywords: "ບໍລິການເຮັດປ້າຍ, ປ້າຍໄຟ LED, ປ້າຍຕົວອັກສອນ, ປ້າຍໄວນິນ, ປ້າຍນີອອນ, ພິມສະຕິກເກີ",
  },
  "/portfolio": {
    title: "ຄັງຜົນງານ ແລະ ຕົວຢ່າງປ້າຍ — Indie Sign",
    description: "ຊົມຕົວຢ່າງງານອອກແບບ ແລະ ຜະລິດປ້າຍໂຄສະນາທຸກປະເພດ ປ້າຍໜ້າຮ້ານ ປ້າຍອາຄານ ປ້າຍຕັ້ງພື້ນ ໂດຍ Indie Sign",
    keywords: "ຜົນງານປ້າຍ, ຕົວຢ່າງປ້າຍ, ປ້າຍໜ້າຮ້ານ, ປ້າຍອາຄານ, signage portfolio Laos",
  },
  "/calculator": {
    title: "ຄຳນວນລາຄາປ້າຍ ແລະ ອອກໃບສະເໜີລາຄາ — Indie Sign",
    description: "ລະບົບຄຳນວນລາຄາປ້າຍອັດຕະໂນມັດ ປະເມີນລາຄາວັດສະດຸ ຄ່າແຮງງານ ຄ່າຕິດຕັ້ງ ພ້ອມດາວໂຫຼດໃບສະເໜີລາຄາ PDF ໄດ້ທັນທີ",
    keywords: "ຄຳນວນລາຄາປ້າຍ, ປະເມີນລາຄາປ້າຍ, ໃບສະເໜີລາຄາ, sign price calculator Laos",
  },
  "/about": {
    title: "ກ່ຽວກັບພວກເຮົາ — Indie Sign",
    description: "ປະຫວັດຄວາມເປັນມາ ວິໄສທັດ ແລະ ມາດຕະຖານງານຜະລິດປ້າຍໂຄສະນາຂອງ Indie Sign ໃນນະຄອນຫຼວງວຽງຈັນ",
    keywords: "ກ່ຽວກັບ Indie Sign, ຮ້ານເຮັດປ້າຍ ວຽງຈັນ, ທີມງານອອກແບບປ້າຍ",
  },
  "/contact": {
    title: "ຕິດຕໍ່ພວກເຮົາ — Indie Sign",
    description: "ຕິດຕໍ່ສອບຖາມ ປຶກສາງານປ້າຍ ສົ່ງແບບປະເມີນລາຄາ ຫຼື ຕິດຕໍ່ຜ່ານ WhatsApp ກັບທີມງານ Indie Sign ໄດ້ທັນທີ",
    keywords: "ຕິດຕໍ່ Indie Sign, ເບີໂທຮ້ານປ້າຍ, WhatsApp Indie Sign, ຮ້ານປ້າຍ ວຽງຈັນ",
  },
  "/owner": {
    title: "ລະບົບຈັດການຮ້ານ (Owner Settings) — Indie Sign",
    description: "ລະບົບຈັດການຂໍ້ມູນຮ້ານ, ລາຄາວັດສະດຸ, ການຕັ້ງຄ່າເອກະສານ, ແລະ ປະຫວັດໃບສະເໜີລາຄາ",
    noindex: true,
  },
};

export function SeoManager() {
  const { pathname } = useLocation();
  const { settings } = useOwnerSettings();
  const seoSettings = settings.seo;

  // 1. Update Title and Meta Tags per route
  useEffect(() => {
    const routeConfig = ROUTE_SEO[pathname] || {
      title: pathname === "/404" || pathname !== "/" ? "ບໍ່ພົບໜ້າ — Indie Sign" : "Indie Sign",
      description: seoSettings?.defaultDescription || "Indie Sign — ທຸລະກິດອອກແບບ ແລະ ຜະລິດປ້າຍຄົບວົງຈອນ",
      noindex: pathname.startsWith("/owner") || pathname.startsWith("/settings"),
    };

    // Determine final title & description
    let finalTitle = routeConfig.title;
    let finalDesc = routeConfig.description;

    if (pathname === "/" && seoSettings?.defaultTitle) {
      finalTitle = seoSettings.defaultTitle;
    }
    if (pathname === "/" && seoSettings?.defaultDescription) {
      finalDesc = seoSettings.defaultDescription;
    }

    document.title = finalTitle;

    // Helper to set or update meta tag
    const setMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        if (isProperty) {
          element.setAttribute("property", name);
        } else {
          element.setAttribute("name", name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    setMeta("description", finalDesc);
    setMeta("og:title", finalTitle, true);
    setMeta("og:description", finalDesc, true);
    setMeta("og:type", "website", true);

    const keywords = routeConfig.keywords || seoSettings?.defaultKeywordsLao || "Indie Sign, ຮັບເຮັດປ້າຍ";
    setMeta("keywords", keywords);

    // Robots meta tag
    if (routeConfig.noindex) {
      setMeta("robots", "noindex, nofollow");
    } else {
      setMeta("robots", "index, follow");
    }

    // Canonical link tag
    let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const baseSiteUrl = (seoSettings?.siteUrl || "").trim().replace(/\/+$/, "");

    // Only set canonical if siteUrl is configured and not localhost
    if (baseSiteUrl && !/localhost|127\.0\.0\.1/i.test(baseSiteUrl)) {
      if (!canonicalElement) {
        canonicalElement = document.createElement("link");
        canonicalElement.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalElement);
      }
      const pageUrl = pathname === "/" ? baseSiteUrl : `${baseSiteUrl}${pathname}`;
      canonicalElement.setAttribute("href", pageUrl);
      setMeta("og:url", pageUrl, true);
    } else if (canonicalElement) {
      canonicalElement.remove();
    }

    // Google Search Console verification meta tag
    const verificationTag = seoSettings?.googleSearchConsoleTag?.trim();
    let gscMeta = document.querySelector('meta[name="google-site-verification"]') as HTMLMetaElement | null;
    if (verificationTag) {
      if (!gscMeta) {
        gscMeta = document.createElement("meta");
        gscMeta.setAttribute("name", "google-site-verification");
        document.head.appendChild(gscMeta);
      }
      // If user pasted `<meta name="..." content="...">`, extract content value
      const match = verificationTag.match(/content=["']([^"']+)["']/i);
      gscMeta.setAttribute("content", match ? match[1] : verificationTag);
    } else if (gscMeta) {
      gscMeta.remove();
    }
  }, [pathname, seoSettings]);

  // 2. Google Analytics 4 Script injection
  useEffect(() => {
    const gaId = seoSettings?.googleAnalyticsId?.trim();

    // Do not load analytics if no valid measurement ID is provided
    if (!gaId || !/^G-[A-Z0-9]+$/i.test(gaId)) {
      // Remove any previously injected GA scripts if ID was cleared
      const existingScript = document.getElementById("ga-gtag-script");
      const existingInit = document.getElementById("ga-init-script");
      existingScript?.remove();
      existingInit?.remove();
      return;
    }

    // Check if script already exists to avoid duplicate initialization
    if (document.getElementById("ga-gtag-script")) {
      return;
    }

    try {
      const scriptTag = document.createElement("script");
      scriptTag.id = "ga-gtag-script";
      scriptTag.async = true;
      scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
      document.head.appendChild(scriptTag);

      const initTag = document.createElement("script");
      initTag.id = "ga-init-script";
      initTag.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}', { anonymize_ip: true });
      `;
      document.head.appendChild(initTag);
    } catch (e) {
      console.warn("Could not initialize Google Analytics:", e);
    }

    return () => {
      // Cleanup on unmount or ID change
      document.getElementById("ga-gtag-script")?.remove();
      document.getElementById("ga-init-script")?.remove();
    };
  }, [seoSettings?.googleAnalyticsId]);

  return null;
}
