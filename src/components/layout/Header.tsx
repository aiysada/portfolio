import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, Calculator, PhoneCall, ClipboardList } from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MAIN_NAV_ITEMS, OWNER_NAV_ITEM } from "@/constants/navigation";
import { BUSINESS_CONFIG } from "@/constants/business";
import { useOwnerSettings } from "@/context/OwnerSettingsContext";
import { cn } from "@/lib/utils";

export function Header() {
  const { settings } = useOwnerSettings();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const rawPhone = settings?.business?.phone || BUSINESS_CONFIG.contact.phone;
  const displayPhone = settings?.business?.phone || BUSINESS_CONFIG.contact.displayPhone;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur-md transition-colors duration-200">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <BrandLogo />

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {MAIN_NAV_ITEMS.map((item) => {
            if (item.isHighlight) {
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "group relative ml-3 mr-1 flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30 ring-2 ring-orange-500/40"
                        : "bg-gradient-to-r from-orange-500/15 via-orange-500/10 to-amber-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/40 hover:from-orange-500 hover:to-amber-500 hover:text-white hover:border-transparent hover:shadow-md hover:shadow-orange-500/25 hover:scale-[1.02]"
                    )
                  }
                >
                  <ClipboardList className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span>{item.title}</span>
                  <span className="relative flex h-2 w-2 ml-0.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                  </span>
                </NavLink>
              );
            }

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                    isActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:bg-accent/40"
                  )
                }
              >
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right Action Icons: Prominent Order CTA for Tablets/Medium + Theme Toggle + Call CTA */}
        <div className="flex items-center gap-2">
          {/* Prominent Order CTA for Tablets/Medium screens if not expanded */}
          <Button
            asChild
            size="sm"
            className="hidden md:flex lg:hidden items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-sm shadow-orange-500/25 rounded-xl text-xs font-bold transition-transform hover:scale-[1.02]"
          >
            <Link to="/order">
              <ClipboardList className="h-4 w-4" />
              <span>ສັ່ງເຮັດປ້າຍ</span>
            </Link>
          </Button>

          {/* Quick Call Button */}
          <Button
            asChild
            variant="orangeGlow"
            size="sm"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg text-xs font-medium"
          >
            <a href={`tel:${rawPhone}`}>
              <PhoneCall className="h-3.5 w-3.5" />
              <span>{displayPhone}</span>
            </a>
          </Button>

          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Mobile Menu Hamburger Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="lg:hidden rounded-lg"
            aria-label={isMobileMenuOpen ? "ປິດເມນູ" : "ເປີດເມນູ"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="border-b border-border bg-background/98 backdrop-blur-xl px-4 pt-3 pb-6 lg:hidden animate-in slide-in-from-top-2 duration-200 shadow-xl">
          <nav className="flex flex-col space-y-1.5" aria-label="Mobile navigation">
            {MAIN_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-between rounded-lg px-3.5 py-2.5 text-base font-medium transition-colors",
                    item.isHighlight && "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 font-bold",
                    isActive && !item.isHighlight && "bg-primary/10 text-primary font-semibold",
                    !isActive && !item.isHighlight && "text-muted-foreground hover:bg-muted"
                  )
                }
              >
                <div className="flex items-center gap-2">
                  {item.isHighlight && (
                    item.href === "/order" ? (
                      <ClipboardList className="h-4 w-4 text-primary" />
                    ) : (
                      <Calculator className="h-4 w-4 text-primary" />
                    )
                  )}
                  <span>{item.title}</span>
                </div>
                {item.isBadge && (
                  <Badge variant="orange" className="text-xs">
                    {item.badgeText}
                  </Badge>
                )}
              </NavLink>
            ))}

            <NavLink
              to={OWNER_NAV_ITEM.href}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors text-muted-foreground hover:bg-muted",
                  isActive && "bg-primary/10 text-primary font-semibold"
                )
              }
            >
              <span>{OWNER_NAV_ITEM.title}</span>
            </NavLink>

            {/* Mobile Call CTA */}
            <div className="pt-4 border-t border-border mt-3">
              <Button
                asChild
                variant="orangeGlow"
                className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5"
              >
                <a href={`tel:${rawPhone}`} onClick={closeMobileMenu}>
                  <PhoneCall className="h-4 w-4" />
                  <span>ໂທສອບຖາມດ່ວນ: {displayPhone}</span>
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

// Export SiteHeader as an alias for Header
export const SiteHeader = Header;
