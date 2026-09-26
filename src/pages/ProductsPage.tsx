import { Boxes, Plus, Search } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { usePageTitle } from "../hooks/usePageTitle";

export function ProductsPage() {
  usePageTitle("Products");

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        eyebrow="Catalog"
        title="Products"
        description="Create products, organize categories, and monitor stock availability by location."
        action={
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <Plus size={17} />
            Add product
          </button>
        }
      />

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex max-w-md flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <Search size={17} className="text-slate-400" />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              placeholder="Search products or SKU..."
            />
          </div>
          <button className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600">
            All categories
          </button>
        </div>
        <div className="flex min-h-72 items-center justify-center p-8">
          <div className="text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
              <Boxes size={23} />
            </div>
            <h3 className="mt-4 font-bold text-slate-900">Product workspace</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Product tables, stock-by-location, categories, SKU search, and reorder rules will be implemented next.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
