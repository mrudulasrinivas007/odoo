import {
  Boxes,
  ClipboardList,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import type { NavItem } from "../types/navigation";

export const primaryNavigation: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Inventory overview",
  },
  {
    label: "Products",
    href: "/products",
    icon: Boxes,
    description: "Products & stock",
  },
  {
    label: "Operations",
    href: "/operations",
    icon: ClipboardList,
    description: "Stock movements",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Warehouse setup",
  },
];
