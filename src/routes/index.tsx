import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { HomePage } from "@/pages/HomePage";
import { PageLoadingFallback } from "@/components/common/PageLoadingFallback";

// Route-level code splitting for production performance & bundle reduction
const ServicesPage = lazy(() => import("@/pages/ServicesPage").then((m) => ({ default: m.ServicesPage })));
const PortfolioPage = lazy(() => import("@/pages/PortfolioPage").then((m) => ({ default: m.PortfolioPage })));
const CalculatorPage = lazy(() => import("@/pages/CalculatorPage").then((m) => ({ default: m.CalculatorPage })));
const AboutPage = lazy(() => import("@/pages/AboutPage").then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import("@/pages/ContactPage").then((m) => ({ default: m.ContactPage })));
const OwnerPage = lazy(() => import("@/pages/OwnerPage").then((m) => ({ default: m.OwnerPage })));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "portfolio",
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <PortfolioPage />
          </Suspense>
        ),
      },
      {
        path: "services",
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <ServicesPage />
          </Suspense>
        ),
      },
      {
        // Backward-compatible alias for /products -> /services
        path: "products",
        element: <Navigate to="/services" replace />,
      },
      {
        path: "calculator",
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <CalculatorPage />
          </Suspense>
        ),
      },
      {
        path: "about",
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: "contact",
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <ContactPage />
          </Suspense>
        ),
      },
      {
        path: "owner",
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <OwnerPage />
          </Suspense>
        ),
      },
      {
        // Backward-compatible alias for /settings -> /owner
        path: "settings",
        element: <Navigate to="/owner" replace />,
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<PageLoadingFallback />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);
