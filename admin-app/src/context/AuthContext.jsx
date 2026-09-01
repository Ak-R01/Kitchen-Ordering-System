import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../lib/api';
 
const AuthContext = createContext(null);
 
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem('admin_auth');
    return stored ? JSON.parse(stored) : null;
  });
  const [sessionMessage, setSessionMessage] = useState(null);
 
  const logout = useCallback(() => {
    localStorage.removeItem('admin_auth');
    setAuth(null);
  }, []);
 
  // Fired by lib/api.js whenever any request comes back 401 with a token attached -
  // means the session is no longer valid, so log out automatically instead of
  // leaving the user stuck looking at a failed action with no explanation.
  useEffect(() => {
    function handleUnauthorized() {
      logout();
      setSessionMessage('Your session expired. Please log in again.');
    }
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [logout]);
 
  const login = useCallback(async (username, password) => {
    const result = await api.login(username, password);
    if (result.role !== 'ADMIN') {
      throw new Error('This account does not have admin access');
    }
    localStorage.setItem('admin_auth', JSON.stringify(result));
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
