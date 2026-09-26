import { Boxes } from "lucide-react";

type BrandLogoProps = {
  collapsed?: boolean;
};

export function BrandLogo({ collapsed = false }: BrandLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/25">
        <Boxes size={21} strokeWidth={2.2} />
      </div>
      {!collapsed && (
        <div className="min-w-0">
          <p className="truncate text-[17px] font-bold tracking-tight text-slate-950">
            StockSense
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Inventory OS
          </p>
        </div>
      )}
    </div>
  );
}