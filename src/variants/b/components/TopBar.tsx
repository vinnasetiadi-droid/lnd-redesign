import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Bell, Mail, Search } from "@/variants/b/icons";
import { useAuthStore } from "@/store/useAuthStore";
import profilePhoto from "@/variants/b/assets/profile-photo.jpg";
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
    <div className="relative w-full max-w-[280px]">
      <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--ob-text-muted)" />
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
        className="h-10 w-full rounded-full bg-(--ob-white) pl-10 pr-12 text-[13px] text-(--ob-text-strong) outline-none ring-1 ring-(--ob-border) transition-shadow placeholder:text-(--ob-text-subtle) focus:ring-2 focus:ring-(--ob-primary)/30"
      />
      <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-[6px] bg-(--ob-surface) px-1.5 py-0.5 font-sans text-[11px] text-(--ob-text-muted)">
        ⌘K
      </kbd>

      <AnimatePresence>
        {open && query.trim() && (
          <motion.ul
            role="listbox"
            className="absolute left-0 right-0 top-full z-40 mt-1.5 rounded-[14px] bg-(--ob-white) p-1 shadow-[0_8px_24px_-6px_rgba(16,24,40,0.18),0_2px_4px_rgba(16,24,40,0.04)]"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {results.length === 0 ? (
              <li className="px-3 py-2 text-[13px] text-(--ob-text-muted)">No pages match “{query.trim()}”</li>
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
                    className={cn("flex w-full items-center justify-between gap-3 rounded-[10px] px-3 py-2 text-left text-[13px] cursor-pointer", i === cursor ? "bg-(--ob-surface) text-(--ob-text-strong)" : "text-(--ob-text-body)")}
                  >
                    {p.label}
                    {p.group && <span className="text-[12px] text-(--ob-text-muted)">{p.group}</span>}
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

const ROUND_BUTTON =
  "ob-btn-secondary relative flex size-10 items-center justify-center rounded-full text-(--ob-text-body) transition-colors hover:text-(--ob-text-strong) cursor-pointer";

/**
 * Option B top bar, after the reference: a white frame across the content
 * with a hairline under it, search on the left, round icon buttons and the
 * profile photo on the right.
 */
export function TopBar() {
  const user = useAuthStore((s) => s.user);
  const name = user?.name ?? "Diana Hartwell";
  const role = (user?.role ?? "ld_team") as SidebarRole;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-(--ob-border) bg-(--ob-white) px-6">
      <PageSearch role={role} />

      <div className="flex items-center gap-2.5">
        <button type="button" aria-label="Messages" className={ROUND_BUTTON}>
          <Mail size={18} />
        </button>
        <button type="button" aria-label={HAS_UNREAD ? "Notifications, unread" : "Notifications"} className={ROUND_BUTTON}>
          <Bell size={18} />
          {HAS_UNREAD && <span className="absolute right-[10px] top-[9px] size-2 rounded-full bg-(--ob-danger) ring-2 ring-(--ob-white)" />}
        </button>
        <button
          type="button"
          aria-label={`${name}, profile`}
          title={name}
          className="size-10 overflow-hidden rounded-full bg-(--ob-primary-50) ring-1 ring-(--ob-border) transition-shadow hover:ring-2 hover:ring-(--ob-primary)/30"
        >
          <img src={profilePhoto} alt="" className="size-full object-cover" />
        </button>
      </div>
    </header>
  );
}
