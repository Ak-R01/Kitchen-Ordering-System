import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
 
export default function LoginPage() {
  const { login, sessionMessage } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
 
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }
 
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-admin-border bg-admin-surface p-8 shadow-sm"
      >
        <h1 className="mb-1 font-display text-2xl font-semibold">Restaurant Admin</h1>
        <p className="mb-6 text-sm text-admin-muted">Manage tables and menu</p>
 
        {sessionMessage && (
          <p className="mb-4 rounded-lg bg-accent-light px-3 py-2 text-sm text-accent-hover">
            {sessionMessage}
          </p>
        )}
 
        <label className="mb-1 block text-xs uppercase tracking-wide text-admin-muted">
          Username
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 w-full rounded-lg border border-admin-border bg-admin-bg px-3 py-2.5 outline-none focus:border-accent"
          autoComplete="username"
          required
        />
 
        <label className="mb-1 block text-xs uppercase tracking-wide text-admin-muted">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded-lg border border-admin-border bg-admin-bg px-3 py-2.5 outline-none focus:border-accent"
          autoComplete="current-password"
          required
        />
 
        {error && (
          <p className="mb-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
        )}
 
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-accent py-3 font-display text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
