import { CircleUserRound, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { primaryNavigation } from "../data/navigation";
import { BrandLogo } from "./BrandLogo";
import { cn } from "../utils/cn";

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-20 items-center px-6">
        <BrandLogo />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Primary navigation">
        <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Workspace
        </p>

        {primaryNavigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={19} strokeWidth={isActive ? 2.4 : 2} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-xl p-3 transition",
              isActive ? "bg-slate-100" : "hover:bg-slate-50",
            )
          }
        >
          <div className="grid size-9 place-items-center rounded-full bg-slate-900 text-white">
            <CircleUserRound size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">Inventory Admin</p>
            <p className="truncate text-xs text-slate-500">Administrator</p>
          </div>
          <LogOut size={16} className="text-slate-400" />
        </NavLink>
      </div>
    </aside>
  );
}
