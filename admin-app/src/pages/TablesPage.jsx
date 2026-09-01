import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import QrCodeModal from '../components/QrCodeModal';
 
export default function TablesPage() {
  const { auth } = useAuth();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [qrTarget, setQrTarget] = useState(null);
 
  const loadTables = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getTables(auth.token);
      setTables(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [auth.token]);
 
  useEffect(() => {
    loadTables();
  }, [loadTables]);
 
  async function handleCreate(e) {
    e.preventDefault();
    if (!newTableNumber.trim()) return;
    setCreating(true);
    setError(null);
    try {
      await api.createTable(newTableNumber.trim(), auth.token);
      setNewTableNumber('');
      await loadTables();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }
 
  async function handleRotate(id) {
    if (!confirm('This invalidates the current printed QR code for this table. Continue?')) return;
    try {
      await api.rotateTableToken(id, auth.token);
      await loadTables();
    } catch (err) {
      setError(err.message);
    }
  }
 
  async function handleDelete(id) {
    if (!confirm('Delete this table? This cannot be undone.')) return;
    try {
      await api.deleteTable(id, auth.token);
      await loadTables();
    } catch (err) {
      setError(err.message);
    }
  }
 
  return (
    <div>
      <h2 className="mb-1 font-display text-2xl font-semibold">Tables</h2>
      <p className="mb-6 text-sm text-admin-muted">
        Create tables and generate the QR codes customers scan to order.
      </p>
 
      <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2 sm:flex-row">
        <input
          value={newTableNumber}
          onChange={(e) => setNewTableNumber(e.target.value)}
          placeholder="e.g. Table 12"
          className="w-full rounded-lg border border-admin-border bg-admin-surface px-3 py-2.5 outline-none focus:border-accent sm:w-64"
        />
        <button
          type="submit"
          disabled={creating}
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50"
        >
          {creating ? 'Adding…' : 'Add table'}
        </button>
      </form>
 
      {error && (
        <p className="mb-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
      )}
 
      {loading ? (
        <p className="text-admin-muted">Loading tables…</p>
      ) : tables.length === 0 ? (
        <p className="rounded-xl border border-dashed border-admin-border p-8 text-center text-admin-muted">
          No tables yet — add one above to get started.
        </p>
      ) : (
        <>
          {/* Desktop: table */}
          <div className="hidden overflow-hidden rounded-xl border border-admin-border bg-admin-surface md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-admin-surfaceMuted text-xs uppercase tracking-wide text-admin-muted">
                <tr>
                  <th className="px-4 py-3">Table</th>
                  <th className="px-4 py-3">Token</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tables.map((table) => (
                  <tr key={table.id} className="border-t border-admin-border">
                    <td className="px-4 py-3 font-medium">{table.tableNumber}</td>
                    <td className="px-4 py-3 font-mono text-xs text-admin-muted">
                      {table.publicToken.slice(0, 13)}…
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setQrTarget(table)}
                          className="rounded-lg border border-admin-border px-3 py-1.5 text-xs font-semibold transition hover:bg-admin-surfaceMuted"
                        >
                          QR code
                        </button>
                        <button
                          onClick={() => handleRotate(table.id)}
                          className="rounded-lg border border-admin-border px-3 py-1.5 text-xs font-semibold transition hover:bg-admin-surfaceMuted"
                        >
                          Rotate token
                        </button>
                        <button
                          onClick={() => handleDelete(table.id)}
                          className="rounded-lg border border-admin-border px-3 py-1.5 text-xs font-semibold text-danger transition hover:bg-danger/10"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
 
          {/* Mobile: stacked cards - avoids forcing horizontal scroll on a narrow table */}
          <div className="flex flex-col gap-3 md:hidden">
            {tables.map((table) => (
              <div key={table.id} className="rounded-xl border border-admin-border bg-admin-surface p-4">
                <p className="font-medium">{table.tableNumber}</p>
                <p className="mt-0.5 font-mono text-xs text-admin-muted">
                  {table.publicToken.slice(0, 13)}…
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => setQrTarget(table)}
                    className="rounded-lg border border-admin-border px-3 py-1.5 text-xs font-semibold transition hover:bg-admin-surfaceMuted"
                  >
                    QR code
                  </button>
                  <button
                    onClick={() => handleRotate(table.id)}
                    className="rounded-lg border border-admin-border px-3 py-1.5 text-xs font-semibold transition hover:bg-admin-surfaceMuted"
                  >
                    Rotate token
                  </button>
                  <button
                    onClick={() => handleDelete(table.id)}
                    className="rounded-lg border border-admin-border px-3 py-1.5 text-xs font-semibold text-danger transition hover:bg-danger/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
 
      {qrTarget && <QrCodeModal table={qrTarget} onClose={() => setQrTarget(null)} />}
    </div>
  );
}
