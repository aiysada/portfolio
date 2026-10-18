import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, Calculator, PhoneCall } from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MAIN_NAV_ITEMS, OWNER_NAV_ITEM } from "@/constants/navigation";
import { BUSINESS_CONFIG } from "@/constants/business";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
              // Prominent Price Calculator Call to Action
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "relative ml-2 mr-1 flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm shadow-orange-500/25"
                        : "bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 border border-orange-500/30"
                    )
                  }
                >
                  <Calculator className="h-3.5 w-3.5" />
                  <span>{item.title}</span>
                  <Badge variant="orange" className="ml-0.5 text-[10px] px-1 py-0 uppercase">
                    PRO
                  </Badge>
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

        {/* Right Action Icons: Calculator Shortcut (on medium screens) + Theme Toggle + Call CTA */}
        <div className="flex items-center gap-2">
          {/* Prominent Calculator CTA for Tablets/Medium screens if not expanded */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden md:flex lg:hidden items-center gap-1.5 border-primary/30 text-primary hover:bg-primary/10 rounded-lg text-xs font-semibold"
          >
            <Link to="/calculator">
              <Calculator className="h-3.5 w-3.5 text-primary" />
              <span>ຄຳນວນລາຄາ</span>
            </Link>
          </Button>

          {/* Quick Call Button */}
          <Button
            asChild
            variant="orangeGlow"
            size="sm"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg text-xs font-medium"
          >
            <a href={`tel:${BUSINESS_CONFIG.contact.phone}`}>
              <PhoneCall className="h-3.5 w-3.5" />
              <span>{BUSINESS_CONFIG.contact.displayPhone}</span>
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
                  {item.isHighlight && <Calculator className="h-4 w-4 text-primary" />}
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
                <a href={`tel:${BUSINESS_CONFIG.contact.phone}`} onClick={closeMobileMenu}>
                  <PhoneCall className="h-4 w-4" />
                  <span>ໂທສອບຖາມດ່ວນ: {BUSINESS_CONFIG.contact.displayPhone}</span>
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
