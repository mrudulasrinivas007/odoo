# StockSense

StockSense is a modular inventory-management SaaS prototype created for the **Odoo Hackathon** problem statement. It replaces scattered stock tracking with a centralized operational workflow for products, receipts, deliveries, transfers, adjustments, warehouses, ledger entries, alerts and analytics.

## Key features
- Inventory dashboard with KPI cards, movement chart, stock-status view, low-stock products and warehouse overview
- Product management with search, filters, create/edit/archive and reorder levels
- Receipts: create, ready and validate incoming stock
- Delivery orders: create, ready and validate outgoing stock with over-delivery protection
- Internal transfers between warehouses/locations with source-stock validation
- Stock adjustments from system quantity to physical count
- Central stock ledger for every validated inventory-changing operation
- Multi-warehouse stock and utilization overview
- Notification/activity feed for inventory events
- Reports and analytics derived from application transactions
- Responsive enterprise UI
- Local persistence using browser localStorage for demo reliability

## Inventory workflow
Receipt → stock increases → warehouse stock updates → ledger + notification → dashboard/reports update.

Delivery → available stock is checked → stock decreases → ledger + notification → dashboard/reports update.

Internal transfer → source decreases + destination increases → company total remains unchanged → ledger + notification.

Adjustment → physical count becomes the new stock → difference is recorded in the ledger.

## Technology stack
React, TypeScript, Vite, Tailwind CSS, React Router and Lucide React.

## Project structure
- `src/context` — centralized inventory state and transaction logic
- `src/pages` — dashboard, products, operations, ledger, warehouses, reports and settings
- `src/components` — reusable application shell and UI components
- `src/types` — domain types
- `src/data` — demo seed data

## Installation
```bash
npm install
```

## Run locally
```bash
npm run dev
```

Open the local Vite URL shown in the terminal.

## Demo workflow
1. Create a product from Products.
2. Create a receipt and validate it.
3. Check the product and dashboard stock.
4. Create a delivery and validate it.
5. Try a delivery greater than available stock to see validation protection.
6. Create and validate an internal transfer.
7. Create and validate a stock adjustment.
8. Open Stock Ledger and Reports to verify the resulting movements.

## Odoo integration possibilities
The current hackathon prototype keeps the domain logic client-side so it can be demonstrated without external credentials. A production version can replace the persistence layer with Odoo APIs/models, map users and access rights to Odoo roles, synchronize warehouses/locations/products, and consume server-side stock moves and audit records.

## Security note
No API keys, passwords or production credentials are included. Demo data is intentionally local and can be reset from Settings.
