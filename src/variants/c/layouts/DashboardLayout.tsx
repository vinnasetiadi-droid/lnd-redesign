import { ReactNode, useState } from "react";
import { MotionConfig } from "motion/react";
import { Sidebar } from "../components/Sidebar";
import { Footer } from "../components/Footer";
import { ResponsiveBackground } from "../components/ResponsiveBackground";
import { TopBar } from "../components/TopBar";
import { useAuthStore } from "@/store/useAuthStore";
import type { SidebarRole } from "../components/config-sidebar";
import "../option-c.css";

interface DashboardLayoutProps {
  children: ReactNode;
  noFooter?: boolean;
  fixedContent?: boolean;
  hideSidebar?: boolean;
}

/**
 * Option C shell: a floating sidebar panel 12px from the window edges, over
 * the sky gradient that fades down from the top of the page; the top bar and
 * the content sit beside it.
 */
export function DashboardLayout({ children, noFooter = false, fixedContent = false, hideSidebar = false }: DashboardLayoutProps) {
  const user = useAuthStore((s) => s.user);
  const role = (user?.role ?? 'ld_team') as SidebarRole;
  // Phones start with the sidebar collapsed so the content keeps its width
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  return (
    <MotionConfig reducedMotion="user">
    <div className="flex h-screen w-full font-sans overflow-hidden relative text-(--oc-text-strong)">
      {/* Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <ResponsiveBackground />
      </div>

      {/* Sidebar */}
      {!hideSidebar && (
        <div className="flex-shrink-0 h-full relative z-10 p-3 pr-0">
          <Sidebar className="h-full" role={role} isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col min-h-0 overflow-hidden relative z-10">
        <div className={
          fixedContent
            ? 'flex-1 min-h-0 overflow-hidden px-5 pt-3 pb-4'
            : 'flex-1 min-w-0 overflow-y-auto overflow-x-clip flex flex-col'
        }>
          {fixedContent ? (
            <div className="flex h-full flex-col gap-3">
              <TopBar />
              <div className="min-h-0 flex-1">{children}</div>
            </div>
          ) : (
            <>
              <div className="px-5 pt-3 pb-4 flex-1">
                <TopBar />
                <div className="mt-3">{children}</div>
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
