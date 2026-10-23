import { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { Footer } from "../components/Footer";
import { ResponsiveBackground } from "../components/ResponsiveBackground";
import { TopNav } from "../components/TopNav";
import { useAuthStore } from "@/store/useAuthStore";
import type { SidebarRole } from "../components/config-sidebar";
import "../option-d.css";

interface DashboardLayoutProps {
  children: ReactNode;
  noFooter?: boolean;
  fixedContent?: boolean;
  /** Kept for callers; Option D has no sidebar */
  hideSidebar?: boolean;
}

/**
 * Option D shell: no sidebar. The menu runs along the top (TopNav: logo, menu
 * pills, messages, notifications and the profile) over the same background as
 * the content, which takes the full width below it.
 */
export function DashboardLayout({ children, noFooter = false, fixedContent = false }: DashboardLayoutProps) {
  const user = useAuthStore((s) => s.user);
  const role = (user?.role ?? 'ld_team') as SidebarRole;

  return (
    <MotionConfig reducedMotion="user">
    <div className="flex h-screen w-full font-sans overflow-hidden relative text-(--od-text-strong)">
      {/* Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <ResponsiveBackground />
      </div>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col min-h-0 overflow-hidden relative z-10">
        <div className={
          fixedContent
            ? 'flex-1 min-h-0 overflow-hidden px-6 pt-3 pb-4'
            : 'flex-1 min-w-0 overflow-y-auto overflow-x-clip flex flex-col'
        }>
          {fixedContent ? (
            <div className="flex h-full flex-col gap-3">
              <TopNav role={role} />
              <div className="min-h-0 flex-1">{children}</div>
            </div>
          ) : (
            <>
              <div className="px-6 pt-3 pb-4 flex-1">
                <TopNav role={role} />
                <div className="mt-4">{children}</div>
              </div>
              {!noFooter && <Footer />}
            </>
          )}
        </div>
      </main>
    </div>
    </MotionConfig>
  );
}
