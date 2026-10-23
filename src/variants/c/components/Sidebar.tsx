import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/variants/c/motion";
import { LogOut, Minus, PanelLeftClose, PanelLeftOpen, Plus } from "@/variants/c/icons";
import { IMAGES } from "@/assets/images";
import {
  type SidebarRole,
  type SidebarMenuItem,
  getSidebarMenu,
} from "./config-sidebar";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Option C sidebar, after the "Database Operations Center" reference: a
 * floating glass panel (12px from the window edges, half-round corners,
 * half-transparent white with a light blur, a white edge and a soft shadow)
 * over the sky gradient. Menu split
 * into groups by thin dividers, a bottom group pinned to the bottom, Option
 * A's icons, and a light grey box for the active page.
 */

/** Menu groups, top to bottom, by item key. Items not listed join the last group. */
const MENU_GROUPS: string[][] = [
  ["dashboard", "agenda", "circle"],
  ["learning-management", "employee-management", "analytics", "library"],
];
/** Pinned to the bottom of the sidebar */
const BOTTOM_KEYS = new Set(["settings"]);

/** Active page: a white box with a hairline, on the glass */
const ACTIVE_PILL = "bg-(--oc-white)/80 shadow-[0_0_0_1px_var(--oc-border),0_1px_2px_rgba(10,25,41,0.05)]";
/** Hover on the other items */
const HOVER = "hover:bg-(--oc-white)/60";

// ============================================================
// SUB-COMPONENTS
// ============================================================

/** Dark logo from the asset server; falls back to a wordmark when the server is down */
function Logo() {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className="text-[16px] leading-[24px] text-(--oc-text-strong)">
        Learn<span className="text-(--oc-primary)">X</span>pert
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
          "group flex items-center h-9 gap-2.5 rounded-(--oc-radius-control) cursor-pointer select-none transition-colors text-left",
          collapsed ? "justify-center w-9 mx-auto" : "w-full pl-2.5 pr-2",
          pill ? cn(ACTIVE_PILL, "text-(--oc-text-strong)") : danger ? cn("text-(--oc-text-secondary) hover:text-(--oc-danger)", HOVER) : cn("text-(--oc-text-secondary) hover:text-(--oc-text-strong)", HOVER),
        )}
        onClick={handleClick}
      >
        <span
          className={cn(
            "shrink-0 flex items-center justify-center transition-[color,translate] duration-200 group-hover:translate-x-[2px]",
            active || childActive ? "text-(--oc-text-strong)" : danger ? "text-(--oc-text-muted) group-hover:text-(--oc-danger)" : "text-(--oc-text-muted) group-hover:text-(--oc-text-body)",
          )}
        >
          {icon}
        </span>
        {!collapsed && (
          <span className="flex-1 text-[13px] leading-[20px] truncate">{label}</span>
        )}
        {!collapsed && badge !== undefined && (
          <span className="bg-(--oc-primary) text-(--oc-white) text-[11px] rounded-(--oc-radius-chip) h-[18px] min-w-[18px] px-1.5 flex items-center justify-center">
            {badge}
          </span>
        )}
        {/* Minus while open, plus while closed; they swap with a quarter turn */}
        {!collapsed && hasSubmenu && (
          <span className="relative flex size-[14px] shrink-0 items-center justify-center text-(--oc-text-muted)">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={isOpen ? "open" : "closed"}
                className="flex"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
              >
                {isOpen ? <Minus size={14} strokeWidth={1.75} /> : <Plus size={14} strokeWidth={1.75} />}
              </motion.span>
            </AnimatePresence>
          </span>
        )}
      </button>

      {/* Submenu: a tree line from the parent icon, one rounded branch per page.
          It slides open; the pages follow one after another. The wrapper starts
          6px up (inside the parent row's padding) so the clip never cuts the line. */}
      <AnimatePresence initial={false}>
        {hasSubmenu && isOpen && !collapsed && (
          <motion.div
            key="submenu"
            className="pointer-events-none overflow-hidden"
            initial={{ height: 0, marginTop: 0, opacity: 0 }}
            animate={{ height: "auto", marginTop: -6, opacity: 1 }}
            exit={{ height: 0, marginTop: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE_OUT }}
          >
            <motion.div
              className="mb-1 flex flex-col gap-0.5 pt-2"
              variants={SUBMENU_LIST}
              initial="hidden"
              animate="show"
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SubmenuItemProps {
  label: string;
  active?: boolean;
  /** First page: its line starts just under the parent icon */
  first?: boolean;
  /** Last page: the line ends in its rounded branch */
  last?: boolean;
  onClick?: () => void;
}

/** Pages come in one after another, nudged in from the tree line */
const SUBMENU_LIST: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.04 } },
};
const SUBMENU_ITEM: Variants = {
  hidden: { opacity: 0, x: -6 },
  show: { opacity: 1, x: 0, transition: { duration: 0.25, ease: EASE_OUT } },
};

// The tree line sits under the parent icon's centre (10px padding + half of 16px)
const TREE_X = "left-[17px]";
const TREE_LINE = "pointer-events-none absolute border-(--oc-border-control)";

function SubmenuItem({ label, active, first, last, onClick }: SubmenuItemProps) {
  return (
    <motion.div variants={SUBMENU_ITEM} className="pointer-events-auto relative pl-[30px]">
      {/* Straight line on to the next page */}
      {!last && <span aria-hidden className={cn(TREE_LINE, TREE_X, "bottom-0 border-l", first ? "-top-[6px]" : "-top-[2px]")} />}
      {/* Rounded branch into this page */}
      <span
        aria-hidden
        className={cn(TREE_LINE, TREE_X, "w-[9px] rounded-bl-[8px] border-b border-l", first ? "-top-[6px] h-[22px]" : "-top-[2px] h-[18px]")}
      />
      <button
        type="button"
        className={cn(
          "flex h-8 w-full items-center rounded-(--oc-radius-chip) px-2.5 text-left text-[13px] leading-[20px] transition-colors cursor-pointer",
          active ? cn(ACTIVE_PILL, "text-(--oc-text-strong)") : cn("text-(--oc-text-secondary) hover:text-(--oc-text-strong)", HOVER),
        )}
        onClick={onClick}
      >
        <span className="truncate">{label}</span>
      </button>
    </motion.div>
  );
}

function Divider({ collapsed }: { collapsed?: boolean }) {
  return <div className={cn("h-px bg-(--oc-border) my-3", collapsed ? "mx-2" : "mx-1")} />;
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

  // Menus the user opened or closed; untouched ones are open only around the current page
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

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
    const isOpen = openMenus[item.key] ?? !!subPath;
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
        isOpen={isOpen}
        onToggle={() => setOpenMenus((prev) => ({ ...prev, [item.key]: !isOpen }))}
        onClick={() => {
          // Collapsed parents open their first page
          const target = item.path ?? item.submenu?.[0]?.path;
          if (target) navigate(target);
        }}
        collapsed={isCollapsed}
      >
        {hasSubmenu &&
          item.submenu!.map((sub, i, all) => (
            <SubmenuItem
              key={sub.key}
              label={sub.label}
              active={subPath === sub.path}
              first={i === 0}
              last={i === all.length - 1}
              onClick={() => navigate(sub.path)}
            />
          ))}
      </SidebarItem>
    );
  };

  return (
    <aside
      className={cn(
        // Floating glass panel, kept light: half-transparent white, a medium
        // blur (12px), a white edge and a soft shadow, half-round corners
        "h-full flex flex-col font-sans transition-[width] duration-300 ease-in-out",
        "rounded-(--oc-radius-card) bg-(--oc-white)/55 backdrop-blur-md shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7),0_0_0_1px_color-mix(in_srgb,var(--oc-border)_70%,transparent),0_12px_32px_-18px_rgba(10,25,41,0.16)]",
        isCollapsed ? "w-[60px]" : "w-[clamp(196px,15vw,220px)]",
        className,
      )}
    >
      {/* Logo + collapse */}
      <div
        className={cn(
          "flex items-center h-[60px] shrink-0",
          isCollapsed ? "justify-center px-3" : "justify-between pl-4 pr-3",
        )}
      >
        {!isCollapsed && <Logo />}
        <button
          type="button"
          onClick={onToggle}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex items-center justify-center size-7 rounded-(--oc-radius-chip) text-(--oc-text-muted) hover:bg-(--oc-surface) hover:text-(--oc-text-strong) transition-colors"
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
