import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useTable } from './TableContext';

const CartContext = createContext(null);

function storageKey(token) {
  return `cart:${token}`;
}

export function CartProvider({ children }) {
  const { token } = useTable();
  const [items, setItems] = useState({}); // { [menuItemId]: { menuItem, quantity, notes } }

  // Load any existing cart for this table once the token is known
  useEffect(() => {
    if (!token) return;
    const stored = localStorage.getItem(storageKey(token));
    if (stored) setItems(JSON.parse(stored));
  }, [token]);

  // Persist on every change
  useEffect(() => {
    if (!token) return;
    localStorage.setItem(storageKey(token), JSON.stringify(items));
  }, [token, items]);

  const addItem = useCallback((menuItem) => {
    setItems((prev) => {
      const existing = prev[menuItem.id];
      return {
        ...prev,
        [menuItem.id]: {
          menuItem,
          quantity: (existing?.quantity ?? 0) + 1,
          notes: existing?.notes ?? '',
        },
      };
    });
  }, []);

  const decrementItem = useCallback((menuItemId) => {
    setItems((prev) => {
      const existing = prev[menuItemId];
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        const { [menuItemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [menuItemId]: { ...existing, quantity: existing.quantity - 1 } };
    });
  }, []);

  const removeItem = useCallback((menuItemId) => {
    setItems((prev) => {
      const { [menuItemId]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const setNotes = useCallback((menuItemId, notes) => {
    setItems((prev) => ({
      ...prev,
      [menuItemId]: { ...prev[menuItemId], notes },
    }));
  }, []);

  const clearCart = useCallback(() => {
    setItems({});
    if (token) localStorage.removeItem(storageKey(token));
  }, [token]);

  const itemList = useMemo(() => Object.values(items), [items]);
  const itemCount = useMemo(
    () => itemList.reduce((sum, i) => sum + i.quantity, 0),
    [itemList]
  );
  const subtotal = useMemo(
    () => itemList.reduce((sum, i) => sum + i.quantity * i.menuItem.price, 0),
    [itemList]
  );

  return (
    <CartContext.Provider
      value={{ items, itemList, itemCount, subtotal, addItem, decrementItem, removeItem, setNotes, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
