import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  MoveRight,
  TriangleAlert,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { dashboardKpis } from "../data/dashboard";
import { usePageTitle } from "../hooks/usePageTitle";

const iconMap = [Boxes, TriangleAlert, ArrowDownToLine, ArrowUpFromLine, MoveRight] as const;

export function DashboardPage() {
  usePageTitle("Dashboard");

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        eyebrow="Overview"
        title="Inventory at a glance"
        description="Monitor stock levels, incoming goods, outgoing deliveries, and internal movements from one workspace."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {dashboardKpis.map((kpi, index) => (
          <StatCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            helper={kpi.helper}
            icon={iconMap[index]}
            accent={index === 1 ? "amber" : index > 2 ? "violet" : "blue"}
          />
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-950">Inventory activity</h3>
              <p className="mt-1 text-sm text-slate-500">
                Activity visualization will be connected in the next implementation step.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              Preview
            </span>
          </div>
          <div className="mt-6 flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
            <div className="text-center">
              <Boxes className="mx-auto size-8 text-slate-300" />
              <p className="mt-2 text-sm font-semibold text-slate-500">Dashboard analytics</p>
              <p className="mt-1 text-xs text-slate-400">Ready for live inventory data</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="font-bold text-slate-950">Quick actions</h3>
          <p className="mt-1 text-sm text-slate-500">
            Operation flows will be added after the foundation is verified.
          </p>
          <div className="mt-5 space-y-3">
            {["New Receipt", "New Delivery", "Internal Transfer", "Stock Adjustment"].map(
              (action) => (
                <button
                  key={action}
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  {action}
                  <MoveRight size={16} />
                </button>
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
