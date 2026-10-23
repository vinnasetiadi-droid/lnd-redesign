import { forwardRef, type ComponentType, type SVGProps } from 'react';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import {
  Activity01Icon, Add01Icon, MinusSignIcon, Alert02Icon, AlertCircleIcon, Analytics01Icon, ArrowDown01Icon,
  ArrowDown02Icon, ArrowDownRight01Icon, ArrowLeft01Icon, ArrowRight01Icon, ArrowRight02Icon,
  ArrowUp01Icon, ArrowUp02Icon, ArrowUpDownIcon, ArrowUpRight01Icon, Award01Icon, Book02Icon,
  BookOpen01Icon, Building03Icon, Calendar03Icon, Calendar04Icon, Call02Icon, Cancel01Icon,
  ChartDecreaseIcon, ChartIncreaseIcon, CheckListIcon, CheckmarkCircle02Icon, Tick02Icon, ShieldCheckIcon, Clock01Icon,
  Comment01Icon, ComputerIcon, CrownIcon, DashboardSquare01Icon, Delete02Icon, File01Icon,
  FileNotFoundIcon, FlashIcon, Folder01Icon, Home01Icon, Key01Icon, Layers01Icon, ListViewIcon,
  Loading03Icon, Location01Icon, Logout01Icon, Mail01Icon, MapsIcon, Message01Icon,
  MoreHorizontalIcon, Mortarboard02Icon, Notification01Icon, PlayCircleIcon, RefreshIcon,
  Rocket01Icon, Route01Icon, Search01Icon, SecurityWarningIcon, Settings01Icon, SidebarLeft01Icon,
  SidebarLeftIcon, SparklesIcon, StarIcon, Task01Icon, TaskDone01Icon, UserCheck01Icon,
  UnfoldMoreIcon, UserGroupIcon, UserIcon, UserMultipleIcon, UserRemove01Icon, ViewIcon, ViewOffSlashIcon,
} from '@hugeicons/core-free-icons';

/**
 * Option B icons: Hugeicons (stroke rounded, free set) behind the lucide-react
 * names the copied pages already use, so switching a file over is a one-line
 * import change: `from '@/variants/b/icons'` instead of `from 'lucide-react'`.
 *
 * Every icon draws at stroke 1.5, whatever strokeWidth a call site passes,
 * to keep the thin Finora-style line across the option.
 */

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  size?: number | string;
  strokeWidth?: number;
}

/** Kept under the lucide name so existing `icon: LucideIcon` types still work */
export type LucideIcon = ComponentType<IconProps>;

const STROKE = 1.5;

function icon(svg: IconSvgElement, name: string): LucideIcon {
  const Icon = forwardRef<SVGSVGElement, IconProps>(({ size = 24, strokeWidth: _ignored, ...rest }, ref) => (
    <HugeiconsIcon ref={ref} icon={svg} size={size} strokeWidth={STROKE} {...rest} />
  ));
  Icon.displayName = name;
  return Icon;
}

export const Activity = icon(Activity01Icon, 'Activity');
export const AlertCircle = icon(AlertCircleIcon, 'AlertCircle');
export const AlertTriangle = icon(Alert02Icon, 'AlertTriangle');
export const TriangleAlert = AlertTriangle;
export const ArrowDown = icon(ArrowDown02Icon, 'ArrowDown');
export const ArrowDownRight = icon(ArrowDownRight01Icon, 'ArrowDownRight');
export const ArrowRight = icon(ArrowRight02Icon, 'ArrowRight');
export const ArrowUp = icon(ArrowUp02Icon, 'ArrowUp');
export const ArrowUpDown = icon(ArrowUpDownIcon, 'ArrowUpDown');
export const ArrowUpRight = icon(ArrowUpRight01Icon, 'ArrowUpRight');
export const BarChart2 = icon(Analytics01Icon, 'BarChart2');
export const Bell = icon(Notification01Icon, 'Bell');
export const BookMarked = icon(Book02Icon, 'BookMarked');
export const BookOpen = icon(BookOpen01Icon, 'BookOpen');
export const Building2 = icon(Building03Icon, 'Building2');
export const Calendar = icon(Calendar03Icon, 'Calendar');
export const CalendarClock = icon(Calendar04Icon, 'CalendarClock');
export const CalendarDays = Calendar;
export const CheckCircle2 = icon(CheckmarkCircle02Icon, 'CheckCircle2');
export const Check = icon(Tick02Icon, 'Check');
export const ShieldCheck = icon(ShieldCheckIcon, 'ShieldCheck');
export const ChevronDown = icon(ArrowDown01Icon, 'ChevronDown');
export const ChevronLeft = icon(ArrowLeft01Icon, 'ChevronLeft');
export const ChevronRight = icon(ArrowRight01Icon, 'ChevronRight');
export const ChevronUp = icon(ArrowUp01Icon, 'ChevronUp');
export const ChevronsUpDown = icon(UnfoldMoreIcon, 'ChevronsUpDown');
export const ClipboardCheck = icon(TaskDone01Icon, 'ClipboardCheck');
export const ClipboardList = icon(Task01Icon, 'ClipboardList');
export const Clock = icon(Clock01Icon, 'Clock');
export const Crown = icon(CrownIcon, 'Crown');
export const Eye = icon(ViewIcon, 'Eye');
export const EyeOff = icon(ViewOffSlashIcon, 'EyeOff');
export const FileText = icon(File01Icon, 'FileText');
export const FileWarning = icon(FileNotFoundIcon, 'FileWarning');
export const FolderOpen = icon(Folder01Icon, 'FolderOpen');
export const GraduationCap = icon(Mortarboard02Icon, 'GraduationCap');
export const Home = icon(Home01Icon, 'Home');
export const KeyRound = icon(Key01Icon, 'KeyRound');
export const Layers = icon(Layers01Icon, 'Layers');
export const LayoutGrid = icon(DashboardSquare01Icon, 'LayoutGrid');
export const List = icon(ListViewIcon, 'List');
export const ListChecks = icon(CheckListIcon, 'ListChecks');
export const Loader2 = icon(Loading03Icon, 'Loader2');
export const LogOut = icon(Logout01Icon, 'LogOut');
export const Mail = icon(Mail01Icon, 'Mail');
export const Map = icon(MapsIcon, 'Map');
export const MapPin = icon(Location01Icon, 'MapPin');
export const MessageCircle = icon(Message01Icon, 'MessageCircle');
export const MessageSquareText = icon(Comment01Icon, 'MessageSquareText');
export const Monitor = icon(ComputerIcon, 'Monitor');
export const MoreHorizontal = icon(MoreHorizontalIcon, 'MoreHorizontal');
export const PanelLeftClose = icon(SidebarLeft01Icon, 'PanelLeftClose');
export const PanelLeftOpen = icon(SidebarLeftIcon, 'PanelLeftOpen');
export const Phone = icon(Call02Icon, 'Phone');
export const PlayCircle = icon(PlayCircleIcon, 'PlayCircle');
export const Plus = icon(Add01Icon, 'Plus');
export const Minus = icon(MinusSignIcon, 'Minus');
export const RefreshCw = icon(RefreshIcon, 'RefreshCw');
export const Rocket = icon(Rocket01Icon, 'Rocket');
export const Route = icon(Route01Icon, 'Route');
export const Search = icon(Search01Icon, 'Search');
export const Settings = icon(Settings01Icon, 'Settings');
export const ShieldAlert = icon(SecurityWarningIcon, 'ShieldAlert');
export const Sparkles = icon(SparklesIcon, 'Sparkles');
export const Sparkle = Sparkles;
export const Star = icon(StarIcon, 'Star');
export const Trash2 = icon(Delete02Icon, 'Trash2');
export const TrendingDown = icon(ChartDecreaseIcon, 'TrendingDown');
export const TrendingUp = icon(ChartIncreaseIcon, 'TrendingUp');
export const Trophy = icon(Award01Icon, 'Trophy');
export const User = icon(UserIcon, 'User');
export const UserCheck = icon(UserCheck01Icon, 'UserCheck');
export const UserX = icon(UserRemove01Icon, 'UserX');
export const Users = icon(UserGroupIcon, 'Users');
export const UsersRound = icon(UserMultipleIcon, 'UsersRound');
export const X = icon(Cancel01Icon, 'X');
export const Zap = icon(FlashIcon, 'Zap');
