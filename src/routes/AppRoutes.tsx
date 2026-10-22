import { createBrowserRouter, Navigate } from "react-router";
import { AppLayout } from "./AppLayout";
import LandingPage from "../pages/landing/page";
import { PAGES, VARIANTS, type Variant } from "../variants/variants";
import { VariantSwitcher } from "../variants/VariantSwitcher";

/**
 * Landing page at "/", then three design options (/a, /b, /c), each with the same
 * three Admin (L&D) pages copied from lnd-presight-demo.
 *
 * Each option gets its own router with the option as `basename`, so the sidebar and
 * the pages keep navigating to absolute paths like "/ld/dashboard" and stay inside
 * their option. Moving between the landing page and an option is a full page load.
 * Links to any other page of the full app have no route here.
 */
function variantRouter(variant: Variant) {
  return createBrowserRouter(
    [
      {
        element: (
          <>
            <AppLayout />
            <VariantSwitcher currentKey={variant.key} />
          </>
        ),
        children: [
          ...PAGES.map((page) => ({ path: page.path, Component: variant.pages[page.key] })),
          { path: "*", element: <Navigate to={PAGES[0].path} replace /> },
        ],
      },
    ],
    { basename: `/${variant.key}` },
  );
}

const landingRouter = () =>
  createBrowserRouter([
    { path: "/", Component: LandingPage },
    { path: "*", element: <Navigate to="/" replace /> },
  ]);

const firstSegment = window.location.pathname.split("/")[1];
const activeVariant = VARIANTS.find((v) => v.key === firstSegment);

// Lets an option scope page-wide styles (fonts, portals) with e.g. `.option-a`
if (activeVariant) document.documentElement.classList.add(`option-${activeVariant.key}`);

export const router = activeVariant ? variantRouter(activeVariant) : landingRouter();
