import { Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';

import { ProtectedRoute } from './components/ProtectedRoute';
import { AppShell } from './components/AppShell';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

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
    <AuthProvider>
      <InventoryProvider>
        <Routes>

          {/* Public Authentication Routes */}
          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<SignUp />} />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />

          {/* Protected Application Routes */}
          <Route element={<ProtectedRoute />}>
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
          </Route>

        </Routes>
      </InventoryProvider>
    </AuthProvider>
  );
}