import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsAppButton } from "@/components/common/FloatingWhatsAppButton";
import { SeoManager } from "@/components/common/SeoManager";

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200">
      <SeoManager />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}
