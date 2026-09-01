import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
 
const EMPTY_ITEM_FORM = { name: '', price: '', description: '', imageUrl: '' };
 
export default function MenuPage() {
  const { auth } = useAuth();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [itemForm, setItemForm] = useState(EMPTY_ITEM_FORM);
  const [editingItemId, setEditingItemId] = useState(null);
  const [saving, setSaving] = useState(false);
 
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, menuItems] = await Promise.all([
        api.getCategories(auth.token),
        api.getMenuItems(auth.token),
      ]);
      setCategories(cats);
      setItems(menuItems);
      if (!selectedCategoryId && cats.length > 0) setSelectedCategoryId(cats[0].id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.token]);
 
  useEffect(() => {
    loadAll();
  }, [loadAll]);
 
  async function handleCreateCategory(e) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await api.createCategory(newCategoryName.trim(), auth.token);
      setNewCategoryName('');
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }
 
  function startEdit(item) {
    setEditingItemId(item.id);
    setSelectedCategoryId(item.categoryId);
    setItemForm({
      name: item.name,
      price: item.price,
      description: item.description ?? '',
      imageUrl: item.imageUrl ?? '',
    });
  }
 
  function cancelEdit() {
    setEditingItemId(null);
    setItemForm(EMPTY_ITEM_FORM);
  }
 
  async function handleSubmitItem(e) {
    e.preventDefault();
    if (!itemForm.name.trim() || !itemForm.price || !selectedCategoryId) return;
 
    setSaving(true);
    setError(null);
    const payload = {
      name: itemForm.name.trim(),
      price: parseFloat(itemForm.price),
      description: itemForm.description.trim() || null,
      imageUrl: itemForm.imageUrl.trim() || null,
      available: true,
    };
 
    try {
      if (editingItemId) {
        await api.updateMenuItem(editingItemId, payload, auth.token);
      } else {
        await api.createMenuItem(selectedCategoryId, payload, auth.token);
      }
      cancelEdit();
      await loadAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }
 
  async function toggleAvailability(item) {
    try {
      await api.setMenuItemAvailability(item.id, !item.available, auth.token);
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }
 
  async function handleDeleteItem(id) {
    if (!confirm('Delete this menu item?')) return;
    try {
      await api.deleteMenuItem(id, auth.token);
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }
 
  if (loading) return <p className="text-admin-muted">Loading menu…</p>;
 
  return (
    <div>
      <h2 className="mb-1 font-display text-2xl font-semibold">Menu</h2>
      <p className="mb-6 text-sm text-admin-muted">Manage categories and items shown to customers.</p>
 
      {error && (
        <p className="mb-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
      )}
 
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        {/* Categories */}
        <div>
          <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-admin-muted">
            Categories
          </h3>
          <form onSubmit={handleCreateCategory} className="mb-4 flex gap-2">
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category"
              className="flex-1 rounded-lg border border-admin-border bg-admin-surface px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
            >
              +
            </button>
          </form>
          <ul className="flex flex-col gap-1">
            {categories.map((cat) => (
              <li key={cat.id} className="rounded-lg border border-admin-border bg-admin-surface px-3 py-2 text-sm">
                {cat.name}
              </li>
            ))}
          </ul>
        </div>
 
        {/* Items */}
        <div>
          <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-admin-muted">
            {editingItemId ? 'Edit item' : 'Add item'}
          </h3>
          <form
            onSubmit={handleSubmitItem}
            className="mb-6 grid grid-cols-1 gap-3 rounded-xl border border-admin-border bg-admin-surface p-4 sm:grid-cols-2"
          >
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm outline-none focus:border-accent"
              required
            >
              <option value="" disabled>Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <input
              value={itemForm.name}
              onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
              placeholder="Item name"
              className="rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm outline-none focus:border-accent"
              required
            />
            <input
              type="number"
              step="0.01"
              min="0"
              value={itemForm.price}
              onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
              placeholder="Price"
              className="rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm outline-none focus:border-accent"
              required
            />
            <input
              value={itemForm.imageUrl}
              onChange={(e) => setItemForm({ ...itemForm, imageUrl: e.target.value })}
              placeholder="Image URL (optional)"
              className="rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <textarea
              value={itemForm.description}
              onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
              placeholder="Description (optional)"
              className="col-span-full rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm outline-none focus:border-accent"
              rows={2}
            />
            <div className="col-span-full flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50"
              >
                {saving ? 'Saving…' : editingItemId ? 'Save changes' : 'Add item'}
              </button>
              {editingItemId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-lg border border-admin-border px-4 py-2 text-sm font-semibold text-admin-muted transition hover:bg-admin-surfaceMuted"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
 
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-admin-border bg-admin-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">
                    {item.name}{' '}
                    <span className="font-mono text-sm text-admin-muted">${Number(item.price).toFixed(2)}</span>
                  </p>
                  <p className="text-xs text-admin-muted">{item.categoryName}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => toggleAvailability(item)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      item.available
                        ? 'bg-success/10 text-success hover:bg-success/20'
                        : 'bg-admin-surfaceMuted text-admin-muted hover:bg-admin-border'
                    }`}
                  >
                    {item.available ? 'Available' : 'Unavailable'}
                  </button>
                  <button
                    onClick={() => startEdit(item)}
                    className="rounded-lg border border-admin-border px-3 py-1.5 text-xs font-semibold transition hover:bg-admin-surfaceMuted"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="rounded-lg border border-admin-border px-3 py-1.5 text-xs font-semibold text-danger transition hover:bg-danger/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
