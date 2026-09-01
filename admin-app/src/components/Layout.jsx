import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChangePasswordModal from './ChangePasswordModal';
 
const NAV_ITEMS = [
  { to: '/tables', label: 'Tables' },
  { to: '/menu', label: 'Menu' },
  { to: '/orders', label: 'Orders' },
  { to: '/staff', label: 'Staff' },
];
 
function SidebarContent({ auth, logout, onNavigate, onChangePassword }) {
  return (
    <>
      <h1 className="mb-8 px-2 font-display text-lg font-semibold">Restaurant Admin</h1>
 
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-accent-light text-accent'
                  : 'text-admin-muted hover:bg-admin-surfaceMuted'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
 
      <div className="border-t border-admin-border pt-4">
        <p className="mb-2 px-2 text-xs text-admin-muted">{auth?.username}</p>
        <button
          onClick={onChangePassword}
          className="w-full rounded-lg px-3 py-2 text-left text-sm text-admin-muted transition hover:bg-admin-surfaceMuted"
        >
          Change password
        </button>
        <button
          onClick={logout}
          className="w-full rounded-lg px-3 py-2 text-left text-sm text-admin-muted transition hover:bg-danger/10 hover:text-danger"
        >
          Sign out
        </button>
      </div>
    </>
  );
}
 
export default function Layout() {
  const { auth, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
 
  function openChangePassword() {
    setMenuOpen(false); // close the mobile drawer if it was open
    setPasswordModalOpen(true);
  }
 
  return (
    <div className="min-h-screen md:flex">
      {/* Mobile top bar - hidden on desktop */}
      <div className="flex items-center justify-between border-b border-admin-border bg-admin-surface px-4 py-3 md:hidden">
        <h1 className="font-display text-base font-semibold">Restaurant Admin</h1>
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 text-admin-text hover:bg-admin-surfaceMuted"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
 
      {/* Mobile drawer overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-20 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-admin-surface px-4 py-6 shadow-xl">
            <SidebarContent
              auth={auth}
              logout={logout}
              onNavigate={() => setMenuOpen(false)}
              onChangePassword={openChangePassword}
            />
          </aside>
        </div>
      )}
 
      {/* Static sidebar - desktop only */}
      <aside className="hidden w-56 flex-shrink-0 flex-col border-r border-admin-border bg-admin-surface px-4 py-6 md:flex">
        <SidebarContent auth={auth} logout={logout} onChangePassword={openChangePassword} />
      </aside>
 
      <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
        <Outlet />
      </main>
 
      {passwordModalOpen && (
        <ChangePasswordModal onClose={() => setPasswordModalOpen(false)} />
      )}
    </div>
  );
}
