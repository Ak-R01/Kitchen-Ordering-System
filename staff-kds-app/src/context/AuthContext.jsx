import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../lib/api';
 
const AuthContext = createContext(null);
 
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem('kds_auth');
    return stored ? JSON.parse(stored) : null;
  });
  const [sessionMessage, setSessionMessage] = useState(null);
 
  const logout = useCallback(() => {
    localStorage.removeItem('kds_auth');
    setAuth(null);
  }, []);
 
  // Fired by lib/api.js whenever any request comes back 401 with a token attached -
  // the session is no longer valid, so log out automatically rather than leaving
  // the kitchen screen stuck failing to load orders with no explanation.
  useEffect(() => {
    function handleUnauthorized() {
      logout();
      setSessionMessage('Your session expired. Please log in again.');
    }
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [logout]);
 
  const login = useCallback(async (username, password) => {
    const result = await api.login(username, password); // { token, username, role }
    localStorage.setItem('kds_auth', JSON.stringify(result));
    setAuth(result);
    setSessionMessage(null);
    return result;
  }, []);
 
  return (
    <AuthContext.Provider value={{ auth, login, logout, sessionMessage }}>
      {children}
    </AuthContext.Provider>
  );
}
 
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
