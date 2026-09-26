import { ArrowDownToLine, ArrowUpFromLine, ClipboardList, MoveRight } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { usePageTitle } from "../hooks/usePageTitle";

const operations = [
  ["Receipts", "Incoming stock from vendors", ArrowDownToLine],
  ["Delivery Orders", "Outgoing stock for shipment", ArrowUpFromLine],
  ["Internal Transfers", "Move stock between locations", MoveRight],
  ["Stock Adjustments", "Reconcile physical and recorded stock", ClipboardList],
] as const;

export function OperationsPage() {
  usePageTitle("Operations");

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        eyebrow="Stock movement"
        title="Operations"
        description="A single workspace for receipts, deliveries, internal transfers, and stock adjustments."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {operations.map(([title, description, Icon]) => (
          <button
            key={title}
            type="button"
            className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="grid size-11 place-items-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-blue-50 group-hover:text-blue-600">
                <Icon size={21} />
              </div>
              <MoveRight size={18} className="text-slate-300 transition group-hover:text-blue-500" />
            </div>
            <h3 className="mt-5 font-bold text-slate-950">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <ClipboardList className="mx-auto size-8 text-slate-300" />
        <p className="mt-3 font-semibold text-slate-600">Operations ledger coming next</p>
        <p className="mt-1 text-sm text-slate-400">
          Status filters, warehouse filters, operation history, and validation flows belong here.
        </p>
      </div>
    </div>
  );
}