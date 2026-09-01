import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import TablesPage from './pages/TablesPage';
import MenuPage from './pages/MenuPage';
import StaffPage from './pages/StaffPage';
import OrdersPage from './pages/OrdersPage';
 
function RequireAuth({ children }) {
  const { auth } = useAuth();
  return auth?.token ? children : <LoginPage />;
}
 
function AppRoutes() {
  return (
    <Routes>
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/tables" element={<TablesPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="*" element={<Navigate to="/tables" replace />} />
      </Route>
    </Routes>
  );
}
 
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
