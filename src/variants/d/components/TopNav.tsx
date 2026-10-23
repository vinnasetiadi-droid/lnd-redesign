import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/variants/d/motion";
import { Bell, ChevronDown, LogOut, Mail, Settings } from "@/variants/d/icons";
import { IMAGES } from "@/assets/images";
import { useAuthStore } from "@/store/useAuthStore";
import profileCutout from "@/variants/d/assets/profile-cutout.png";
import { getSidebarMenu, type SidebarMenuItem, type SidebarRole } from "./config-sidebar";

/**
 * Option D top navigation, after the Ultraleads and Taski references: the
 * logo on the left, the menu as pills in one white bar in the middle (the
 * current section a solid teal pill, sections with pages open a small menu),
 * and messages, notifications and the profile on the right. Settings and
 * Logout live in the profile menu. It replaces the sidebar.
 */

/** Mock unread state for the bell's red dot */
const HAS_UNREAD = true;

/** In the profile menu instead of the bar */
const PROFILE_KEYS = new Set(["settings"]);

function Logo() {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className="text-[16px] leading-[24px] text-(--od-text-strong)">
        Learn<span className="text-(--od-primary)">X</span>pert
      </span>
    );
  }
  return <img src={IMAGES.icons.black_lx} alt="LearnXpert" className="h-[32px] w-auto object-contain" onError={() => setFailed(true)} />;
}

/** Closes a menu on a click outside it or Escape */
function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);
  return ref;
}

const MENU_CARD = "absolute top-full z-30 mt-2 min-w-[184px] rounded-[14px] bg-(--od-white) p-1 shadow-[0_12px_32px_-8px_rgba(16,24,40,0.18),0_2px_4px_rgba(16,24,40,0.04)]";
const MENU_MOTION = {
  initial: { opacity: 0, y: -4, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -4, scale: 0.98 },
  transition: { duration: 0.16, ease: EASE_OUT },
} as const;
const MENU_ITEM = "flex h-9 w-full items-center gap-2 rounded-[10px] px-3 text-left text-[13px] transition-colors cursor-pointer";

function NavItem({ item, pathname, open, onOpen, onClose }: {
  item: SidebarMenuItem;
  pathname: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const ref = useDismiss(open, onClose);
  const pages = item.submenu ?? [];
  // Most specific page that matches the current path
  const activeSub = pages
    .map((s) => s.path)
    .sort((a, b) => b.length - a.length)
    .find((p) => pathname === p || pathname.startsWith(p + "/"));
  const active = (!!item.path && pathname === item.path) || !!activeSub;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup={pages.length ? "menu" : undefined}
        aria-expanded={pages.length ? open : undefined}
        aria-current={active ? "page" : undefined}
        onClick={() => (pages.length ? (open ? onClose() : onOpen()) : item.path && navigate(item.path))}
        className={cn(
          "relative flex h-9 items-center gap-1 whitespace-nowrap rounded-full px-4 text-[13px] transition-colors cursor-pointer",
          active ? "text-(--od-white)" : "text-(--od-text-secondary) hover:text-(--od-text-strong)",
        )}
      >
        {/* The teal pill slides to the current section */}
        {active && (
          <motion.span
            layoutId="od-nav-active"
            className="absolute inset-0 rounded-full bg-(--od-primary)"
            transition={{ duration: 0.35, ease: EASE_OUT }}
          />
        )}
        <span className="relative">{item.label}</span>
        {pages.length > 0 && (
          <ChevronDown size={14} className={cn("relative transition-transform duration-200", open && "rotate-180", active ? "text-(--od-white)/80" : "text-(--od-text-subtle)")} />
        )}
        {item.badge !== undefined && (
          <span className="relative ml-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-(--od-primary) px-1.5 text-[11px] text-(--od-white)">
            {item.badge}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && pages.length > 0 && (
          <motion.div role="menu" className={cn(MENU_CARD, "left-0 origin-top-left")} {...MENU_MOTION}>
            {pages.map((page) => (
              <button
                key={page.key}
                type="button"
                role="menuitem"
                onClick={() => {
                  onClose();
                  navigate(page.path);
                }}
                className={cn(
                  MENU_ITEM,
                  activeSub === page.path
                    ? "bg-(--od-primary-50) text-(--od-primary-strong)"
                    : "text-(--od-text-body) hover:bg-(--od-surface-subtle) hover:text-(--od-text-strong)",
                )}
              >
                {page.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfileMenu({ settings }: { settings?: SidebarMenuItem }) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));
  const name = user?.name ?? "Diana Hartwell";
  const handle = "@" + name.toLowerCase().replace(/\s+/g, ".");

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 items-center gap-2.5 rounded-full bg-(--od-white) pl-1 pr-3 text-left transition-colors hover:bg-(--od-surface-subtle) cursor-pointer"
      >
        <span className="size-9 shrink-0 overflow-hidden rounded-full bg-(--od-primary-50)">
          <img src={profileCutout} alt="" className="size-full object-cover object-top" />
        </span>
        <span className="flex flex-col">
          <span className="text-[13px] leading-[18px] text-(--od-text-strong)">{name}</span>
          <span className="text-[11px] leading-[14px] text-(--od-text-subtle)">{handle}</span>
        </span>
        <ChevronDown size={14} className={cn("ml-1 text-(--od-text-muted) transition-transform duration-200", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div role="menu" className={cn(MENU_CARD, "right-0 origin-top-right")} {...MENU_MOTION}>
            {settings?.path && (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  navigate(settings.path!);
                }}
                className={cn(MENU_ITEM, "text-(--od-text-body) hover:bg-(--od-surface-subtle) hover:text-(--od-text-strong)")}
              >
                <Settings size={16} className="text-(--od-text-muted)" />
                {settings.label}
              </button>
            )}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                logout();
                navigate("/");
              }}
              className={cn(MENU_ITEM, "text-(--od-text-body) hover:bg-(--od-danger-surface) hover:text-(--od-danger)")}
            >
              <LogOut size={16} />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const ICON_BUTTON = "relative flex size-11 items-center justify-center rounded-full bg-(--od-white) text-(--od-text-body) transition-colors hover:bg-(--od-surface-subtle) cursor-pointer";

export function TopNav({ role = "ld_team" }: { role?: SidebarRole }) {
  const { pathname } = useLocation();
  const menu = useMemo(() => getSidebarMenu(role), [role]);
  const barItems = menu.filter((item) => !PROFILE_KEYS.has(item.key));
  const settings = menu.find((item) => PROFILE_KEYS.has(item.key));
  // One open menu at a time
  const [openKey, setOpenKey] = useState<string | null>(null);

  // A new page closes any open menu
  useEffect(() => setOpenKey(null), [pathname]);

  return (
    <header className="flex items-center gap-4">
      <div className="flex min-w-[148px] flex-1 items-center">
        <Logo />
      </div>

      <nav aria-label="Main" className="flex shrink-0 items-center gap-0.5 rounded-full bg-(--od-white) p-1">
        {barItems.map((item) => (
          <NavItem
            key={item.key}
            item={item}
            pathname={pathname}
            open={openKey === item.key}
            onOpen={() => setOpenKey(item.key)}
            onClose={() => setOpenKey((k) => (k === item.key ? null : k))}
          />
        ))}
      </nav>

      <div className="flex min-w-[148px] flex-1 items-center justify-end gap-2">
        <button type="button" aria-label="Messages" className={ICON_BUTTON}>
          <Mail size={20} />
        </button>
        <button type="button" aria-label={HAS_UNREAD ? "Notifications, unread" : "Notifications"} className={ICON_BUTTON}>
          <Bell size={20} />
          {HAS_UNREAD && <span className="absolute right-[12px] top-[11px] size-2 rounded-full bg-(--od-danger-bright) ring-2 ring-(--od-white)" />}
        </button>
        <ProfileMenu settings={settings} />
      </div>
    </header>
  );
}
