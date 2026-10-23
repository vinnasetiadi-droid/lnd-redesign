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
 * Option C shell: the sidebar sits flush on the left edge over the same
 * iridescent background as the content (ref 1), instead of a floating card.
 */
export function DashboardLayout({ children, noFooter = false, fixedContent = false, hideSidebar = false }: DashboardLayoutProps) {
  const user = useAuthStore((s) => s.user);
  const role = (user?.role ?? 'ld_team') as SidebarRole;
  // Phones start with the sidebar collapsed so the content keeps its width
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  return (
    <MotionConfig reducedMotion="user">
    <div className="flex h-screen w-full font-sans overflow-hidden relative text-[#181D27]">
      {/* Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <ResponsiveBackground />
      </div>

      {/* Sidebar */}
      {!hideSidebar && (
        <div className="flex-shrink-0 h-full relative z-10">
          <Sidebar className="h-full" role={role} isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col min-h-0 overflow-hidden relative z-10">
        <div className={
          fixedContent
            ? 'flex-1 min-h-0 overflow-hidden pl-0 pr-4 pt-3 pb-4'
            : 'flex-1 min-w-0 overflow-y-auto overflow-x-clip flex flex-col'
        }>
          {fixedContent ? (
            <div className="flex h-full flex-col gap-3">
              <TopBar />
              <div className="min-h-0 flex-1">{children}</div>
            </div>
          ) : (
            <>
              <div className="pl-0 pr-4 pt-3 pb-4 flex-1">
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
