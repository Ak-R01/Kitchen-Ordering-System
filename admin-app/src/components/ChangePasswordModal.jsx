import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
 
export default function ChangePasswordModal({ onClose }) {
  const { auth } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
 
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
 
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }
 
    setSubmitting(true);
    try {
      await api.changePassword(currentPassword, newPassword, auth.token);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }
 
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-xl border border-admin-border bg-admin-surface p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 font-display text-lg font-semibold">Change password</h3>
 
        {success ? (
          <>
            <p className="mb-4 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
              Password updated successfully.
            </p>
            <button
              onClick={onClose}
              className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
            >
              Done
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              autoComplete="current-password"
              className="rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm outline-none focus:border-accent"
              required
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (min 8 characters)"
              autoComplete="new-password"
              minLength={8}
              className="rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm outline-none focus:border-accent"
              required
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              autoComplete="new-password"
              className="rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm outline-none focus:border-accent"
              required
            />
 
            {error && (
              <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
            )}
 
            <div className="mt-1 flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50"
              >
                {submitting ? 'Updating…' : 'Update password'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-admin-border px-4 py-2.5 text-sm font-semibold text-admin-muted transition hover:bg-admin-surfaceMuted"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
