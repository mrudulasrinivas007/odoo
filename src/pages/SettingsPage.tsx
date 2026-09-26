import { Building2, ChevronRight, Settings2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { usePageTitle } from "../hooks/usePageTitle";

export function SettingsPage() {
  usePageTitle("Settings");

  return (
    <div className="mx-auto max-w-[1000px]">
      <PageHeader
        eyebrow="Configuration"
        title="Settings"
        description="Configure the warehouse and inventory environment for StockSense."
      />

      <div className="space-y-3">
        {[
          ["Warehouse", "Manage warehouses, locations, and storage structure.", Building2],
          ["Inventory preferences", "Configure inventory behavior and defaults.", Settings2],
        ].map(([title, description, Icon]) => (
          <button
            key={title as string}
            type="button"
            className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-blue-200 hover:bg-blue-50/30"
          >
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700">
              <Icon size={20} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900">{title as string}</p>
              <p className="mt-1 text-sm text-slate-500">{description as string}</p>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
        ))}
      </div>
    </div>
  );
}
