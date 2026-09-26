import { CircleUserRound, Mail, ShieldCheck } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { usePageTitle } from "../hooks/usePageTitle";

export function ProfilePage() {
  usePageTitle("My Profile");

  return (
    <div className="mx-auto max-w-[900px]">
      <PageHeader
        eyebrow="Account"
        title="My Profile"
        description="Your StockSense account and access information."
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="grid size-16 place-items-center rounded-2xl bg-slate-950 text-white">
            <CircleUserRound size={30} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-950">Inventory Admin</h3>
            <p className="mt-1 text-sm text-slate-500">Administrator</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Mail size={14} /> Email
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-800">admin@stocksense.local</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <ShieldCheck size={14} /> Access
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-800">Inventory Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}