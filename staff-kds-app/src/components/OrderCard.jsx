import { useState } from 'react';
import ElapsedTimeBadge from './ElapsedTimeBadge';

const NEXT_STATUS = {
  PLACED: { label: 'Start preparing', next: 'PREPARING' },
  PREPARING: { label: 'Mark ready', next: 'READY' },
  READY: { label: 'Mark served', next: 'SERVED' },
};

const STATUS_LABEL = {
  PLACED: 'New',
  PREPARING: 'Preparing',
  READY: 'Ready',
};

export default function OrderCard({ order, onUpdateStatus }) {
  const [updating, setUpdating] = useState(false);
  const action = NEXT_STATUS[order.status];

  async function handleAction() {
    setUpdating(true);
    try {
      await onUpdateStatus(order.id, action.next);
    } catch (err) {
      // Keep it simple and visible - a toast system can replace this later
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-kitchen-border bg-kitchen-surface p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-kitchen-muted">
            {STATUS_LABEL[order.status]}
          </p>
          <h3 className="font-display text-2xl font-semibold">{order.tableNumber}</h3>
        </div>
        <ElapsedTimeBadge createdAt={order.createdAt} />
      </div>

      <ul className="flex flex-col gap-2">
        {order.items.map((item, i) => (
          <li key={i} className="flex items-start justify-between gap-3 text-sm">
            <span>
              <span className="font-mono font-semibold text-fresh">{item.quantity}×</span>{' '}
              {item.menuItemName}
              {item.notes && (
                <span className="block text-xs text-kitchen-muted">{item.notes}</span>
              )}
            </span>
          </li>
        ))}
      </ul>

      {action && (
        <button
          onClick={handleAction}
          disabled={updating}
          className="mt-auto w-full rounded-lg bg-fresh py-3 font-display text-sm font-semibold text-kitchen-bg transition hover:brightness-110 disabled:opacity-50"
        >
          {updating ? 'Updating…' : action.label}
        </button>
      )}
    </div>
  );
}
