import { useLocation } from 'react-router-dom';

export default function ConfirmationPage() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    // Someone landed here directly (refresh, bookmark) without an order in state
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-menu-muted">No recent order to show.</p>
        <button onClick={() => window.history.back()} className="mt-3 text-sm font-semibold text-accent underline">
          Go back
        </button>
      </div>
    );
  }

  const total = order.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center px-6 pt-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-success">
          <path d="M20 6L9 17l-5-5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="mb-1 font-display text-2xl font-medium">Order placed!</h1>
      <p className="mb-8 text-sm text-menu-muted">
        {order.tableNumber} · Sit tight, the kitchen has your order.
      </p>

      <div className="w-full rounded-2xl border border-menu-border bg-menu-surface p-5 text-left">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-start justify-between border-b border-menu-border py-2.5 last:border-none">
            <span className="text-sm">
              <span className="font-semibold">{item.quantity}×</span> {item.menuItemName}
              {item.notes && <span className="block text-xs text-menu-muted">{item.notes}</span>}
            </span>
            <span className="text-sm font-semibold">
              ${(item.quantity * item.unitPrice).toFixed(2)}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between pt-3 text-sm font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
