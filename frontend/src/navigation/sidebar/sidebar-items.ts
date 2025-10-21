import {
  ShoppingBag,
  Forklift,
  Mail,
  MessageSquare,
  Calendar,
  Kanban,
  ReceiptText,
  Users,
  Lock,
  Fingerprint,
  SquareArrowUpRight,
  LayoutDashboard,
  ChartBar,
  Banknote,
  Gauge,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Дашборд",
    items: [
      {
        title: "Главная страница",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
      {
        title: "Заявки",
        url: "/dashboard/applications",
        icon: ReceiptText,
      },
      {
        title: "Пользователи",
        url: "/dashboard/users",
        icon: Users,
      },
    ],
  },
  {
    id: 2,
    label: "Страницы",
    items: [
      {
        title: "CRM",
        url: "/dashboard/default",
        icon: ChartBar,
        comingSoon: true,
      },
      {
        title: "Финансы",
        url: "/dashboard/default",
        icon: Banknote,
        comingSoon: true,
      },
    ],
  },
];
