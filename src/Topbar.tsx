import { Bell, Search, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

const labels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/operations": "Operations",
  "/settings": "Settings",
  "/profile": "My Profile",
};

export function Topbar() {
  const location = useLocation();
  const title = labels[location.pathname] ?? "StockSense";

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-600 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={19} />
        </button>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Inventory workspace
          </p>
          <h1 className="text-lg font-bold tracking-tight text-slate-950">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
          <Search size={17} className="text-slate-400" />
          <input
            aria-label="Search"
            placeholder="Search SKU, product..."
            className="w-44 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
          <kbd className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
            /
          </kbd>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
        >
          <Bell size={18} />
          <span className="absolute right-2.5 top-2 size-1.5 rounded-full bg-blue-600" />
        </button>
      </div>
    </header>
  );
}