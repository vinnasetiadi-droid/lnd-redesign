import {
  Home,
  MessageCircle,
  Settings,
  BookMarked,
  BookOpen,
  BarChart2,
  FolderOpen,
  CalendarDays,
  Rocket,
  Activity,
  Calendar,
  Bell,
  Zap,
  ClipboardList,
  Map,
  GraduationCap,
  FileText,
  Users,
  type LucideIcon,
} from "@/variants/a/icons";

// ============================================================
// TYPES
// ============================================================

export type SidebarRole =
  | "ld_team"
  | "trainee"
  | "hr"
  | "trainer";

export interface SidebarSubmenuItem {
  /** Unique key for this submenu item */
  key: string;
  /** Display label */
  label: string;
  /** Route path for navigation */
  path: string;
}

export interface SidebarMenuItem {
  /** Unique key — also used as the openMenus toggle key when hasSubmenu */
  key: string;
  /** Lucide icon component reference (rendered with size={20} in Sidebar) */
  icon: LucideIcon;
  /** Display label */
  label: string;
  /** Route path for navigation (omit for submenu-only parents) */
  path?: string;
  /** Optional notification badge count or text */
  badge?: string | number;
  /** Nested submenu items — presence implies hasSubmenu = true */
  submenu?: SidebarSubmenuItem[];
}

/** Full menu config for a single role */
export type SidebarMenuConfig = SidebarMenuItem[];

// ============================================================
// MENU CONFIG
// ============================================================

const TRAINER_MENU: SidebarMenuConfig = [
  {
    key: "dashboard",
    icon: Home,
    label: "Dashboard",
    path: "/trainer/dashboard",
  },
  {
    key: "classes",
    icon: GraduationCap,
    label: "Teaching Progress",
    submenu: [
      {
        key: "classes-upcoming",
        label: "Upskill",
        path: "/trainer/classes/upskill",
      },
      {
        key: "classes-archived",
        label: "Journey",
        path: "/trainer/classes/journey",
      },
    ],
  },
  {
    key: "assessment",
    icon: ClipboardList,
    label: "Assessment",
    path: "/trainer/assessment",
  },
  {
    key: "analytics",
    icon: BarChart2,
    label: "Analytics",
    submenu: [
      {
        key: "analytics-trainee-perf",
        label: "Trainee Analytics",
        path: "/trainer/analytics/trainee-performance",
      },
      {
        key: "analytics-course-perf",
        label: "Program Analytics",
        path: "/trainer/analytics/course-performance",
      },
      {
        key: "analytics-instructor-perf",
        label: "My Analytics",
        path: "/trainer/analytics/instructor-performance",
      },
    ],
  },
  {
    key: "circle",
    icon: MessageCircle,
    label: "Circle",
    path: "/trainer/circle",
    badge: 2,
  },
  {
    key: "schedule",
    icon: Calendar,
    label: "Schedule",
    path: "/trainer/schedule",
  },
  {
    key: "resources",
    icon: FileText,
    label: "Resources",
    submenu: [
      {
        key: "resources-document",
        label: "Document",
        path: "/trainer/resource/document",
      },
      {
        key: "resources-assessment",
        label: "Assessment",
        path: "/trainer/resource/assessment",
      },
    ],
  },
];

const HR_MENU: SidebarMenuConfig = [
  {
    key: "dashboard",
    icon: Home,
    label: "Dashboard",
    path: "/hr/dashboard",
  },
  {
    key: "circle",
    icon: MessageCircle,
    label: "Circle",
    path: "/hr/circle", // ← HR-specific Circle page
    badge: 2,
  },
  {
    key: "agenda",
    icon: Calendar,
    label: "Agenda",
    path: "/hr/agenda",
  },
  {
    key: "learning-management",
    icon: BookOpen,
    label: "Program Management",
    path: "/hr/learning-management",
  },
  {
    key: "employee-management",
    icon: BookMarked,
    label: "Employee Management",
    submenu: [
      {
        key: "em-trainee",
        label: "Trainee",
        path: "/hr/employee-management",
      },
      {
        key: "em-trainer-ld",
        label: "User",
        path: "/hr/employee-management/trainer-ld",
      },
    ],
  },
  {
    key: "analytics",
    icon: BarChart2,
    label: "Analytics",
    submenu: [
      {
        key: "analytics-course",
        label: "Course Overview",
        path: "/hr/analytics/course-overview",
      },
      {
        key: "analytics-trainee",
        label: "Trainee Overview",
        path: "/hr/analytics/trainee-overview",
      },
      {
        key: "analytics-trainer",
        label: "Instructor Overview",
        path: "/hr/analytics/trainer-overview",
      },
    ],
  },
  {
    key: "resources",
    icon: FolderOpen,
    label: "Resource",
    submenu: [
      {
        key: "res-assessment",
        label: "Assessment",
        path: "/hr/assessment",
      },
      {
        key: "res-documents",
        label: "Documents",
        path: "/hr/document",
      },
    ],
  },
  {
    key: "settings",
    icon: Settings,
    label: "Settings",
    path: "/hr/settings",
  },
];

const TRAINEE_MENU: SidebarMenuConfig = [
  {
    key: "dashboard",
    icon: Home,
    label: "Dashboard",
    path: "/trainee/dashboard",
  },
  {
    key: "upskillhub",
    icon: Rocket,
    label: "Upskill Hub",
    path: "/trainee/upskillhub",
  },
  {
    key: "upskill",
    icon: Zap,
    label: "Upskill",
    submenu: [
      {
        key: "upskill-myskill",
        label: "My Skill",
        path: "/trainee/upskill",
      },
    ],
  },
  {
    key: "assessments",
    icon: ClipboardList,
    label: "Assessments",
    path: "/trainee/assessment",
  },
  {
    key: "journey",
    icon: Map,
    label: "Journey",
    path: "/trainee/journey",
  },
  {
    key: "performance",
    icon: Activity,
    label: "Performance",
    path: "/trainee/performance",
  },
  {
    key: "schedule",
    icon: Calendar,
    label: "Schedule",
    path: "/trainee/schedule",
  },
  {
    key: "circle",
    icon: MessageCircle,
    label: "Circle",
    path: "/trainee/circle",
    badge: 3,
  },
  {
    key: "notifications",
    icon: Bell,
    label: "Notifications",
    path: "/trainee/notifications",
  },
];

const LD_TEAM_MENU: SidebarMenuConfig = [
  {
    key: "dashboard",
    icon: Home,
    label: "Dashboard",
    path: "/ld/dashboard",
  },
  {
    key: "agenda",
    icon: CalendarDays,
    label: "Agenda",
    path: "/agenda",
  },
  {
    key: "learning-management",
    icon: BookMarked,
    label: "Programs",
    submenu: [
      {
        key: "lm-courses",
        label: "Upskill",
        path: "/ld/learning-management/courses",
      },
      {
        key: "lm-journey",
        label: "Journey",
        path: "/ld/learning-management/journey",
      },
    ],
  },
  {
    key: "employee-management",
    icon: Users,
    label: "People",
    submenu: [
      {
        key: "em-employees",
        label: "Employees",
        path: "/ld/employee-management",
      },
      {
        key: "em-trainer-ld",
        label: "User",
        path: "/ld/employee-management/trainer-ld",
      },
    ],
  },
  {
    key: "analytics",
    icon: BarChart2,
    label: "Analytics",
    submenu: [
      {
        key: "analytics-course",
        label: "Learning Program",
        path: "/ld/analytics/course",
      },
      {
        key: "analytics-instructor",
        label: "Trainer",
        path: "/ld/analytics/instructor",
      },
      {
        key: "analytics-trainee",
        label: "Trainee",
        path: "/ld/analytics/trainee",
      },
    ],
  },
  {
    key: "circle",
    icon: MessageCircle,
    label: "Circle",
    path: "/ld/circle",
  },
  {
    key: "library",
    icon: FolderOpen,
    label: "Resource",
    submenu: [
      {
        key: "library-quiz-bank",
        label: "Assessment",
        path: "/ld/library/assessment",
      },
      {
        key: "library-documents",
        label: "Documents",
        path: "/ld/library/documents",
      },
    ],
  },
  {
    key: "settings",
    icon: Settings,
    label: "Settings",
    path: "/ld/settings",
  },
];

// ============================================================
// MAIN CONFIG MAP
// ============================================================

export const SIDEBAR_MENU_CONFIG: Record<
  SidebarRole,
  SidebarMenuConfig
> = {
  ld_team: LD_TEAM_MENU,
  trainee: TRAINEE_MENU,
  hr: HR_MENU,
  trainer: TRAINER_MENU,
};

// ============================================================
// HELPERS
// ============================================================

/**
 * Returns the sidebar menu items for the given role.
 * Falls back to LD_TEAM_MENU if role is unrecognised.
 */
export function getSidebarMenu(
  role: SidebarRole,
): SidebarMenuConfig {
  return SIDEBAR_MENU_CONFIG[role] ?? LD_TEAM_MENU;
}

/**
 * Builds the initial `openMenus` state from a menu config.
 * All menus are closed by default.
 */
export function buildInitialOpenMenus(
  menu: SidebarMenuConfig,
): Record<string, boolean> {
  return menu.reduce<Record<string, boolean>>((acc, item) => {
    if (item.submenu) {
      acc[item.key] = false; // all menus closed by default
    }
    return acc;
  }, {});
}