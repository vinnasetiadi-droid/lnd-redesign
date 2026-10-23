import { Bell, ChevronsUpDown, Mail } from "@/variants/b/icons";
import { useAuthStore } from "@/store/useAuthStore";
import profileCutout from "@/variants/b/assets/profile-cutout.png";

/** Mock unread state for the bell's red dot */
const HAS_UNREAD = true;

/**
 * Option B top bar: white pill buttons on the page background, aligned right
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
        className="flex size-11 items-center justify-center rounded-full bg-white text-[#282828] transition-colors hover:bg-[#F9FAFB]"
      >
        <Mail size={20} />
      </button>

      <button
        type="button"
        aria-label={HAS_UNREAD ? "Notifications, unread" : "Notifications"}
        className="relative flex size-11 items-center justify-center rounded-full bg-white text-[#282828] transition-colors hover:bg-[#F9FAFB]"
      >
        <Bell size={20} />
        {HAS_UNREAD && (
          <span className="absolute right-[12px] top-[11px] size-2 rounded-full bg-[#F04438] ring-2 ring-white" />
        )}
      </button>

      {/* Profile chip */}
      <button
        type="button"
        className="flex h-11 items-center gap-2.5 rounded-full bg-white pl-1 pr-3.5 text-left transition-colors hover:bg-[#F9FAFB]"
      >
        <span className="size-9 shrink-0 overflow-hidden rounded-full bg-[#E8F0FE]">
          <img src={profileCutout} alt="" className="size-full object-cover object-top" />
        </span>
        <span className="flex flex-col">
          <span className="text-[11px] leading-[14px] text-[#A4A7AE]">{handle}</span>
          <span className="text-[13px] leading-[18px] text-[#181D27]">{name}</span>
        </span>
        <ChevronsUpDown size={16} className="ml-1 text-[#717680]" />
      </button>
    </header>
  );
}
