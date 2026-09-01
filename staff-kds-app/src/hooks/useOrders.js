import { useEffect, useState, useCallback, useRef } from 'react';
import { api } from '../lib/api';
import { connectToKitchenFeed } from '../lib/websocket';
 
const ACTIVE_STATUSES = ['PLACED', 'PREPARING', 'READY'];
 
export function useOrders(token) {
  const [orders, setOrders] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [loading, setLoading] = useState(true);
  const clientRef = useRef(null);
 
  const upsertOrder = useCallback((incoming) => {
    setOrders((prev) => {
      // SERVED orders drop off the board entirely
      if (incoming.status === 'SERVED') {
        return prev.filter((o) => o.id !== incoming.id);
      }
      const exists = prev.some((o) => o.id === incoming.id);
      if (exists) {
        return prev.map((o) => (o.id === incoming.id ? incoming : o));
      }
      // New order - goes to the top so the kitchen sees it immediately
      return [incoming, ...prev];
    });
  }, []);
 
  // Initial load: fetch each active status via REST. This covers anything
  // that happened while this screen wasn't connected yet.
  useEffect(() => {
    if (!token) return;
 
    let cancelled = false;
 
    async function loadInitial() {
      setLoading(true);
      try {
        const results = await Promise.all(
          ACTIVE_STATUSES.map((status) => api.getOrdersByStatus(status, token))
        );
        if (!cancelled) {
          const merged = results.flat().sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          setOrders(merged);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
 
    loadInitial();
    return () => { cancelled = true; };
  }, [token]);
 
  // Live updates: connect once and keep the board in sync going forward.
  useEffect(() => {
    if (!token) return;
 
    const client = connectToKitchenFeed(token, upsertOrder, setConnectionStatus);
    clientRef.current = client;
 
    return () => client.deactivate();
  }, [token, upsertOrder]);
 
  const updateStatus = useCallback(async (orderId, newStatus) => {
    // Optimistic-ish: the REST call triggers a broadcast, which upsertOrder
    // will pick up and apply - no need to update local state here directly.
    await api.updateOrderStatus(orderId, newStatus, token);
  }, [token]);
 
  return { orders, loading, connectionStatus, updateStatus };
}
