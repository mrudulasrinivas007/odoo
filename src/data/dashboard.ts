import type { DashboardKpi } from "../types/inventory";

export const dashboardKpis: DashboardKpi[] = [
  {
    label: "Total Products",
    value: "1,284",
    helper: "Across all locations",
    trend: "+8.4%",
  },
  {
    label: "Low / Out of Stock",
    value: "37",
    helper: "Needs attention",
    trend: "12 low",
  },
  {
    label: "Pending Receipts",
    value: "18",
    helper: "Inbound operations",
  },
  {
    label: "Pending Deliveries",
    value: "24",
    helper: "Outbound operations",
  },
  {
    label: "Internal Transfers",
    value: "9",
    helper: "Scheduled movements",
  },
];
