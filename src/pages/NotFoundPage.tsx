import { Link } from "react-router-dom";
import { ArrowLeft, Boxes } from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";

export function NotFoundPage() {
  usePageTitle("Page not found");

  return (
    <div className="grid min-h-[70vh] place-items-center">
      <div className="text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-blue-50 text-blue-600">
          <Boxes size={27} />
        </div>
        <h2 className="mt-5 text-2xl font-bold text-slate-950">Page not found</h2>
        <p className="mt-2 text-sm text-slate-500">The StockSense route you requested does not exist.</p>
        <Link
          to="/dashboard"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
