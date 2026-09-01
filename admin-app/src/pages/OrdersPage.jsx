import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
 
const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'PLACED', label: 'Placed' },
  { value: 'PREPARING', label: 'Preparing' },
  { value: 'READY', label: 'Ready' },
  { value: 'SERVED', label: 'Served' },
];
 
const STATUS_STYLES = {
  PLACED: 'bg-accent-light text-accent',
  PREPARING: 'bg-accent-light text-accent',
  READY: 'bg-success/10 text-success',
  SERVED: 'bg-admin-surfaceMuted text-admin-muted',
};
 
function formatDateTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}
 
export default function OrdersPage() {
  const { auth } = useAuth();
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null); // PageResponseDto shape
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getOrderHistory(statusFilter || null, page, 20, auth.token);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [auth.token, statusFilter, page]);
 
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);
 
  function handleFilterChange(value) {
    setStatusFilter(value);
    setPage(0); // reset to first page whenever the filter changes
  }
 
  function orderTotal(order) {
    return order.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  }
 
  return (
    <div>
      <h2 className="mb-1 font-display text-2xl font-semibold">Order History</h2>
      <p className="mb-6 text-sm text-admin-muted">
        Every order ever placed, newest first.
      </p>
 
      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => handleFilterChange(f.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              statusFilter === f.value
                ? 'bg-accent text-white'
                : 'border border-admin-border text-admin-muted hover:bg-admin-surfaceMuted'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
 
      {error && (
        <p className="mb-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
      )}
 
      {loading ? (
        <p className="text-admin-muted">Loading orders…</p>
      ) : !data || data.content.length === 0 ? (
        <p className="rounded-xl border border-dashed border-admin-border p-8 text-center text-admin-muted">
          No orders found.
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {data.content.map((order) => (
              <div key={order.id} className="rounded-xl border border-admin-border bg-admin-surface p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-medium">{order.tableNumber}</span>
                    <span className="ml-2 text-xs text-admin-muted">
                      {formatDateTime(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                    <span className="font-mono text-sm font-semibold">
                      ${orderTotal(order).toFixed(2)}
                    </span>
                  </div>
                </div>
                <ul className="text-sm text-admin-muted">
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.quantity}× {item.menuItemName}
                      {item.notes && <span className="italic"> — {item.notes}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
 
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-admin-muted">
              Page {data.page + 1} of {data.totalPages} · {data.totalElements} orders total
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={data.page === 0}
                className="rounded-lg border border-admin-border px-3 py-1.5 font-semibold text-admin-muted transition hover:bg-admin-surfaceMuted disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages - 1, p + 1))}
                disabled={data.page >= data.totalPages - 1}
                className="rounded-lg border border-admin-border px-3 py-1.5 font-semibold text-admin-muted transition hover:bg-admin-surfaceMuted disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
