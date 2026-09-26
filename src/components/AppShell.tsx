import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

import {
  Bell,
  ClipboardCheck,
  FileBarChart,
  House,
  Menu,
  Package,
  Settings,
  Truck,
  Warehouse,
  ArrowLeftRight,
  SlidersHorizontal,
  BookOpen,
  UserCircle,
  X,
  CheckCheck,
} from 'lucide-react';

import { useInventory } from '../context/InventoryContext';

const links = [
  ['/dashboard', 'Dashboard', House],
  ['/products', 'Products', Package],
  ['/receipts', 'Receipts', ClipboardCheck],
  ['/deliveries', 'Delivery Orders', Truck],
  ['/transfers', 'Internal Transfers', ArrowLeftRight],
  ['/adjustments', 'Stock Adjustments', SlidersHorizontal],
  ['/ledger', 'Stock Ledger', BookOpen],
  ['/warehouses', 'Warehouses', Warehouse],
  ['/reports', 'Reports & Analytics', FileBarChart],
  ['/settings', 'Settings', Settings],
] as const;

export function AppShell() {
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const { notifications, markRead } = useInventory();

  const unread = notifications.filter(
    (n) => !n.read
  ).length;

  const loc = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${
          open
            ? 'translate-x-0'
            : '-translate-x-full'
        }`}
      >

        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">

          <div className="flex items-center gap-3">

            <div className="grid h-9 w-9 place-items-center rounded-xl bg-teal-700 text-white font-black">
              S
            </div>

            <div>
              <div className="font-extrabold">
                StockSense
              </div>

              <div className="text-[10px] uppercase tracking-widest text-slate-400">
                Inventory OS
              </div>
            </div>

          </div>

          <button
            className="lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X />
          </button>

        </div>

        <nav className="space-y-1 p-3">

          {links.map(
            ([to, label, Icon]) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${
                    isActive
                      ? 'bg-teal-50 text-teal-800'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            )
          )}

        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-100 p-3">

          <NavLink
            to="/profile"
            className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-50"
          >

            <UserCircle
              size={30}
              className="text-slate-400"
            />

            <div className="min-w-0">

              <div className="truncate text-sm font-bold">
                Admin User
              </div>

              <div className="truncate text-xs text-slate-400">
                Inventory Manager
              </div>

            </div>

          </NavLink>

        </div>

      </aside>

      <div className="lg:pl-64">

        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">

          <button
            className="lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>

          <div className="hidden text-sm font-semibold text-slate-500 sm:block">
            {
              links.find(
                (x) => x[0] === loc.pathname
              )?.[1] || 'StockSense'
            }
          </div>

          <div className="ml-auto flex items-center gap-2">

            <NavLink
              to="/settings"
              className="rounded-xl p-2.5 hover:bg-slate-100"
            >
              <Settings size={19} />
            </NavLink>

            <div className="relative">

              <button
                onClick={() =>
                  setNotificationsOpen(
                    (value) => !value
                  )
                }
                className="relative rounded-xl p-2.5 hover:bg-slate-100"
                aria-label="Notifications"
              >

                <Bell size={19} />

                {unread > 0 && (
                  <span className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}

              </button>

              {notificationsOpen && (

                <div className="absolute right-0 top-12 z-50 w-[340px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">

                    <div>

                      <div className="font-bold">
                        Notifications
                      </div>

                      <div className="text-xs text-slate-400">
                        {unread > 0
                          ? `${unread} unread`
                          : 'All caught up'}
                      </div>

                    </div>

                    {unread > 0 && (

                      <button
                        onClick={() => markRead()}
                        className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-50"
                      >
                        <CheckCheck size={14} />
                        Mark all read
                      </button>

                    )}

                  </div>

                  <div className="max-h-[380px] overflow-y-auto">

                    {notifications.length === 0 && (

                      <div className="px-5 py-10 text-center">

                        <Bell
                          size={30}
                          className="mx-auto mb-3 text-slate-300"
                        />

                        <p className="text-sm font-semibold text-slate-600">
                          No notifications
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Inventory activity will appear here.
                        </p>

                      </div>

                    )}

                    {notifications.map(
                      (notification) => (

                        <button
                          key={notification.id}
                          onClick={() =>
                            markRead(notification.id)
                          }
                          className={`w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 ${
                            !notification.read
                              ? 'bg-teal-50/50'
                              : 'bg-white'
                          }`}
                        >

                          <div className="flex gap-3">

                            <div
                              className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                                notification.severity === 'success'
                                  ? 'bg-emerald-500'
                                  : notification.severity === 'warning'
                                  ? 'bg-amber-500'
                                  : notification.severity === 'error'
                                  ? 'bg-rose-500'
                                  : 'bg-sky-500'
                              }`}
                            />

                            <div className="min-w-0 flex-1">

                              <div className="flex items-start justify-between gap-2">

                                <p className="text-sm font-semibold text-slate-800">
                                  {notification.title}
                                </p>

                                {!notification.read && (
                                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-teal-600" />
                                )}

                              </div>

                              <p className="mt-1 text-xs leading-5 text-slate-500">
                                {notification.message}
                              </p>

                              <p className="mt-1 text-[10px] text-slate-400">
                                {new Date(
                                  notification.timestamp
                                ).toLocaleString()}
                              </p>

                            </div>

                          </div>

                        </button>

                      )
                    )}

                  </div>

                </div>

              )}

            </div>

            <NavLink
              to="/profile"
              className="hidden items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-100 sm:flex"
            >

              <div className="grid h-8 w-8 place-items-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">
                AU
              </div>

              <span className="text-sm font-semibold">
                Admin
              </span>

            </NavLink>

          </div>

        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
