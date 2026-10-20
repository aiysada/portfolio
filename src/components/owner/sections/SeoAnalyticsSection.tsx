/**
 * Indie Sign — SeoAnalyticsSection Component
 * Manage Google Analytics ID, Search Console verification, and default meta tags.
 */

import React, { useState } from "react";
import { Check, Globe, Search, AlertCircle } from "lucide-react";
import { useOwnerSettings } from "@/context/OwnerSettingsContext";
import { Button } from "@/components/ui/button";

export const SeoAnalyticsSection: React.FC = () => {
  const { settings, updateSeo } = useOwnerSettings();
  const [seo, setSeo] = useState(settings.seo);
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Validate Site URL if provided
    if (seo.siteUrl && seo.siteUrl.trim()) {
      const trimmedUrl = seo.siteUrl.trim();
      if (!/^https?:\/\//i.test(trimmedUrl)) {
        setValidationError("ກະລຸນາໃສ່ URL ທີ່ຖືກຕ້ອງ ໂດຍຂຶ້ນຕົ້ນດ້ວຍ https:// ຫຼື http:// (ຕົວຢ່າງ: https://indiesign.la)");
        return;
      }
      if (/localhost|127\.0\.0\.1/i.test(trimmedUrl)) {
        setValidationError("ຫ້າມໃຊ້ localhost ຫຼື IP ພາຍໃນເປັນ Production Site URL. ກະລຸນາໃສ່ໂດເມນຈິງທີ່ໃຊ້ງານ.");
        return;
      }
    }

    // Validate Google Analytics ID format if entered
    if (seo.googleAnalyticsId && !/^G-[A-Z0-9]+$/i.test(seo.googleAnalyticsId.trim())) {
      setValidationError("ຮູບແບບ Google Analytics ID ບໍ່ຖືກຕ້ອງ (ຕ້ອງຂຶ້ນຕົ້ນດ້ວຍ G- ເຊັ່ນ: G-XXXXXXXXXX)");
      return;
    }

    updateSeo({
      ...seo,
      siteUrl: seo.siteUrl.trim().replace(/\/+$/, ""), // strip trailing slash
      googleAnalyticsId: seo.googleAnalyticsId.trim(),
      googleSearchConsoleTag: seo.googleSearchConsoleTag.trim(),
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            ຕັ້ງຄ່າ SEO & Analytics (Search Engine & Tracking)
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            ກຳນົດລະຫັດ Google Analytics, Search Console, ແລະ ຂໍ້ມູນ Meta Tags ພາສາລາວ
          </p>
        </div>

        <div className="flex items-center gap-3">
          {success && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-500/10 px-3 py-1 rounded-lg">
              <Check className="h-3.5 w-3.5" />
              ບັນທຶກສຳເລັດແລ້ວ
            </span>
          )}
          <Button type="submit" size="sm" className="text-xs font-bold">
            <Check className="h-4 w-4 mr-1.5" />
            ບັນທຶກການຕັ້ງຄ່າ SEO
          </Button>
        </div>
      </div>

      {validationError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Production Site Domain & Canonical URL */}
      <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          ໂດເມນເວັບໄຊຕົວຈິງ (Production Domain)
        </h3>

        <div>
          <label className="text-[11px] font-semibold text-foreground block mb-1">
            Production Canonical Site URL
          </label>
          <input
            type="url"
            placeholder="https://indiesign.la ຫຼື https://yourdomain.com"
            value={seo.siteUrl}
            onChange={(e) => setSeo((p) => ({ ...p, siteUrl: e.target.value }))}
            className="w-full text-xs bg-background border border-border rounded-lg p-2 font-mono font-medium"
          />
          <span className="text-[10px] text-muted-foreground block mt-1">
            ໃຊ້ສຳລັບສ້າງ Canonical URL, Open Graph preview ເວລາແຊຣ໌ລິ້ງ, ແລະ sitemap.xml. ຫ້າມໃຊ້ localhost ຫຼື IP ພາຍໃນ.
          </span>
        </div>
      </div>

      {/* Analytics & Search Console IDs */}
      <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Search className="h-4 w-4 text-primary" />
          ລະຫັດຕິດຕາມ ແລະ ຢືນຢັນ Google (Search Console & Analytics)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-foreground block mb-1">
              Google Analytics 4 Measurement ID
            </label>
            <input
              type="text"
              placeholder="G-XXXXXXXXXX"
              value={seo.googleAnalyticsId}
              onChange={(e) => setSeo((p) => ({ ...p, googleAnalyticsId: e.target.value.trim() }))}
              className="w-full text-xs bg-background border border-border rounded-lg p-2 font-mono font-bold"
            />
            <span className="text-[10px] text-muted-foreground block mt-1">
              ຕົວຢ່າງ: G-1234567890 (ຖ້າມີ)
            </span>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-foreground block mb-1">
              Google Search Console Verification Tag
            </label>
            <input
              type="text"
              placeholder="google-site-verification token..."
              value={seo.googleSearchConsoleTag}
              onChange={(e) => setSeo((p) => ({ ...p, googleSearchConsoleTag: e.target.value.trim() }))}
              className="w-full text-xs bg-background border border-border rounded-lg p-2 font-mono"
            />
            <span className="text-[10px] text-muted-foreground block mt-1">
              ລະຫັດຢືນຢັນຄວາມເປັນເຈົ້າຂອງເວັບໄຊໃນ Google Search
            </span>
          </div>
        </div>
      </div>

      {/* Default Meta Tags */}
      <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Search className="h-4 w-4 text-primary" />
          ຂໍ້ມູນ Meta Tags ເລີ່ມຕົ້ນ (Default SEO Meta)
        </h3>

        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-foreground block mb-1">
              ຫົວຂໍ້ເວັບໄຊເລີ່ມຕົ້ນ (Default Page Title)
            </label>
            <input
              type="text"
              value={seo.defaultTitle}
              onChange={(e) => setSeo((p) => ({ ...p, defaultTitle: e.target.value }))}
              className="w-full text-xs bg-background border border-border rounded-lg p-2 font-medium"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-foreground block mb-1">
              ຄຳອະທິບາຍເວັບໄຊ (Meta Description)
            </label>
            <textarea
              rows={2}
              value={seo.defaultDescription}
              onChange={(e) => setSeo((p) => ({ ...p, defaultDescription: e.target.value }))}
              className="w-full text-xs bg-background border border-border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-foreground block mb-1">
              ຄຳຄົ້ນຫາພາສາລາວ (Lao Keywords, ຂັ້ນດ້ວຍຈຸດ)
            </label>
            <input
              type="text"
              value={seo.defaultKeywordsLao}
              onChange={(e) => setSeo((p) => ({ ...p, defaultKeywordsLao: e.target.value }))}
              className="w-full text-xs bg-background border border-border rounded-lg p-2"
            />
          </div>
        </div>
      </div>

      {/* Search Console & Sitemap Instructions */}
      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs space-y-2">
        <h4 className="font-bold text-foreground flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
          <Globe className="h-4 w-4" />
          ວິທີສົ່ງ Sitemap ແລະ ຢືນຢັນເວັບໄຊໃນ Google Search Console
        </h4>
        <ol className="list-decimal list-inside space-y-1 text-muted-foreground text-[11px] leading-relaxed">
          <li>ເຂົ້າໄປທີ່ <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Search Console</a> ແລ້ວເພີ່ມເວັບໄຊຂອງທ່ານ (URL Prefix).</li>
          <li>ເລືອກວິທີຢືນຢັນແບບ <strong>HTML Tag</strong> ແລ້ວນຳເອົາຄ່າໃນ <code>content="..."</code> ມາໃສ່ໃນຊ່ອງ Verification Tag ດ້ານເທິງ.</li>
          <li>ຫຼັງຈາກຢືນຢັນສຳເລັດ, ໃຫ້ໄປທີ່ເມນູ <strong>Sitemaps</strong> ແລ້ວພິມ <code>sitemap.xml</code> ກົດ Submit.</li>
          <li>ໄຟລ໌ <code>public/sitemap.xml</code> ບັນຈຸສະເພາະໜ້າຫຼັກ, ບໍລິການ, ຜົນງານ, ແລະ ຄຳນວນລາຄາ. ລະບົບຈະບໍ່ສົ່ງໜ້າ Owner ແລະ ປະຫວັດໃບສະເໜີເຂົ້າ Google.</li>
        </ol>
      </div>

      {/* Disclaimer */}
      <div className="p-3.5 rounded-xl bg-muted/40 text-[11px] text-muted-foreground leading-relaxed">
        * ໝາຍເຫດ: ເວັບໄຊນີ້ໃຊ້ໂຄງສ້າງ Client-Side React SPA. ການຕັ້ງຄ່າ Meta Tags, Open Graph ແລະ Sitemap ຊ່ວຍໃຫ້ Bot ສາມາດອ່ານຂໍ້ມູນ ແລະ ສະແດງ Preview ເມື່ອແຊຣ໌ລິ້ງໄດ້ຢ່າງຖືກຕ້ອງ ແຕ່ບໍ່ສາມາດຮັບປະກັນອັນດັບການຄົ້ນຫາເທິງ Google Search ໂດຍກົງ ເຊິ່ງຂຶ້ນກັບປັດໄຈດ້ານຄຸນນະພາບເນື້ອຫາ ແລະ ນະໂຍບາຍຂອງ Google.
      </div>
    </form>
  );
};
