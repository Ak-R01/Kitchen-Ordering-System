import { useCart } from '../context/CartContext';

export default function CartBar({ onOpen }) {
  const { itemCount, subtotal } = useCart();

  if (itemCount === 0) return null;

  return (
    <div className="safe-bottom fixed inset-x-0 bottom-0 border-t border-menu-border bg-menu-bg/95 px-4 pb-4 pt-3 backdrop-blur">
      <button
        onClick={onOpen}
        className="flex w-full items-center justify-between rounded-xl bg-accent px-5 py-3.5 text-white transition hover:bg-accent-hover"
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25 text-xs">
            {itemCount}
          </span>
          View cart
        </span>
        <span className="font-semibold">${subtotal.toFixed(2)}</span>
      </button>
    </div>
  );
}
