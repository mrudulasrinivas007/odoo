import { Routes, Route, Navigate } from 'react-router-dom';
import { InventoryProvider } from './context/InventoryContext';
import { AppShell } from './components/AppShell';

import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Operations from './pages/Operations';
import Warehouses from './pages/Warehouses';
import Ledger from './pages/Ledger';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

export default function App() {
  return (
    <InventoryProvider>
      <Routes>
        <Route element={<AppShell />}>

          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/receipts"
            element={<Operations type="Receipt" />}
          />

          <Route
            path="/deliveries"
            element={<Operations type="Delivery" />}
          />

          <Route
            path="/transfers"
            element={<Operations type="Transfer" />}
          />

          <Route
            path="/adjustments"
            element={<Operations type="Adjustment" />}
          />

          <Route
            path="/ledger"
            element={<Ledger />}
          />

          <Route
            path="/warehouses"
            element={<Warehouses />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />

        </Route>
      </Routes>
    </InventoryProvider>
  );
}
