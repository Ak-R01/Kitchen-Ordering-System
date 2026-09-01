import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TableProvider, useTable } from './context/TableContext';
import { CartProvider } from './context/CartContext';
import MenuPage from './pages/MenuPage';
import ConfirmationPage from './pages/ConfirmationPage';
import InvalidTablePage from './pages/InvalidTablePage';

function OrderGate({ children }) {
  const { status } = useTable();

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center text-menu-muted">Loading…</div>;
  }
  if (status === 'invalid') {
    return <InvalidTablePage />;
  }
  return <CartProvider>{children}</CartProvider>;
}

function OrderRoutes() {
  return (
    <TableProvider>
      <Routes>
        <Route
          path="/order"
          element={
            <OrderGate>
              <MenuPage />
            </OrderGate>
          }
        />
        <Route path="/order/confirmation" element={<ConfirmationPage />} />
        <Route path="*" element={<Navigate to="/order" replace />} />
      </Routes>
    </TableProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <OrderRoutes />
    </BrowserRouter>
  );
}
