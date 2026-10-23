import { Bell, ChevronsUpDown, Mail } from "@/variants/a/icons";
import { useAuthStore } from "@/store/useAuthStore";
import profileCutout from "@/variants/a/assets/profile-cutout.png";

/** Mock unread state for the bell's red dot */
const HAS_UNREAD = true;

/**
 * Option A top bar: white pill buttons on the page background, aligned right
 * (messages, notifications and the profile chip).
 */
export function TopBar() {
  const user = useAuthStore((s) => s.user);
  const name = user?.name ?? "Diana Hartwell";
  const handle = "@" + name.toLowerCase().replace(/\s+/g, ".");

  return (
    <header className="flex items-center justify-end gap-2">
      <button
        type="button"
        aria-label="Messages"
        className="flex size-11 items-center justify-center rounded-full bg-(--oa-white) text-(--oa-text-ai) transition-colors hover:bg-(--oa-surface-subtle)"
      >
        <Mail size={20} />
      </button>

      <button
        type="button"
        aria-label={HAS_UNREAD ? "Notifications, unread" : "Notifications"}
        className="relative flex size-11 items-center justify-center rounded-full bg-(--oa-white) text-(--oa-text-ai) transition-colors hover:bg-(--oa-surface-subtle)"
      >
        <Bell size={20} />
        {HAS_UNREAD && (
          <span className="absolute right-[12px] top-[11px] size-2 rounded-full bg-[#F04438] ring-2 ring-(--oa-white)" />
        )}
      </button>

      {/* Profile chip */}
      <button
        type="button"
        className="flex h-11 items-center gap-2.5 rounded-full bg-(--oa-white) pl-1 pr-3.5 text-left transition-colors hover:bg-(--oa-surface-subtle)"
      >
        <span className="size-9 shrink-0 overflow-hidden rounded-full bg-(--oa-primary-50)">
          <img src={profileCutout} alt="" className="size-full object-cover object-top" />
        </span>
        <span className="flex flex-col">
          <span className="text-[11px] leading-[14px] text-(--oa-text-subtle)">{handle}</span>
          <span className="text-[13px] leading-[18px] text-(--oa-text-strong)">{name}</span>
        </span>
        <ChevronsUpDown size={16} className="ml-1 text-(--oa-text-muted)" />
      </button>
    </header>
  );
}
