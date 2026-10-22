import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { ChevronDown, LogOut } from "lucide-react";
import { IMAGES } from "@/assets/images";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import sidebarPattern from "figma:asset/979611ade2ada31818fd630b27e8ae217dea7792.png";
import {
  type SidebarRole,
  type SidebarMenuItem,
  getSidebarMenu,
  buildInitialOpenMenus,
} from "./config-sidebar";
import { useAuthStore } from "@/store/useAuthStore";

// ============================================================
// SUB-COMPONENTS
// ============================================================

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string | number;
  hasSubmenu?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
  children?: React.ReactNode;
  collapsed?: boolean;
}

function SidebarItem({
  icon,
  label,
  active,
  badge,
  hasSubmenu,
  isOpen,
  onToggle,
  onClick,
  children,
  collapsed,
}: SidebarItemProps) {
  const handleClick = () => {
    if (hasSubmenu && !collapsed) {
      onToggle?.();
    } else {
      onClick?.();
    }
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "flex items-center w-full h-10 px-3 gap-[10px] rounded-[12px] cursor-pointer select-none transition-colors text-white tracking-[-0.15px]",
          active ? "bg-white/20" : "hover:bg-white/10",
          collapsed && "justify-center px-0",
        )}
        onClick={handleClick}
      >
        <span className="shrink-0 flex items-center justify-center">{icon}</span>
        {!collapsed && (
          <span className="flex-1 text-[15px] font-normal leading-[16px] truncate">
            {label}
          </span>
        )}
        {!collapsed && badge !== undefined && (
          <div className="bg-white text-[#3e424b] text-[11px] font-semibold rounded-full h-[18px] min-w-[18px] px-1.5 flex items-center justify-center">
            {badge}
          </div>
        )}
        {!collapsed && hasSubmenu && (
          <ChevronDown
            size={14}
            className={cn(
              "text-white/80 transition-transform duration-200 shrink-0",
              isOpen && "rotate-180",
            )}
          />
        )}
      </div>

      {/* Submenu */}
      {hasSubmenu && isOpen && !collapsed && (
        <div className="flex flex-col mt-1 ml-[20px] gap-1">
          {children}
        </div>
      )}
    </div>
  );
}

interface SubmenuItemProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function SubmenuItem({ label, active, onClick }: SubmenuItemProps) {
  return (
    <div
      className={cn(
        "flex items-center h-8 px-3 rounded-[12px] cursor-pointer transition-colors text-[14px] font-normal leading-[20px]",
        active
          ? "bg-[#1570EF] text-white"
          : "text-[#F5F5F5] hover:bg-white/10",
      )}
      style={{ fontFamily: "'Poppins', sans-serif" }}
      onClick={onClick}
    >
      {label}
    </div>
  );
}

// ============================================================
// MAIN SIDEBAR
// ============================================================

interface SidebarProps {
  className?: string;
  role?: SidebarRole;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ className, role = "ld_team", isCollapsed = false, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const logout = useAuthStore((s) => s.logout);

  const menuItems = useMemo(() => getSidebarMenu(role), [role]);

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() =>
    buildInitialOpenMenus(menuItems),
  );

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isItemActive = (item: SidebarMenuItem): boolean => {
    if (item.path && pathname === item.path) return true;
    if (item.submenu) {
      return item.submenu.some((sub) => {
        // Exact match
        if (pathname === sub.path) return true;
        // Child path match (but not if another submenu item is a better match)
        if (pathname.startsWith(sub.path + "/")) {
          // Check if there's a more specific submenu item that matches
          const hasMoreSpecificMatch = item.submenu!.some(
            (other) => other.path !== sub.path && pathname.startsWith(other.path + "/")
          );
          return !hasMoreSpecificMatch;
        }
        return false;
      });
    }
    return false;
  };

  return (
    <aside
      className={cn(
        "h-full flex flex-col relative font-sans z-[999] transition-all duration-300 ease-in-out rounded-[32px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.15)] bg-gradient-to-b from-[#000066] from-[36%] via-[#00A3FF] via-[90%] to-[#33E5C9]",
        isCollapsed ? "w-[72px]" : "w-[260px]",
        className,
      )}
    >
      {/* Logo Header */}
      <div className={cn("flex items-center justify-center px-6 pt-6 pb-4 shrink-0 border-b border-white/10")}>
        <ImageWithFallback
          src={isCollapsed ? IMAGES.icons.collapse_lx : IMAGES.icons.white_lx}
          alt="LearnXpert Logo"
          className="h-[52px] w-auto object-contain"
        />
      </div>

      {/* Menu area */}
      <div
        className={cn(
          "flex-1 overflow-y-auto no-scrollbar flex flex-col gap-[10px] overflow-x-hidden py-4",
          isCollapsed ? "px-2" : "px-3",
        )}
      >
        {menuItems.map((item) => {
          const active = isItemActive(item);
          const hasSubmenu = !!(item.submenu && item.submenu.length > 0);
          const Icon = item.icon;

          return (
            <SidebarItem
              key={item.key}
              icon={<Icon size={16} />}
              label={item.label}
              active={active}
              badge={item.badge}
              hasSubmenu={hasSubmenu}
              isOpen={active || openMenus[item.key]}
              onToggle={() => toggleMenu(item.key)}
              onClick={
                item.path ? () => navigate(item.path!) : undefined
              }
              collapsed={isCollapsed}
            >
              {hasSubmenu &&
                item.submenu!.map((sub) => {
                  // Sort submenu paths by length (longest first) to check most specific first
                  const allSubPaths = item.submenu!.map(s => s.path).sort((a, b) => b.length - a.length);
                  
                  // Find the most specific matching path
                  const mostSpecificMatch = allSubPaths.find(
                    p => pathname === p || pathname.startsWith(p + "/")
                  );
                  
                  // This submenu item is active only if it's the most specific match
                  const isActive = mostSpecificMatch === sub.path;
                  
                  return (
                    <SubmenuItem
                      key={sub.key}
                      label={sub.label}
                      active={isActive}
                      onClick={() => navigate(sub.path)}
                    />
                  );
                })}
            </SidebarItem>
          );
        })}
      </div>

      {/* Footer — Logout */}
      {!isCollapsed && (
        <div className="mt-auto px-3 pb-4 shrink-0 relative z-10">
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full flex items-center gap-[10px] h-10 px-3 rounded-[16px] cursor-pointer select-none transition-colors bg-white/40 backdrop-blur-sm text-white border border-white/30 hover:bg-white/50"
          >
            <span className="shrink-0 flex items-center justify-center">
              <LogOut size={16} />
            </span>
            <span className="text-[14px] font-semibold leading-[16px]">
              Logout
            </span>
          </button>
        </div>
      )}

      {/* Collapsed logout icon */}
      {isCollapsed && (
        <div className="mt-auto px-2 pb-4 shrink-0 relative z-10">
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full flex items-center justify-center h-8 rounded-[12px] cursor-pointer transition-colors bg-white text-[#535862] hover:bg-white/90"
          >
            <LogOut size={16} />
          </button>
        </div>
      )}

      {/* Bottom decorative pattern */}
      <img
        src={sidebarPattern}
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-full pointer-events-none select-none opacity-30"
      />

      {/* Bottom decorative overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-[280px] opacity-20 pointer-events-none rounded-b-[20px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent rounded-full scale-150 -translate-x-1/4 translate-y-1/4" />
      </div>
    </aside>
  );
}