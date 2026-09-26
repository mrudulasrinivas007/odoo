import { useState } from 'react';
import { Archive, Edit3, Plus, Search } from 'lucide-react';
import {
  Button,
  Card,
  Input,
  Modal,
  PageHeader,
  Select,
  StatusBadge,
} from '../components/ui';
import { useInventory } from '../context/InventoryContext';

export default function Products() {
  const {
    products,
    warehouses,
    getStock,
    addProduct,
    updateProduct,
    archiveProduct,
  } = useInventory();

  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [status, setStatus] = useState('All');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const cats = [...new Set(products.map((p) => p.category))];

  const visible = products.filter((p) => {
    const qty = getStock(p.id);

    const matchesSearch =
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      p.sku.toLowerCase().includes(q.toLowerCase());

    const matchesCategory = cat === 'All' || p.category === cat;

    const matchesStatus =
      status === 'All' ||
      (status === 'Out of Stock' && qty === 0) ||
      (status === 'Low Stock' && qty > 0 && qty <= p.reorderLevel) ||
      (status === 'In Stock' && qty > p.reorderLevel);

    return !p.archived && matchesSearch && matchesCategory && matchesStatus;
  });

  const edit = products.find((p) => p.id === editing);

  return (
    <>
      <PageHeader
        title="Products"
        description="Manage SKUs, reorder levels and current stock across locations."
        action={
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus size={17} />
            Add product
          </Button>
        }
      />

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_220px_180px]">
          <div className="relative">
            <Search
              className="absolute left-3 top-3 text-slate-400"
              size={18}
            />

            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by product name or SKU"
              className="pl-10"
            />
          </div>

          <Select value={cat} onChange={(e) => setCat(e.target.value)}>
            <option>All</option>

            {cats.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>

          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>All</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </Select>
        </div>
      </Card>

      <Card className="mt-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th>Category</th>
                <th>UoM</th>
                <th>Stock</th>
                <th>Reorder</th>
                <th>Status</th>
                <th className="px-5">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {visible.map((p) => {
                const qty = getStock(p.id);

                const s =
                  qty === 0
                    ? 'Out of Stock'
                    : qty <= p.reorderLevel
                      ? 'Low Stock'
                      : 'In Stock';

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-xs text-slate-400">
                        {p.sku}
                      </div>
                    </td>

                    <td>{p.category}</td>

                    <td>{p.uom}</td>

                    <td className="font-bold">
                      {qty.toLocaleString()}
                    </td>

                    <td>{p.reorderLevel}</td>

                    <td>
                      <StatusBadge status={s} />
                    </td>

                    <td className="px-5">
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditing(p.id);
                            setOpen(true);
                          }}
                          className="rounded-lg p-2 hover:bg-slate-100"
                          title="Edit product"
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          onClick={() => archiveProduct(p.id)}
                          className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"
                          title="Archive product"
                        >
                          <Archive size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!visible.length && (
          <div className="p-10 text-center text-sm text-slate-500">
            No matching products.
          </div>
        )}
      </Card>

      <ProductModal
        open={open}
        onClose={() => setOpen(false)}
        product={edit}
        onSave={(product) => {
          if (edit) {
            updateProduct(edit.id, product);
          } else {
            addProduct(product);
          }

          setOpen(false);
        }}
        warehouses={warehouses}
      />
    </>
  );
}

function ProductModal({
  open,
  onClose,
  product,
  onSave,
  warehouses,
}: {
  open: boolean;
  onClose: () => void;
  product: any;
  onSave: (p: any) => void;
  warehouses: any[];
}) {
  const [name, setName] = useState(product?.name || '');
  const [sku, setSku] = useState(product?.sku || '');
  const [category, setCategory] = useState(
    product?.category || 'Components'
  );
  const [uom, setUom] = useState(product?.uom || 'units');
  const [reorder, setReorder] = useState(
    product?.reorderLevel ?? 10
  );

  const [initialStock, setInitialStock] = useState(
    product ? 0 : 0
  );

  const [warehouseId, setWarehouseId] = useState(
    product ? '' : warehouses[0]?.id || ''
  );

  const [location, setLocation] = useState(
    product ? '' : 'Default Location'
  );

  const isEditing = Boolean(product);

  const handleSave = () => {
    onSave({
      name: name.trim(),
      sku: sku.trim(),
      category,
      uom,
      reorderLevel: reorder,
      initialStock,
      warehouseId,
      location,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit product' : 'Create product'}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          Name

          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Steel Sheet"
          />
        </label>

        <label className="text-sm font-semibold">
          SKU / Code

          <Input
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="e.g. STL-001"
          />
        </label>

        <label className="text-sm font-semibold">
          Category

          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Components</option>
            <option>Raw Materials</option>
            <option>Electrical</option>
            <option>Safety</option>
            <option>Packaging</option>
            <option>Consumables</option>
          </Select>
        </label>

        <label className="text-sm font-semibold">
          Unit of Measure

          <Select
            value={uom}
            onChange={(e) => setUom(e.target.value)}
          >
            <option>units</option>
            <option>kg</option>
            <option>m</option>
            <option>litres</option>
            <option>pairs</option>
          </Select>
        </label>

        <label className="text-sm font-semibold">
          Reorder level

          <Input
            type="number"
            min="0"
            value={reorder}
            onChange={(e) => setReorder(Number(e.target.value))}
          />
        </label>

        {!isEditing && (
          <>
            <label className="text-sm font-semibold">
              Initial Stock

              <Input
                type="number"
                min="0"
                value={initialStock}
                onChange={(e) =>
                  setInitialStock(Number(e.target.value))
                }
                placeholder="e.g. 100"
              />
            </label>

            <label className="text-sm font-semibold">
              Warehouse

              <Select
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
              >
                <option value="">Select warehouse</option>

                {warehouses.map((warehouse) => (
                  <option
                    key={warehouse.id}
                    value={warehouse.id}
                  >
                    {warehouse.name} ({warehouse.code})
                  </option>
                ))}
              </Select>
            </label>

            <label className="text-sm font-semibold sm:col-span-2">
              Location / Rack

              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Rack A-01"
              />
            </label>
          </>
        )}
      </div>

      {!isEditing && (
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
          Initial stock will be added to the selected warehouse and
          location when the product is created.
        </div>
      )}

      <div className="mt-6 flex justify-end gap-2">
        <Button
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          disabled={
            !name.trim() ||
            !sku.trim() ||
            (!isEditing &&
              (!warehouseId || initialStock < 0))
          }
          onClick={handleSave}
        >
          {isEditing ? 'Save changes' : 'Create product'}
        </Button>
      </div>
    </Modal>
  );
}