import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTable } from '../context/TableContext';
import { api } from '../lib/api';

export default function CartDrawer({ onClose }) {
  const { itemList, subtotal, addItem, decrementItem, removeItem, setNotes, clearCart } = useCart();
  const { token } = useTable();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handlePlaceOrder() {
    setSubmitting(true);
    setError(null);
    try {
      const orderItems = itemList.map((i) => ({
        menuItemId: i.menuItem.id,
        quantity: i.quantity,
        notes: i.notes || null,
      }));
      const order = await api.placeOrder(token, orderItems);
      clearCart();
      navigate('/order/confirmation', { state: { order } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-10 flex items-end bg-black/40 sm:items-center sm:justify-center">
      <div
        className="max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-menu-surface sm:max-w-md sm:rounded-2xl"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-menu-border bg-menu-surface px-5 py-4">
          <h2 className="font-display text-xl font-medium">Your order</h2>
          <button onClick={onClose} className="text-2xl leading-none text-menu-muted">
            &times;
          </button>
        </div>

        <div className="px-5 py-2">
          {itemList.length === 0 ? (
            <p className="py-8 text-center text-menu-muted">Your cart is empty</p>
          ) : (
            itemList.map(({ menuItem, quantity, notes }) => (
              <div key={menuItem.id} className="border-b border-menu-border py-4 last:border-none">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-base font-medium">{menuItem.name}</h3>
                  <span className="text-sm font-semibold">
                    ${(menuItem.price * quantity).toFixed(2)}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-3 rounded-full bg-menu-surfaceMuted px-3 py-1.5">
                    <button
                      onClick={() => decrementItem(menuItem.id)}
                      className="text-lg font-semibold leading-none"
                      aria-label={`Remove one ${menuItem.name}`}
                    >
                      −
                    </button>
                    <span className="min-w-[1ch] text-center text-sm font-semibold">{quantity}</span>
                    <button
                      onClick={() => addItem(menuItem)}
                      className="text-lg font-semibold leading-none"
                      aria-label={`Add one more ${menuItem.name}`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(menuItem.id)}
                    className="text-xs font-medium text-menu-muted underline"
                  >
                    Remove
                  </button>
                </div>

                <input
                  value={notes}
                  onChange={(e) => setNotes(menuItem.id, e.target.value)}
                  placeholder="Add a note (e.g. no onions)"
                  className="mt-2 w-full rounded-lg border border-menu-border bg-menu-bg px-3 py-1.5 text-xs outline-none focus:border-accent"
                />
              </div>
            ))
          )}
        </div>

        {itemList.length > 0 && (
          <div className="sticky bottom-0 border-t border-menu-border bg-menu-surface px-5 py-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-menu-muted">Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>

            {error && (
              <p className="mb-3 rounded-lg bg-accent-light px-3 py-2 text-xs text-accent-hover">
                {error}
              </p>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={submitting}
              className="w-full rounded-xl bg-accent py-3.5 font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50"
            >
              {submitting ? 'Placing order…' : 'Place order'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
