import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, PageHeader } from '../components/ui';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const email = user?.email || 'No email';

  return (
    <>
      <PageHeader
        title="My Profile"
        description="Inventory Manager account and workspace access."
      />

      <Card className="max-w-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-teal-100 text-xl font-black text-teal-800">
            AU
          </div>

          <div>
            <h2 className="text-lg font-bold">Admin User</h2>
            <p className="text-sm text-slate-500">
              {email} · Inventory Manager
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="text-xs text-slate-400">Role</div>
            <b>Inventory Manager</b>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <div className="text-xs text-slate-400">Workspace</div>
            <b>StockSense Demo</b>
          </div>
        </div>

        <Button
          variant="secondary"
          className="mt-5"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          Logout
        </Button>
      </Card>
    </>
  );
}