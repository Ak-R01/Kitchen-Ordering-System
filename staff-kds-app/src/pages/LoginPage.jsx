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
        className="w-full max-w-sm rounded-xl border border-kitchen-border bg-kitchen-surface p-8"
      >
        <h1 className="mb-1 font-display text-2xl font-semibold">Kitchen Display</h1>
        <p className="mb-6 text-sm text-kitchen-muted">Sign in to view live orders</p>
 
        {sessionMessage && (
          <p className="mb-4 rounded-lg bg-warn/10 px-3 py-2 text-sm text-warn">
            {sessionMessage}
          </p>
        )}
 
        <label className="mb-1 block text-xs uppercase tracking-wide text-kitchen-muted">
          Username
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 w-full rounded-lg border border-kitchen-border bg-kitchen-bg px-3 py-2.5 text-kitchen-text outline-none focus:border-fresh"
          autoComplete="username"
          required
        />
 
        <label className="mb-1 block text-xs uppercase tracking-wide text-kitchen-muted">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded-lg border border-kitchen-border bg-kitchen-bg px-3 py-2.5 text-kitchen-text outline-none focus:border-fresh"
          autoComplete="current-password"
          required
        />
 
        {error && (
          <p className="mb-4 rounded-lg bg-urgent/10 px-3 py-2 text-sm text-urgent">{error}</p>
        )}
 
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-fresh py-3 font-display text-sm font-semibold text-kitchen-bg transition hover:brightness-110 disabled:opacity-50"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
