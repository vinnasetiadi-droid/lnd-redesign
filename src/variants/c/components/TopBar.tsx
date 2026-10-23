import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Bell, ChevronsUpDown, Mail, Search } from "@/variants/c/icons";
import { useAuthStore } from "@/store/useAuthStore";
import profileCutout from "@/variants/c/assets/profile-cutout.png";
import { getSidebarMenu, type SidebarRole } from "./config-sidebar";

/** Mock unread state for the bell's red dot */
const HAS_UNREAD = true;

/** Every page in the sidebar, flattened, for the search box */
function usePages(role: SidebarRole) {
  return useMemo(
    () =>
      getSidebarMenu(role).flatMap((item) => [
        ...(item.path ? [{ label: item.label, group: "", path: item.path }] : []),
        ...(item.submenu ?? []).map((sub) => ({ label: sub.label, group: item.label, path: sub.path })),
      ]),
    [role],
  );
}

/**
 * Search across the sidebar's pages: type to filter, Enter or click to go.
 * ⌘K / Ctrl+K puts the cursor in it from anywhere.
 */
function PageSearch({ role }: { role: SidebarRole }) {
  const navigate = useNavigate();
  const pages = usePages(role);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return pages.filter((p) => `${p.group} ${p.label}`.toLowerCase().includes(q)).slice(0, 6);
  }, [pages, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (path: string) => {
    navigate(path);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div className="relative w-full max-w-[320px]">
      <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--oc-text-muted)" />
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => { setQuery(e.target.value); setCursor(0); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, results.length - 1)); }
          if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
          if (e.key === "Enter" && results[cursor]) go(results[cursor].path);
          if (e.key === "Escape") inputRef.current?.blur();
        }}
        placeholder="Search anything…"
        aria-label="Search pages"
        className="oc-btn-secondary h-10 w-full rounded-(--oc-radius-control) pl-10 pr-12 text-[13px] text-(--oc-text-strong) outline-none transition-shadow placeholder:text-(--oc-text-subtle) focus:shadow-[0_0_0_2px_color-mix(in_srgb,var(--oc-primary)_35%,transparent)]"
      />
      <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-(--oc-radius-chip) bg-(--oc-surface) px-1.5 py-0.5 font-sans text-[11px] text-(--oc-text-muted)">
        ⌘K
      </kbd>

      <AnimatePresence>
        {open && query.trim() && (
          <motion.ul
            role="listbox"
            className="absolute left-0 right-0 top-full z-40 mt-1.5 rounded-(--oc-radius-card) bg-(--oc-white) p-1 shadow-[0_0_0_1px_var(--oc-border),0_8px_24px_-6px_rgba(14,19,28,0.18)]"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {results.length === 0 ? (
              <li className="px-3 py-2 text-[13px] text-(--oc-text-muted)">No pages match “{query.trim()}”</li>
            ) : (
              results.map((p, i) => (
                <li key={p.path}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === cursor}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => go(p.path)}
                    className={cn("flex w-full items-center justify-between gap-3 rounded-(--oc-radius-chip) px-3 py-2 text-left text-[13px] cursor-pointer", i === cursor ? "bg-(--oc-surface) text-(--oc-text-strong)" : "text-(--oc-text-body)")}
                  >
                    {p.label}
                    {p.group && <span className="text-[12px] text-(--oc-text-muted)">{p.group}</span>}
                  </button>
                </li>
              ))
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/** White box with a hairline: the top bar's buttons and profile chip */
const BOX = "oc-btn-secondary rounded-(--oc-radius-control) transition-colors";

/**
 * Option C top bar: the page search on the left; messages, notifications and
 * the profile chip on the right, all white boxes with a hairline and
 * half-round corners.
 */
export function TopBar() {
  const user = useAuthStore((s) => s.user);
  const role = (user?.role ?? "ld_team") as SidebarRole;
  const name = user?.name ?? "Diana Hartwell";
  const handle = "@" + name.toLowerCase().replace(/\s+/g, ".");

  return (
    <header className="flex items-center justify-between gap-4">
      <PageSearch role={role} />

      <div className="flex shrink-0 items-center gap-2">
        <button type="button" aria-label="Messages" className={`${BOX} flex size-10 items-center justify-center text-(--oc-text-body) hover:text-(--oc-text-strong)`}>
          <Mail size={18} />
        </button>

        <button
          type="button"
          aria-label={HAS_UNREAD ? "Notifications, unread" : "Notifications"}
          className={`${BOX} relative flex size-10 items-center justify-center text-(--oc-text-body) hover:text-(--oc-text-strong)`}
        >
          <Bell size={18} />
          {HAS_UNREAD && (
            <span className="absolute right-[10px] top-[9px] size-2 rounded-full bg-(--oc-danger) ring-2 ring-(--oc-white)" />
          )}
        </button>

        {/* Profile chip; the photo stays round (a person) */}
        <button type="button" className={`${BOX} flex h-10 items-center gap-2.5 pl-1 pr-3 text-left`}>
          <span className="size-8 shrink-0 overflow-hidden rounded-full bg-(--oc-primary-50)">
            <img src={profileCutout} alt="" className="size-full object-cover object-top" />
          </span>
          <span className="flex flex-col">
            <span className="text-[11px] leading-[14px] text-(--oc-text-subtle)">{handle}</span>
            <span className="text-[13px] leading-[18px] text-(--oc-text-strong)">{name}</span>
          </span>
          <ChevronsUpDown size={16} className="ml-1 text-(--oc-text-muted)" />
        </button>
      </div>
    </header>
  );
}
