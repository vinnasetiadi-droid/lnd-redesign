import { forwardRef, type ComponentType, type SVGProps } from 'react';

/**
 * Option B icons: Tabler Icons (outline set, v3.19.0, MIT licence,
 * https://tabler.io/icons), copied in as path data so the app needs no extra
 * package. They keep the lucide-react names the pages already use, so a page
 * imports `from '@/variants/b/icons'` exactly as before. The comment after
 * each icon is its Tabler name, for swapping one later.
 *
 * Every icon draws at stroke 1.5, whatever strokeWidth a call site passes,
 * to keep one thin line across the option.
 */

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  size?: number | string;
  strokeWidth?: number;
}

/** Kept under the lucide name so existing `icon: LucideIcon` types still work */
export type LucideIcon = ComponentType<IconProps>;

const STROKE = 1.5;

function icon(paths: string[], name: string): LucideIcon {
  const Icon = forwardRef<SVGSVGElement, IconProps>(({ size = 24, strokeWidth: _ignored, ...rest }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  ));
  Icon.displayName = name;
  return Icon;
}

export const Activity = icon(["M3 12h4l3 8l4 -16l3 8h4"], 'Activity'); // activity
export const AlertCircle = icon(["M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0", "M12 8v4", "M12 16h.01"], 'AlertCircle'); // alert-circle
export const AlertTriangle = icon(["M12 9v4", "M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z", "M12 16h.01"], 'AlertTriangle'); // alert-triangle
export const TriangleAlert = AlertTriangle;
export const ArrowDown = icon(["M12 5l0 14", "M18 13l-6 6", "M6 13l6 6"], 'ArrowDown'); // arrow-down
export const ArrowDownRight = icon(["M7 7l10 10", "M17 8l0 9l-9 0"], 'ArrowDownRight'); // arrow-down-right
export const ArrowRight = icon(["M5 12l14 0", "M13 18l6 -6", "M13 6l6 6"], 'ArrowRight'); // arrow-right
export const ArrowUp = icon(["M12 5l0 14", "M18 11l-6 -6", "M6 11l6 -6"], 'ArrowUp'); // arrow-up
export const ArrowUpDown = icon(["M3 9l4 -4l4 4m-4 -4v14", "M21 15l-4 4l-4 -4m4 4v-14"], 'ArrowUpDown'); // arrows-sort
export const ArrowUpRight = icon(["M17 7l-10 10", "M8 7l9 0l0 9"], 'ArrowUpRight'); // arrow-up-right
export const BarChart2 = icon(["M3 13a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z", "M15 9a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z", "M9 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z", "M4 20h14"], 'BarChart2'); // chart-bar
export const Bell = icon(["M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6", "M9 17v1a3 3 0 0 0 6 0v-1"], 'Bell'); // bell
export const BookMarked = icon(["M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12z", "M19 16h-12a2 2 0 0 0 -2 2", "M9 8h6"], 'BookMarked'); // book-2
export const BookOpen = icon(["M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0", "M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0", "M3 6l0 13", "M12 6l0 13", "M21 6l0 13"], 'BookOpen'); // book
export const Building2 = icon(["M3 21l18 0", "M9 8l1 0", "M9 12l1 0", "M9 16l1 0", "M14 8l1 0", "M14 12l1 0", "M14 16l1 0", "M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16"], 'Building2'); // building
export const Calendar = icon(["M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z", "M16 3v4", "M8 3v4", "M4 11h16", "M11 15h1", "M12 15v3"], 'Calendar'); // calendar
export const CalendarDays = Calendar;
export const CalendarClock = icon(["M11.795 21h-6.795a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4", "M18 18m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0", "M15 3v4", "M7 3v4", "M3 11h16", "M18 16.496v1.504l1 1"], 'CalendarClock'); // calendar-time
export const CheckCircle2 = icon(["M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0", "M9 12l2 2l4 -4"], 'CheckCircle2'); // circle-check
export const Check = icon(["M5 12l5 5l10 -10"], 'Check'); // check
export const ShieldCheck = icon(["M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06", "M15 19l2 2l4 -4"], 'ShieldCheck'); // shield-check
export const ChevronDown = icon(["M6 9l6 6l6 -6"], 'ChevronDown'); // chevron-down
export const ChevronLeft = icon(["M15 6l-6 6l6 6"], 'ChevronLeft'); // chevron-left
export const ChevronRight = icon(["M9 6l6 6l-6 6"], 'ChevronRight'); // chevron-right
export const ChevronUp = icon(["M6 15l6 -6l6 6"], 'ChevronUp'); // chevron-up
export const ChevronsUpDown = icon(["M8 9l4 -4l4 4", "M16 15l-4 4l-4 -4"], 'ChevronsUpDown'); // selector
export const ClipboardCheck = icon(["M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2", "M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z", "M9 14l2 2l4 -4"], 'ClipboardCheck'); // clipboard-check
export const ClipboardList = icon(["M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2", "M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z", "M9 12l.01 0", "M13 12l2 0", "M9 16l.01 0", "M13 16l2 0"], 'ClipboardList'); // clipboard-list
export const Clock = icon(["M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0", "M12 7v5l3 3"], 'Clock'); // clock
export const Crown = icon(["M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4z"], 'Crown'); // crown
export const Eye = icon(["M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0", "M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"], 'Eye'); // eye
export const EyeOff = icon(["M10.585 10.587a2 2 0 0 0 2.829 2.828", "M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87", "M3 3l18 18"], 'EyeOff'); // eye-off
export const FileText = icon(["M14 3v4a1 1 0 0 0 1 1h4", "M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z", "M9 9l1 0", "M9 13l6 0", "M9 17l6 0"], 'FileText'); // file-text
export const FileWarning = icon(["M14 3v4a1 1 0 0 0 1 1h4", "M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z", "M12 17l.01 0", "M12 11l0 3"], 'FileWarning'); // file-alert
export const FolderOpen = icon(["M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2"], 'FolderOpen'); // folder-open
export const GraduationCap = icon(["M22 9l-10 -4l-10 4l10 4l10 -4v6", "M6 10.6v5.4a6 3 0 0 0 12 0v-5.4"], 'GraduationCap'); // school
export const Home = icon(["M5 12l-2 0l9 -9l9 9l-2 0", "M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7", "M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"], 'Home'); // home
export const KeyRound = icon(["M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0z", "M15 9h.01"], 'KeyRound'); // key
export const Layers = icon(["M12 4l-8 4l8 4l8 -4l-8 -4", "M4 12l8 4l8 -4", "M4 16l8 4l8 -4"], 'Layers'); // stack-2
export const LayoutGrid = icon(["M4 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z", "M14 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z", "M4 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z", "M14 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"], 'LayoutGrid'); // layout-grid
export const List = icon(["M9 6l11 0", "M9 12l11 0", "M9 18l11 0", "M5 6l0 .01", "M5 12l0 .01", "M5 18l0 .01"], 'List'); // list
export const ListChecks = icon(["M3.5 5.5l1.5 1.5l2.5 -2.5", "M3.5 11.5l1.5 1.5l2.5 -2.5", "M3.5 17.5l1.5 1.5l2.5 -2.5", "M11 6l9 0", "M11 12l9 0", "M11 18l9 0"], 'ListChecks'); // list-check
export const Loader2 = icon(["M12 3a9 9 0 1 0 9 9"], 'Loader2'); // loader-2
export const LogOut = icon(["M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2", "M9 12h12l-3 -3", "M18 15l3 -3"], 'LogOut'); // logout
export const Mail = icon(["M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z", "M3 7l9 6l9 -6"], 'Mail'); // mail
export const Map = icon(["M3 7l6 -3l6 3l6 -3v13l-6 3l-6 -3l-6 3v-13", "M9 4v13", "M15 7v13"], 'Map'); // map
export const MapPin = icon(["M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0", "M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"], 'MapPin'); // map-pin
export const MessageCircle = icon(["M3 20l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c3.255 2.777 3.695 7.266 1.029 10.501c-2.666 3.235 -7.615 4.215 -11.574 2.293l-4.7 1"], 'MessageCircle'); // message-circle
export const MessageSquareText = icon(["M8 9h8", "M8 13h6", "M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"], 'MessageSquareText'); // message
export const Monitor = icon(["M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10z", "M7 20h10", "M9 16v4", "M15 16v4"], 'Monitor'); // device-desktop
export const MoreHorizontal = icon(["M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", "M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", "M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"], 'MoreHorizontal'); // dots
export const PanelLeftClose = icon(["M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z", "M9 4v16", "M15 10l-2 2l2 2"], 'PanelLeftClose'); // layout-sidebar-left-collapse
export const PanelLeftOpen = icon(["M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z", "M9 4v16", "M14 10l2 2l-2 2"], 'PanelLeftOpen'); // layout-sidebar-left-expand
export const Phone = icon(["M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"], 'Phone'); // phone
export const PlayCircle = icon(["M7 4v16l13 -8z"], 'PlayCircle'); // player-play
export const Plus = icon(["M12 5l0 14", "M5 12l14 0"], 'Plus'); // plus
export const Minus = icon(["M5 12l14 0"], 'Minus'); // minus
export const Download = icon(["M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2", "M7 11l5 5l5 -5", "M12 4l0 12"], 'Download'); // download
export const Paperclip = icon(["M15 7l-6.5 6.5a1.5 1.5 0 0 0 3 3l6.5 -6.5a3 3 0 0 0 -6 -6l-6.5 6.5a4.5 4.5 0 0 0 9 9l6.5 -6.5"], 'Paperclip'); // paperclip
export const Mic = icon(["M9 2m0 3a3 3 0 0 1 3 -3h0a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3h0a3 3 0 0 1 -3 -3z", "M5 10a7 7 0 0 0 14 0", "M8 21l8 0", "M12 17l0 4"], 'Mic'); // microphone
export const LayoutGridAdd = icon(["M4 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z", "M14 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z", "M4 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z", "M14 17h6m-3 -3v6"], 'LayoutGridAdd'); // layout-grid-add
export const RefreshCw = icon(["M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4", "M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"], 'RefreshCw'); // refresh
export const Rocket = icon(["M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3", "M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3", "M15 9m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"], 'Rocket'); // rocket
export const Route = icon(["M3 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0", "M19 7a2 2 0 1 0 0 -4a2 2 0 0 0 0 4z", "M11 19h5.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h4.5"], 'Route'); // route
export const Search = icon(["M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0", "M21 21l-6 -6"], 'Search'); // search
export const Settings = icon(["M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z", "M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"], 'Settings'); // settings
export const ShieldAlert = icon(["M15.04 19.745c-.942 .551 -1.964 .976 -3.04 1.255a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 .195 6.015", "M19 16v3", "M19 22v.01"], 'ShieldAlert'); // shield-exclamation
export const Sparkles = icon(["M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z"], 'Sparkles'); // sparkles
export const Sparkle = Sparkles;
export const Star = icon(["M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"], 'Star'); // star
export const Trash2 = icon(["M4 7l16 0", "M10 11l0 6", "M14 11l0 6", "M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12", "M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"], 'Trash2'); // trash
export const TrendingDown = icon(["M3 7l6 6l4 -4l8 8", "M21 10l0 7l-7 0"], 'TrendingDown'); // trending-down
export const TrendingUp = icon(["M3 17l6 -6l4 4l8 -8", "M14 7l7 0l0 7"], 'TrendingUp'); // trending-up
export const Trophy = icon(["M8 21l8 0", "M12 17l0 4", "M7 4l10 0", "M17 4v8a5 5 0 0 1 -10 0v-8", "M5 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0", "M19 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"], 'Trophy'); // trophy
export const User = icon(["M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0", "M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"], 'User'); // user
export const UserCheck = icon(["M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0", "M6 21v-2a4 4 0 0 1 4 -4h4", "M15 19l2 2l4 -4"], 'UserCheck'); // user-check
export const UserX = icon(["M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0", "M6 21v-2a4 4 0 0 1 4 -4h3.5", "M22 22l-5 -5", "M17 22l5 -5"], 'UserX'); // user-x
export const Users = icon(["M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0", "M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2", "M16 3.13a4 4 0 0 1 0 7.75", "M21 21v-2a4 4 0 0 0 -3 -3.85"], 'Users'); // users
export const UsersRound = icon(["M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0", "M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1", "M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0", "M17 10h2a2 2 0 0 1 2 2v1", "M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0", "M3 13v-1a2 2 0 0 1 2 -2h2"], 'UsersRound'); // users-group
export const X = icon(["M18 6l-12 12", "M6 6l12 12"], 'X'); // x
export const Zap = icon(["M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"], 'Zap'); // bolt
