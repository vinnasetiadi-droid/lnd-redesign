import { ReactNode, useState } from "react";
import { MotionConfig } from "motion/react";
import { Sidebar } from "../components/Sidebar";
import { Footer } from "../components/Footer";
import { TopBar } from "../components/TopBar";
import { useAuthStore } from "@/store/useAuthStore";
import type { SidebarRole } from "../components/config-sidebar";
import "../option-b.css";

interface DashboardLayoutProps {
  children: ReactNode;
  noFooter?: boolean;
  fixedContent?: boolean;
  hideSidebar?: boolean;
}

/**
 * Option B shell, after the reference dashboard: the white sidebar runs the
 * full height on the left; on the right a white top bar with a hairline
 * under it, then the page on a plain light background.
 */
export function DashboardLayout({ children, noFooter = false, fixedContent = false, hideSidebar = false }: DashboardLayoutProps) {
  const user = useAuthStore((s) => s.user);
  const role = (user?.role ?? 'ld_team') as SidebarRole;
  // Phones start with the sidebar collapsed so the content keeps its width
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  return (
    <MotionConfig reducedMotion="user">
    <div className="flex h-screen w-full overflow-hidden bg-(--ob-surface-muted) font-sans text-(--ob-text-strong)">
      {!hideSidebar && (
        <div className="relative z-10 h-full flex-shrink-0">
          <Sidebar className="h-full" role={role} isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
        </div>
      )}

      <main className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar />
        {fixedContent ? (
          <div className="min-h-0 flex-1 overflow-hidden p-6">{children}</div>
        ) : (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-clip">
            <div className="flex-1 p-6">{children}</div>
            {!noFooter && <Footer />}
          </div>
        )}
      </main>
    </div>
    </MotionConfig>
  );
}
