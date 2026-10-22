import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { ChevronDown, LogOut, PanelLeftClose, PanelLeftOpen } from "@/variants/a/icons";
import { IMAGES } from "@/assets/images";
import {
  type SidebarRole,
  type SidebarMenuItem,
  getSidebarMenu,
  buildInitialOpenMenus,
} from "./config-sidebar";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Option A sidebar, shaped like ref 1 (Finora): transparent over the page
 * background, menu split into groups by thin dividers, a bottom group pinned
 * to the bottom, regular-weight labels and a white pill for the active page.
 */

/** Menu groups, top to bottom, by item key. Items not listed join the last group. */
const MENU_GROUPS: string[][] = [
  ["dashboard", "agenda", "circle"],
  ["learning-management", "employee-management", "analytics", "library"],
];
/** Pinned to the bottom of the sidebar */
const BOTTOM_KEYS = new Set(["settings"]);

/** Active page: a light blue tint, no white frame */
const ACTIVE_PILL = "bg-[#1A73E8]/[0.07]";

// ============================================================
// SUB-COMPONENTS
// ============================================================

/** Dark logo from the asset server; falls back to a wordmark when the server is down */
function Logo() {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className="text-[16px] leading-[24px] text-[#181D27]">
        Learn<span className="text-[#1A73E8]">X</span>pert
      </span>
    );
  }
  return (
    <img
      src={IMAGES.icons.black_lx}
      alt="LearnXpert"
      className="h-[34px] w-auto object-contain"
      onError={() => setFailed(true)}
    />
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  /** A submenu child is the current page */
  childActive?: boolean;
  badge?: string | number;
  hasSubmenu?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
  children?: React.ReactNode;
  collapsed?: boolean;
  /** Logout: red on hover */
  danger?: boolean;
}

function SidebarItem({
  icon,
  label,
  active,
  childActive,
  badge,
  hasSubmenu,
  isOpen,
  onToggle,
  onClick,
  children,
  collapsed,
  danger,
}: SidebarItemProps) {
  const handleClick = () => {
    if (hasSubmenu && !collapsed) {
      onToggle?.();
    } else {
      onClick?.();
    }
  };

  // While collapsed there is no submenu to show, so the parent takes the pill
  const pill = active || (collapsed && childActive);

  return (
    <div className="w-full">
      <button
        type="button"
        title={collapsed ? label : undefined}
        className={cn(
          "group flex items-center h-8 gap-2 rounded-[8px] cursor-pointer select-none transition-colors text-left",
          collapsed ? "justify-center w-8 mx-auto" : "w-full pl-2.5 pr-2",
          pill ? cn(ACTIVE_PILL, "text-[#181D27]") : danger ? "text-[#535862] hover:bg-[#1A73E8]/[0.04] hover:text-[#D92D20]" : "text-[#535862] hover:bg-[#1A73E8]/[0.04] hover:text-[#181D27]",
        )}
        onClick={handleClick}
      >
        <span
          className={cn(
            "shrink-0 flex items-center justify-center transition-[color,translate] duration-200 group-hover:translate-x-[2px]",
            active || childActive ? "text-[#181D27]" : danger ? "text-[#717680] group-hover:text-[#D92D20]" : "text-[#717680] group-hover:text-[#414651]",
          )}
        >
          {icon}
        </span>
        {!collapsed && (
          <span className="flex-1 text-[13px] leading-[20px] truncate">{label}</span>
        )}
        {!collapsed && badge !== undefined && (
          <span className="bg-[#1A73E8] text-white text-[11px] rounded-full h-[18px] min-w-[18px] px-1.5 flex items-center justify-center">
            {badge}
          </span>
        )}
        {!collapsed && hasSubmenu && (
          <ChevronDown
            size={13}
            strokeWidth={1.75}
            className={cn("text-[#717680] transition-transform duration-200 shrink-0", isOpen && "rotate-180")}
          />
        )}
      </button>

      {/* Submenu: indented to line up with the parent label */}
      {hasSubmenu && isOpen && !collapsed && (
        <div className="flex flex-col gap-0.5 mt-0.5 mb-1">{children}</div>
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
    <button
      type="button"
      className={cn(
        "flex items-center h-7 pl-[34px] pr-2 rounded-[8px] cursor-pointer transition-colors text-[12px] leading-[18px] text-left",
        active ? cn(ACTIVE_PILL, "text-[#181D27]") : "text-[#717680] hover:bg-[#1A73E8]/[0.04] hover:text-[#181D27]",
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function Divider({ collapsed }: { collapsed?: boolean }) {
  return <div className={cn("h-px bg-[#EDEEF1] my-3", collapsed ? "mx-3" : "mx-1")} />;
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

  const { groups, bottomItems } = useMemo(() => {
    const byKey = new Map(menuItems.map((item) => [item.key, item]));
    const used = new Set<string>();
    const grouped = MENU_GROUPS.map((keys) =>
      keys.flatMap((key) => {
        const item = byKey.get(key);
        if (!item) return [];
        used.add(key);
        return [item];
      }),
    );
    const rest = menuItems.filter((item) => !used.has(item.key) && !BOTTOM_KEYS.has(item.key));
    grouped[grouped.length - 1].push(...rest);
    return {
      groups: grouped.filter((g) => g.length > 0),
      bottomItems: menuItems.filter((item) => BOTTOM_KEYS.has(item.key)),
    };
  }, [menuItems]);

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() =>
    buildInitialOpenMenus(menuItems),
  );

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Most specific submenu path that matches the current page
  const activeSubPath = (item: SidebarMenuItem): string | undefined =>
    item.submenu
      ?.map((s) => s.path)
      .sort((a, b) => b.length - a.length)
      .find((p) => pathname === p || pathname.startsWith(p + "/"));

  const renderItem = (item: SidebarMenuItem) => {
    const hasSubmenu = !!(item.submenu && item.submenu.length > 0);
    const active = !!item.path && pathname === item.path;
    const subPath = activeSubPath(item);
    const Icon = item.icon;

    return (
      <SidebarItem
        key={item.key}
        icon={<Icon size={16} strokeWidth={1.5} />}
        label={item.label}
        active={active}
        childActive={!!subPath}
        badge={item.badge}
        hasSubmenu={hasSubmenu}
        isOpen={!!subPath || openMenus[item.key]}
        onToggle={() => toggleMenu(item.key)}
        onClick={() => {
          // Collapsed parents open their first page
          const target = item.path ?? item.submenu?.[0]?.path;
          if (target) navigate(target);
        }}
        collapsed={isCollapsed}
      >
        {hasSubmenu &&
          item.submenu!.map((sub) => (
            <SubmenuItem
              key={sub.key}
              label={sub.label}
              active={subPath === sub.path}
              onClick={() => navigate(sub.path)}
            />
          ))}
      </SidebarItem>
    );
  };

  return (
    <aside
      className={cn(
        "h-full flex flex-col font-sans transition-[width] duration-300 ease-in-out",
        isCollapsed ? "w-[56px]" : "w-[clamp(184px,14vw,208px)]",
        className,
      )}
    >
      {/* Logo + collapse */}
      <div
        className={cn(
          "flex items-center h-[56px] shrink-0",
          isCollapsed ? "justify-center px-3" : "justify-between pl-5 pr-3",
        )}
      >
        {!isCollapsed && <Logo />}
        <button
          type="button"
          onClick={onToggle}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex items-center justify-center size-7 rounded-[8px] text-[#717680] hover:text-[#181D27] transition-colors"
        >
          {isCollapsed ? <PanelLeftOpen size={16} strokeWidth={1.5} /> : <PanelLeftClose size={16} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Main menu, groups split by dividers */}
      <nav className={cn("flex-1 overflow-y-auto no-scrollbar overflow-x-hidden pt-1", isCollapsed ? "px-3" : "px-3")}>
        {groups.map((group, i) => (
          <div key={i}>
            {i > 0 && <Divider collapsed={isCollapsed} />}
            <div className="flex flex-col gap-1">{group.map(renderItem)}</div>
          </div>
        ))}
      </nav>

      {/* Bottom group */}
      <div className={cn("shrink-0 flex flex-col gap-1 pt-3 pb-4", isCollapsed ? "px-3" : "px-3")}>
        {bottomItems.map(renderItem)}
        <SidebarItem
          icon={<LogOut size={16} strokeWidth={1.5} />}
          label="Logout"
          collapsed={isCollapsed}
          danger
          onClick={() => {
            logout();
            navigate("/");
          }}
        />
      </div>
    </aside>
  );
}
