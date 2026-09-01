import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../hooks/useOrders';
import OrderCard from '../components/OrderCard';
import ChangePasswordModal from '../components/ChangePasswordModal';
 
const COLUMNS = [
  { status: 'PLACED', title: 'New' },
  { status: 'PREPARING', title: 'Preparing' },
  { status: 'READY', title: 'Ready' },
];
 
const CONNECTION_LABEL = {
  connecting: { text: 'Connecting…', className: 'text-kitchen-muted' },
  connected: { text: 'Live', className: 'text-fresh' },
  disconnected: { text: 'Reconnecting…', className: 'text-warn' },
  error: { text: 'Connection error', className: 'text-urgent' },
};
 
export default function KitchenDashboard() {
  const { auth, logout } = useAuth();
  const { orders, loading, connectionStatus, updateStatus } = useOrders(auth?.token);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
 
  const connLabel = CONNECTION_LABEL[connectionStatus] ?? CONNECTION_LABEL.connecting;
 
  return (
    <div className="min-h-screen px-6 py-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold">Kitchen Display</h1>
          <p className="flex items-center gap-1.5 text-xs">
            <span className={`h-1.5 w-1.5 rounded-full bg-current ${connLabel.className}`} />
            <span className={connLabel.className}>{connLabel.text}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-kitchen-muted">{auth?.username}</span>
          <button
            onClick={() => setPasswordModalOpen(true)}
            className="rounded-lg border border-kitchen-border px-3 py-1.5 text-sm text-kitchen-muted transition hover:bg-kitchen-surfaceHover"
          >
            Change password
          </button>
          <button
            onClick={logout}
            className="rounded-lg border border-kitchen-border px-3 py-1.5 text-sm text-kitchen-muted transition hover:border-urgent hover:text-urgent"
          >
            Sign out
          </button>
        </div>
      </header>
 
      {loading ? (
        <p className="text-kitchen-muted">Loading orders…</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {COLUMNS.map((col) => {
            const columnOrders = orders.filter((o) => o.status === col.status);
            return (
              <section key={col.status}>
                <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-kitchen-muted">
                  {col.title}
                  <span className="ml-2 text-kitchen-muted">({columnOrders.length})</span>
                </h2>
                <div className="flex flex-col gap-4">
                  {columnOrders.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-kitchen-border p-6 text-center text-sm text-kitchen-muted">
                      Nothing here
                    </p>
                  ) : (
                    columnOrders.map((order) => (
                      <OrderCard key={order.id} order={order} onUpdateStatus={updateStatus} />
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
 
      {passwordModalOpen && (
        <ChangePasswordModal onClose={() => setPasswordModalOpen(false)} />
      )}
    </div>
  );
}
