import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
 
const WS_URL = import.meta.env.VITE_WS_URL;
 
/**
 * Connects to the kitchen topic and invokes onOrderUpdate for every order
 * broadcast (both new orders and status changes - the backend sends both
 * through the same topic). Returns the client so the caller can deactivate it.
 *
 * `token` is sent as a STOMP connectHeader (not an HTTP header) - the backend's
 * StompAuthChannelInterceptor reads it off the CONNECT frame itself, since after
 * the initial handshake this is a persistent connection, not a series of
 * separate HTTP requests each carrying their own Authorization header.
 */
export function connectToKitchenFeed(token, onOrderUpdate, onStatusChange) {
  const client = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    reconnectDelay: 3000, // auto-retry if the connection drops (wifi hiccup, laptop sleep, etc)
    onConnect: () => {
      onStatusChange?.('connected');
      client.subscribe('/topic/kitchen', (message) => {
        const order = JSON.parse(message.body);
        onOrderUpdate(order);
      });
    },
    onDisconnect: () => onStatusChange?.('disconnected'),
    onWebSocketError: () => onStatusChange?.('error'),
    // Fires if the backend's StompAuthChannelInterceptor rejects the CONNECT
    // frame (missing/invalid/expired token) - distinct from a network-level error.
    onStompError: () => onStatusChange?.('error'),
  });
 
  client.activate();
  return client;
}
