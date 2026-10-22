import { ReactNode, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Footer } from "../components/Footer";
import { ResponsiveBackground } from "../components/ResponsiveBackground";
import { useAuthStore } from "@/store/useAuthStore";
import type { SidebarRole } from "../components/config-sidebar";
import { CircleChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  noFooter?: boolean;
  fixedContent?: boolean;
  hideSidebar?: boolean;
}

export function DashboardLayout({ children, noFooter = false, fixedContent = false, hideSidebar = false }: DashboardLayoutProps) {
  const user = useAuthStore((s) => s.user);
  const role = (user?.role ?? 'ld_team') as SidebarRole;
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden relative">
      {/* Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <ResponsiveBackground />
      </div>

      {/* Sidebar */}
      {!hideSidebar && (
        <div className="flex-shrink-0 h-full relative z-10 p-5 pr-1">
          <Sidebar className="h-full" role={role} isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
          {/* Collapse toggle button */}
          <button
            onClick={toggleSidebar}
            className="absolute -right-[13px] top-[61px] z-[1000] w-[26px] h-[26px] rounded-full bg-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.12)] cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.16)] transition-shadow"
          >
            <CircleChevronRight
              size={18}
              className={cn(
                "text-[#1570EF] transition-transform duration-300",
                !isSidebarCollapsed && "rotate-180"
              )}
            />
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col min-h-0 overflow-hidden relative z-10">
        <div className={
          fixedContent
            ? 'flex-1 min-h-0 overflow-hidden px-8 py-6'
            : 'flex-1 min-w-0 overflow-y-auto overflow-x-clip flex flex-col'
        }>
          {fixedContent ? (
            children
          ) : (
            <>
              <div className="px-8 py-6 flex-1">
                {children}
              </div>
              {!noFooter && <Footer />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}