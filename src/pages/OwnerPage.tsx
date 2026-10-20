/**
 * Indie Sign — OwnerPage Component
 * Full administration dashboard for owner management, protected by client-side PIN.
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, LogOut } from "lucide-react";
import { PageContainer } from "@/components/common/PageContainer";
import { useOwnerSettings } from "@/context/OwnerSettingsContext";
import { PinLoginCard } from "@/components/owner/PinLoginCard";
import { OwnerSidebar, type OwnerSectionId } from "@/components/owner/OwnerSidebar";

// 9 Section Components
import { ProductsSection } from "@/components/owner/sections/ProductsSection";
import { MaterialsSection } from "@/components/owner/sections/MaterialsSection";
import { FeesSection } from "@/components/owner/sections/FeesSection";
import { BusinessInfoSection } from "@/components/owner/sections/BusinessInfoSection";
import { DocumentSettingsSection } from "@/components/owner/sections/DocumentSettingsSection";
import { TaxDiscountSection } from "@/components/owner/sections/TaxDiscountSection";
import { SecuritySection } from "@/components/owner/sections/SecuritySection";
import { BackupRestoreSection } from "@/components/owner/sections/BackupRestoreSection";
import { SeoAnalyticsSection } from "@/components/owner/sections/SeoAnalyticsSection";
import { HistorySection } from "@/components/owner/sections/HistorySection";
import { Button } from "@/components/ui/button";

export function OwnerPage() {
  const { authState, logout } = useOwnerSettings();
  const [currentSection, setCurrentSection] = useState<OwnerSectionId>("products");

  // If user is not authenticated, display PIN login screen
  if (!authState.isAuthenticated) {
    return (
      <PageContainer size="default">
        <div className="py-6 sm:py-10">
          <PinLoginCard />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer size="default">
      {/* Dashboard Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="rounded-xl text-xs h-9">
            <Link to="/" className="flex items-center gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>ກັບຄືນໜ້າຫຼັກ</span>
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" />
              ເຈົ້າຂອງຮ້ານ (Owner Session Active)
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={logout}
          className="text-xs text-destructive border-destructive/30 hover:bg-destructive/10 h-9"
        >
          <LogOut className="h-3.5 w-3.5 mr-1.5" />
          ອອກຈາກລະບົບ (Logout)
        </Button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start pb-12">
        {/* Left Sidebar */}
        <OwnerSidebar
          currentSection={currentSection}
          onSelectSection={setCurrentSection}
        />

        {/* Right Content Panel */}
        <div className="flex-1 w-full min-w-0 rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-sm">
          {currentSection === "products" && <ProductsSection />}
          {currentSection === "materials" && <MaterialsSection />}
          {currentSection === "fees" && <FeesSection />}
          {currentSection === "business" && <BusinessInfoSection />}
          {currentSection === "documents" && <DocumentSettingsSection />}
          {currentSection === "tax-discount" && <TaxDiscountSection />}
          {currentSection === "security" && <SecuritySection />}
          {currentSection === "backup" && <BackupRestoreSection />}
          {currentSection === "seo" && <SeoAnalyticsSection />}
          {currentSection === "history" && <HistorySection />}
        </div>
      </div>
    </PageContainer>
  );
}
