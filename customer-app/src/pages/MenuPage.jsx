import { useEffect, useState } from 'react';
import { useTable } from '../context/TableContext';
import { api } from '../lib/api';
import MenuItemCard from '../components/MenuItemCard';
import CartBar from '../components/CartBar';
import CartDrawer from '../components/CartDrawer';

export default function MenuPage() {
  const { tableNumber } = useTable();
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    api
      .getMenu()
      .then((data) => {
        setCategories(data);
        if (data.length > 0) setActiveCategory(data[0].categoryName);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const activeItems = categories.find((c) => c.categoryName === activeCategory)?.items ?? [];

  return (
    <div className="pb-28">
      <header className="px-4 pt-6">
        <p className="text-xs uppercase tracking-wide text-menu-muted">You're ordering for</p>
        <h1 className="font-display text-2xl font-medium">{tableNumber}</h1>
      </header>

      {loading && <p className="px-4 pt-6 text-menu-muted">Loading menu…</p>}
      {error && <p className="px-4 pt-6 text-accent">{error}</p>}

      {!loading && !error && categories.length === 0 && (
        <p className="px-4 pt-6 text-menu-muted">The menu isn't available right now.</p>
      )}

      {!loading && !error && categories.length > 0 && (
        <div className="mt-4 flex">
          {/* Category rail */}
          <nav className="sticky top-0 h-[calc(100vh-1rem)] w-24 flex-shrink-0 overflow-y-auto border-r border-menu-border bg-menu-surfaceMuted sm:w-32">
            {categories.map((category) => {
              const isActive = category.categoryName === activeCategory;
              return (
                <button
                  key={category.categoryName}
                  onClick={() => setActiveCategory(category.categoryName)}
                  className={`w-full border-l-4 px-3 py-3.5 text-left text-xs font-medium leading-snug transition sm:text-sm ${
                    isActive
                      ? 'border-accent bg-menu-bg text-accent'
                      : 'border-transparent text-menu-muted'
                  }`}
                >
                  {category.categoryName}
                </button>
              );
            })}
          </nav>

          {/* Items for the selected category only */}
          <div className="flex-1 px-4">
            <h2 className="mb-1 font-display text-lg font-medium text-menu-muted">
              {activeCategory}
            </h2>
            <div>
              {activeItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}

      <CartBar onOpen={() => setCartOpen(true)} />
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </div>
  );
}
