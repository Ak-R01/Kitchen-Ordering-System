import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
 
const EMPTY_FORM = { name: '', username: '', password: '', role: 'KITCHEN' };
 
export default function StaffPage() {
  const { auth } = useAuth();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
 
  const loadStaff = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getStaff(auth.token);
      setStaff(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [auth.token]);
 
  useEffect(() => {
    loadStaff();
  }, [loadStaff]);
 
  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      await api.createStaff(form, auth.token);
      setForm(EMPTY_FORM);
      await loadStaff();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }
 
  async function handleDelete(id) {
    if (!confirm('Remove this staff account? They will no longer be able to log in.')) return;
    try {
      await api.deleteStaff(id, auth.token);
      await loadStaff();
    } catch (err) {
      setError(err.message);
    }
  }
 
  return (
    <div>
      <h2 className="mb-1 font-display text-2xl font-semibold">Staff</h2>
      <p className="mb-6 text-sm text-admin-muted">
        Create logins for kitchen staff (KDS access) or additional admins.
      </p>
 
      <form
        onSubmit={handleCreate}
        className="mb-6 grid grid-cols-1 gap-3 rounded-xl border border-admin-border bg-admin-surface p-4 sm:grid-cols-2"
      >
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Full name"
          className="rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm outline-none focus:border-accent"
          required
        />
        <input
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          placeholder="Username"
          className="rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm outline-none focus:border-accent"
          autoComplete="off"
          required
        />
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password (min 8 characters)"
          className="rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm outline-none focus:border-accent"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm outline-none focus:border-accent"
        >
          <option value="KITCHEN">Kitchen (KDS access only)</option>
          <option value="ADMIN">Admin (full access)</option>
        </select>
 
        <div className="col-span-full">
          <button
            type="submit"
            disabled={creating}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50"
          >
            {creating ? 'Creating…' : 'Create account'}
          </button>
        </div>
      </form>
 
      {error && (
        <p className="mb-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
      )}
 
      {loading ? (
        <p className="text-admin-muted">Loading staff…</p>
      ) : staff.length === 0 ? (
        <p className="rounded-xl border border-dashed border-admin-border p-8 text-center text-admin-muted">
          No staff accounts yet.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {staff.map((person) => (
            <div
              key={person.id}
              className="flex flex-col gap-2 rounded-xl border border-admin-border bg-admin-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{person.name}</p>
                <p className="text-xs text-admin-muted">
                  @{person.username} · {person.role === 'ADMIN' ? 'Admin' : 'Kitchen'}
                </p>
              </div>
              {person.username !== auth?.username && (
                <button
                  onClick={() => handleDelete(person.id)}
                  className="self-start rounded-lg border border-admin-border px-3 py-1.5 text-xs font-semibold text-danger transition hover:bg-danger/10 sm:self-auto"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
 
