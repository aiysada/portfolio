/**
 * Indie Sign — OwnerSidebar Component
 * Left navigation sidebar on desktop, responsive dropdown/tabs on mobile.
 */

import React from "react";
import {
  Package,
  Layers,
  Wrench,
  Building2,
  FileText,
  Percent,
  KeyRound,
  Database,
  Globe,
  LogOut,
  History,
} from "lucide-react";
import { useOwnerSettings } from "@/context/OwnerSettingsContext";

export type OwnerSectionId =
  | "products"
  | "materials"
  | "fees"
  | "business"
  | "documents"
  | "tax-discount"
  | "security"
  | "backup"
  | "seo"
  | "history";

interface OwnerSidebarProps {
  currentSection: OwnerSectionId;
  onSelectSection: (section: OwnerSectionId) => void;
}

export const OWNER_SECTIONS: {
  id: OwnerSectionId;
  labelLao: string;
  labelEn: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "history",
    labelLao: "ປະຫວັດໃບປະເມີນ",
    labelEn: "Quote History",
    icon: <History className="h-4 w-4" />,
  },
  {
    id: "products",
    labelLao: "ສິນຄ້າ ແລະ ບໍລິການ",
    labelEn: "Products & Services",
    icon: <Package className="h-4 w-4" />,
  },
  {
    id: "materials",
    labelLao: "ວັດສະດຸ ແລະ ລາຄາ",
    labelEn: "Materials & Pricing",
    icon: <Layers className="h-4 w-4" />,
  },
  {
    id: "fees",
    labelLao: "ຄ່າແຮງ, ຕິດຕັ້ງ & ຄ່າບໍລິການ",
    labelEn: "Labor & Fees",
    icon: <Wrench className="h-4 w-4" />,
  },
  {
    id: "business",
    labelLao: "ຂໍ້ມູນທຸລະກິດ",
    labelEn: "Business Info",
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    id: "documents",
    labelLao: "ຕັ້ງຄ່າເອກະສານ & PDF",
    labelEn: "Documents & PDF",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "tax-discount",
    labelLao: "ອາກອນ ແລະ ສ່ວນຫຼຸດ",
    labelEn: "Tax & Discount Defaults",
    icon: <Percent className="h-4 w-4" />,
  },
  {
    id: "security",
    labelLao: "ຄວາມປອດໄພ & ລະຫັດ PIN",
    labelEn: "Security & PIN",
    icon: <KeyRound className="h-4 w-4" />,
  },
  {
    id: "backup",
    labelLao: "ສຳຮອງ & ກູ້ຄືນ JSON",
    labelEn: "Backup & Restore",
    icon: <Database className="h-4 w-4" />,
  },
  {
    id: "seo",
    labelLao: "SEO & Analytics",
    labelEn: "SEO & Analytics",
    icon: <Globe className="h-4 w-4" />,
  },
];

export const OwnerSidebar: React.FC<OwnerSidebarProps> = ({
  currentSection,
  onSelectSection,
}) => {
  const { logout } = useOwnerSettings();

  return (
    <>
      {/* Mobile Horizontal Selector */}
      <div className="lg:hidden mb-6 p-2 rounded-2xl bg-card border border-border shadow-sm">
        <select
          value={currentSection}
          onChange={(e) => onSelectSection(e.target.value as OwnerSectionId)}
          className="w-full text-xs font-semibold bg-background border border-border rounded-xl px-3 py-2.5 text-foreground"
        >
          {OWNER_SECTIONS.map((sec) => (
            <option key={sec.id} value={sec.id}>
              {sec.labelLao} ({sec.labelEn})
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Sidebar Navigation */}
      <div className="hidden lg:flex flex-col w-64 shrink-0 rounded-3xl border border-border bg-card p-4 shadow-sm self-start sticky top-24">
        <div className="px-3 py-2 mb-3 border-b border-border/60">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            ເມນູຈັດການຮ້ານ
          </span>
          <span className="text-xs font-extrabold text-foreground">
            Owner Dashboard
          </span>
        </div>

        <nav className="space-y-1">
          {OWNER_SECTIONS.map((sec) => {
            const isActive = currentSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => onSelectSection(sec.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                <div
                  className={`${isActive ? "text-primary-foreground" : "text-muted-foreground"}`}
                >
                  {sec.icon}
                </div>
                <div>
                  <span className="block leading-tight">{sec.labelLao}</span>
                  <span
                    className={`text-[10px] block opacity-80 ${
                      isActive
                        ? "text-primary-foreground/90"
                        : "text-muted-foreground"
                    }`}
                  >
                    {sec.labelEn}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Logout action */}
        <div className="mt-6 pt-4 border-t border-border/60">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>ອອກຈາກລະບົບ (Logout)</span>
          </button>
        </div>
      </div>
    </>
  );
};
