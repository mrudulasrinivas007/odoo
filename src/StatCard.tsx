import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  accent?: "blue" | "amber" | "emerald" | "violet";
};

const accents = {
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
  violet: "bg-violet-50 text-violet-600",
};

export function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  accent = "blue",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
        </div>
        <div className={`grid size-10 place-items-center rounded-xl ${accents[accent]}`}>
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-400">{helper}</p>
    </div>
  );
}