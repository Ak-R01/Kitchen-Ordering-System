import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import KitchenDashboard from './pages/KitchenDashboard';

function Gate() {
  const { auth } = useAuth();
  return auth?.token ? <KitchenDashboard /> : <LoginPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
