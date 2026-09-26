import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { ReactNode } from 'react';

import { seedState } from '../data/seed';

import type {
  AppState,
  Product,
  Warehouse,
  StockRecord,
  Operation,
  Transfer,
  Adjustment,
  LedgerEntry,
  Notification,
  Status,
} from '../types/inventory';

const KEY = 'stocksense-state-v2';

const clone = <T,>(x: T): T =>
  JSON.parse(JSON.stringify(x));

const initial = (): AppState => {
  try {
    const raw = localStorage.getItem(KEY);

    if (raw) {
      return JSON.parse(raw);
    }

    return clone(seedState);
  } catch {
    return clone(seedState);
  }
};

type AddProductInput = Omit<Product, 'id'> & {
  initialStock?: number;
  warehouseId?: string;
  location?: string;
};

type Ctx = AppState & {
  addProduct: (p: AddProductInput) => void;

  updateProduct: (
    id: string,
    p: Partial<Product>
  ) => void;

  archiveProduct: (id: string) => void;

  addWarehouse: (
    w: Omit<Warehouse, 'id'>
  ) => void;

  createOperation: (
    o: Omit<
      Operation,
      'id' | 'createdAt' | 'updatedAt'
    >
  ) => void;

  updateOperation: (
    id: string,
    p: Partial<Operation>
  ) => void;

  validateOperation: (
    id: string
  ) => {
    ok: boolean;
    message: string;
  };

  createTransfer: (
    t: Omit<Transfer, 'id' | 'createdAt'>
  ) => void;

  validateTransfer: (
    id: string
  ) => {
    ok: boolean;
    message: string;
  };

  createAdjustment: (
    a: Omit<Adjustment, 'id' | 'createdAt'>
  ) => void;

  validateAdjustment: (
    id: string
  ) => {
    ok: boolean;
    message: string;
  };

  markRead: (id?: string) => void;

  resetDemo: () => void;

  getStock: (
    productId: string,
    warehouseId?: string
  ) => number;

  addNotification: (
    n: Omit<
      Notification,
      'id' | 'timestamp' | 'read'
    >
  ) => void;
};

const C = createContext<Ctx | null>(null);

export function InventoryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] =
    useState<AppState>(initial);

  /*
   * CENTRAL PERSISTENCE
   *
   * Every time the inventory state changes,
   * automatically save it to localStorage.
   */
  useEffect(() => {
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify(state)
      );
    } catch (error) {
      console.error(
        'Failed to save StockSense data:',
        error
      );
    }
  }, [state]);

  const persist = (next: AppState) => {
    setState(next);
  };

  const addNotification = (
    n: Omit<
      Notification,
      'id' | 'timestamp' | 'read'
    >
  ) => {
    setState((s) => ({
      ...s,
      notifications: [
        {
          ...n,
          id: crypto.randomUUID(),
          timestamp:
            new Date().toISOString(),
          read: false,
        },
        ...s.notifications,
      ],
    }));
  };

  const getStock = (
    productId: string,
    warehouseId?: string
  ) =>
    state.stock
      .filter(
        (x) =>
          x.productId === productId &&
          (!warehouseId ||
            x.warehouseId === warehouseId)
      )
      .reduce(
        (total, x) => total + x.quantity,
        0
      );

  /*
   * PRODUCT CREATION
   */
  const addProduct = (
    p: AddProductInput
  ) => {
    const {
      initialStock = 0,
      warehouseId,
      location = 'Default Location',
      ...productData
    } = p;

    const product: Product = {
      ...productData,
      id: crypto.randomUUID(),
    };

    let stock = [...state.stock];

    if (
      initialStock > 0 &&
      warehouseId
    ) {
      stock = [
        ...stock,
        {
          productId: product.id,
          warehouseId,
          location,
          quantity: initialStock,
        },
      ];
    }

    persist({
      ...state,
      products: [
        ...state.products,
        product,
      ],
      stock,
    });
  };

  const updateProduct = (
    id: string,
    p: Partial<Product>
  ) =>
    persist({
      ...state,
      products: state.products.map(
        (x) =>
          x.id === id
            ? { ...x, ...p }
            : x
      ),
    });

  const archiveProduct = (
    id: string
  ) =>
    updateProduct(id, {
      archived: true,
    });

  /*
   * WAREHOUSES
   */
  const addWarehouse = (
    w: Omit<Warehouse, 'id'>
  ) =>
    persist({
      ...state,
      warehouses: [
        ...state.warehouses,
        {
          ...w,
          id: crypto.randomUUID(),
        },
      ],
    });

  /*
   * OPERATIONS
   */
  const createOperation = (
    o: Omit<
      Operation,
      'id' | 'createdAt' | 'updatedAt'
    >
  ) => {
    const now =
      new Date().toISOString();

    persist({
      ...state,
      operations: [
        {
          ...o,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        },
        ...state.operations,
      ],
    });
  };

  const updateOperation = (
    id: string,
    p: Partial<Operation>
  ) =>
    persist({
      ...state,
      operations:
        state.operations.map(
          (x) =>
            x.id === id
              ? {
                  ...x,
                  ...p,
                  updatedAt:
                    new Date().toISOString(),
                }
              : x
        ),
    });

  const changeStock = (
    stock: StockRecord[],
    productId: string,
    warehouseId: string,
    delta: number,
    location: string
  ) => {
    const index =
      stock.findIndex(
        (x) =>
          x.productId === productId &&
          x.warehouseId === warehouseId &&
          x.location === location
      );

    if (index >= 0) {
      const next = [...stock];

      next[index] = {
        ...next[index],
        quantity:
          next[index].quantity + delta,
      };

      return next;
    }

    return [
      ...stock,
      {
        productId,
        warehouseId,
        location,
        quantity: delta,
      },
    ];
  };

  const ledger = (
    entry: Omit<
      LedgerEntry,
      'id' | 'date' | 'user'
    >
  ): LedgerEntry => ({
    ...entry,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    user: 'Admin',
  });

  /*
   * RECEIPTS / DELIVERIES
   */
  const validateOperation = (
    id: string
  ) => {
    const op =
      state.operations.find(
        (x) => x.id === id
      );

    if (!op) {
      return {
        ok: false,
        message:
          'Operation not found.',
      };
    }

    if (op.status === 'Done') {
      return {
        ok: true,
        message:
          'Already validated.',
      };
    }

    if (
      op.status === 'Canceled'
    ) {
      return {
        ok: false,
        message:
          'Canceled operations cannot be validated.',
      };
    }

    let stock = [...state.stock];
    let led = [...state.ledger];

    const warehouse =
      state.warehouses.find(
        (w) =>
          w.id === op.warehouseId
      );

    for (const line of op.lines) {
      const product =
        state.products.find(
          (x) =>
            x.id === line.productId
        );

      if (
        !product ||
        line.quantity <= 0
      ) {
        return {
          ok: false,
          message:
            'All products must exist and quantities must be greater than zero.',
        };
      }

      const existingRecord =
        stock.find(
          (x) =>
            x.productId ===
              line.productId &&
            x.warehouseId ===
              op.warehouseId
        );

      const location =
        existingRecord?.location ||
        'Default Location';

      const before =
        stock
          .filter(
            (x) =>
              x.productId ===
                line.productId &&
              x.warehouseId ===
                op.warehouseId
          )
          .reduce(
            (sum, x) =>
              sum + x.quantity,
            0
          );

      if (
        op.type === 'Delivery' &&
        before < line.quantity
      ) {
        return {
          ok: false,
          message: `Not enough ${product.name}. Available: ${before} ${product.uom}.`,
        };
      }

      const delta =
        op.type === 'Receipt'
          ? line.quantity
          : -line.quantity;

      stock = changeStock(
        stock,
        line.productId,
        op.warehouseId,
        delta,
        location
      );

      led = [
        ...led,
        ledger({
          reference:
            op.reference,
          productId:
            line.productId,
          operationType:
            op.type,
          source:
            op.type === 'Receipt'
              ? 'Supplier'
              : `${
                  warehouse?.name ||
                  'Warehouse'
                } / ${location}`,
          destination:
            op.type === 'Receipt'
              ? `${
                  warehouse?.name ||
                  'Warehouse'
                } / ${location}`
              : op.party,
          quantity: line.quantity,
          beforeStock: before,
          afterStock:
            before + delta,
        }),
      ];
    }

    persist({
      ...state,

      stock,

      ledger: led,

      operations:
        state.operations.map(
          (x) =>
            x.id === id
              ? {
                  ...x,
                  status:
                    'Done' as Status,
                  updatedAt:
                    new Date().toISOString(),
                }
              : x
        ),

      notifications: [
        {
          id: crypto.randomUUID(),
          title: `${op.type} validated`,
          message: `${op.reference} has updated inventory successfully.`,
          severity:
            'success' as const,
          timestamp:
            new Date().toISOString(),
          read: false,
        },
        ...state.notifications,
      ],
    });

    return {
      ok: true,
      message: `${op.reference} validated successfully.`,
    };
  };

  /*
   * INTERNAL TRANSFERS
   */
  const createTransfer = (
    t: Omit<
      Transfer,
      'id' | 'createdAt'
    >
  ) =>
    persist({
      ...state,

      transfers: [
        {
          ...t,
          id: crypto.randomUUID(),
          createdAt:
            new Date().toISOString(),
        },
        ...state.transfers,
      ],
    });

  const validateTransfer = (
    id: string
  ) => {
    const transfer =
      state.transfers.find(
        (x) => x.id === id
      );

    if (!transfer) {
      return {
        ok: false,
        message:
          'Transfer not found.',
      };
    }

    if (
      transfer.status === 'Done'
    ) {
      return {
        ok: true,
        message:
          'Already validated.',
      };
    }

    if (
      transfer.status ===
      'Canceled'
    ) {
      return {
        ok: false,
        message:
          'Canceled transfers cannot be validated.',
      };
    }

    const product =
      state.products.find(
        (x) =>
          x.id ===
          transfer.productId
      );

    if (
      !product ||
      transfer.quantity <= 0
    ) {
      return {
        ok: false,
        message:
          'Invalid product or quantity.',
      };
    }

    const available =
      getStock(
        transfer.productId,
        transfer.sourceWarehouseId
      );

    if (
      available <
      transfer.quantity
    ) {
      return {
        ok: false,
        message: `Not enough ${product.name}. Available: ${available} ${product.uom}.`,
      };
    }

    let stock = [
      ...state.stock,
    ];

    stock = changeStock(
      stock,
      transfer.productId,
      transfer.sourceWarehouseId,
      -transfer.quantity,
      transfer.sourceLocation
    );

    stock = changeStock(
      stock,
      transfer.productId,
      transfer.destinationWarehouseId,
      transfer.quantity,
      transfer.destinationLocation
    );

    const sourceWarehouse =
      state.warehouses.find(
        (w) =>
          w.id ===
          transfer.sourceWarehouseId
      );

    const destinationWarehouse =
      state.warehouses.find(
        (w) =>
          w.id ===
          transfer.destinationWarehouseId
      );

    const ledgerEntry = ledger({
      reference:
        transfer.reference,

      productId:
        transfer.productId,

      operationType:
        'Internal Transfer',

      source: `${
        sourceWarehouse?.name ||
        'Warehouse'
      } / ${transfer.sourceLocation}`,

      destination: `${
        destinationWarehouse?.name ||
        'Warehouse'
      } / ${transfer.destinationLocation}`,

      quantity:
        transfer.quantity,

      beforeStock: available,

      afterStock:
        available -
        transfer.quantity,
    });

    persist({
      ...state,

      stock,

      ledger: [
        ...state.ledger,
        ledgerEntry,
      ],

      transfers:
        state.transfers.map(
          (x) =>
            x.id === id
              ? {
                  ...x,
                  status:
                    'Done' as Status,
                }
              : x
        ),

      notifications: [
        {
          id: crypto.randomUUID(),
          title:
            'Transfer completed',
          message: `${transfer.reference} moved ${transfer.quantity} ${product.uom} of ${product.name}.`,
          severity:
            'success' as const,
          timestamp:
            new Date().toISOString(),
          read: false,
        },
        ...state.notifications,
      ],
    });

    return {
      ok: true,
      message: `${transfer.reference} completed.`,
    };
  };

  /*
   * STOCK ADJUSTMENTS
   */
  const createAdjustment = (
    a: Omit<
      Adjustment,
      'id' | 'createdAt'
    >
  ) =>
    persist({
      ...state,

      adjustments: [
        {
          ...a,
          id: crypto.randomUUID(),
          createdAt:
            new Date().toISOString(),
        },
        ...state.adjustments,
      ],
    });

  const validateAdjustment = (
    id: string
  ) => {
    const adjustment =
      state.adjustments.find(
        (x) => x.id === id
      );

    if (!adjustment) {
      return {
        ok: false,
        message:
          'Adjustment not found.',
      };
    }

    if (
      adjustment.status === 'Done'
    ) {
      return {
        ok: true,
        message:
          'Already validated.',
      };
    }

    if (
      adjustment.status ===
      'Canceled'
    ) {
      return {
        ok: false,
        message:
          'Canceled adjustments cannot be validated.',
      };
    }

    const current =
      getStock(
        adjustment.productId,
        adjustment.warehouseId
      );

    const delta =
      adjustment.physicalQuantity -
      current;

    const product =
      state.products.find(
        (x) =>
          x.id ===
          adjustment.productId
      );

    if (
      !product ||
      adjustment.physicalQuantity < 0
    ) {
      return {
        ok: false,
        message:
          'Physical quantity cannot be negative.',
      };
    }

    const existingRecord =
      state.stock.find(
        (x) =>
          x.productId ===
            adjustment.productId &&
          x.warehouseId ===
            adjustment.warehouseId
      );

    const location =
      existingRecord?.location ||
      adjustment.location;

    const stock =
      changeStock(
        state.stock,
        adjustment.productId,
        adjustment.warehouseId,
        delta,
        location
      );

    const warehouse =
      state.warehouses.find(
        (w) =>
          w.id ===
          adjustment.warehouseId
      );

    const ledgerEntry =
      ledger({
        reference:
          adjustment.reference,

        productId:
          adjustment.productId,

        operationType:
          'Adjustment',

        source: `${
          warehouse?.name ||
          'Warehouse'
        } / ${adjustment.location}`,

        destination:
          'Physical count',

        quantity: delta,

        beforeStock: current,

        afterStock:
          adjustment.physicalQuantity,
      });

    persist({
      ...state,

      stock,

      ledger: [
        ...state.ledger,
        ledgerEntry,
      ],

      adjustments:
        state.adjustments.map(
          (x) =>
            x.id === id
              ? {
                  ...x,
                  status:
                    'Done' as Status,
                  systemQuantity:
                    current,
                  difference:
                    delta,
                }
              : x
        ),

      notifications: [
        {
          id: crypto.randomUUID(),
          title:
            'Stock adjustment validated',
          message: `${product.name} is now ${adjustment.physicalQuantity} ${product.uom}.`,
          severity:
            'info' as const,
          timestamp:
            new Date().toISOString(),
          read: false,
        },
        ...state.notifications,
      ],
    });

    return {
      ok: true,
      message:
        `${adjustment.reference} validated.`,
    };
  };

  /*
   * NOTIFICATIONS
   */
  const markRead = (
    id?: string
  ) => {
    const notifications =
      state.notifications.map(
        (n) =>
          id
            ? n.id === id
              ? {
                  ...n,
                  read: true,
                }
              : n
            : {
                ...n,
                read: true,
              }
      );

    persist({
      ...state,
      notifications,
    });
  };

  /*
   * RESET DEMO DATA
   */
  const resetDemo = () =>
    persist(clone(seedState));

  const value = useMemo(
    () => ({
      ...state,

      addProduct,
      updateProduct,
      archiveProduct,
      addWarehouse,
      createOperation,
      updateOperation,
      validateOperation,
      createTransfer,
      validateTransfer,
      createAdjustment,
      validateAdjustment,
      markRead,
      resetDemo,
      getStock,
      addNotification,
    }),
    [state]
  );

  return (
    <C.Provider value={value}>
      {children}
    </C.Provider>
  );
}

export const useInventory = () => {
  const context =
    useContext(C);

  if (!context) {
    throw new Error(
      'InventoryProvider missing'
    );
  }

  return context;
};