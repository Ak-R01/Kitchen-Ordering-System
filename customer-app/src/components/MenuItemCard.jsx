import { useCart } from '../context/CartContext';

export default function MenuItemCard({ item }) {
  const { items, addItem, decrementItem } = useCart();
  const quantity = items[item.id]?.quantity ?? 0;

  return (
    <div className="flex gap-4 border-b border-menu-border py-5 last:border-none">
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
        />
      )}

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-medium leading-snug">{item.name}</h3>
          <span className="whitespace-nowrap font-body text-sm font-semibold text-menu-text">
            ${item.price.toFixed(2)}
          </span>
        </div>

        {item.description && (
          <p className="mt-1 text-sm text-menu-muted">{item.description}</p>
        )}

        <div className="mt-3">
          {quantity === 0 ? (
            <button
              onClick={() => addItem(item)}
              className="rounded-full border border-accent px-4 py-1.5 text-sm font-semibold text-accent transition hover:bg-accent-light"
            >
              Add
            </button>
          ) : (
            <div className="flex w-fit items-center gap-3 rounded-full bg-accent px-3 py-1.5">
              <button
                onClick={() => decrementItem(item.id)}
                className="text-lg font-semibold leading-none text-white"
                aria-label={`Remove one ${item.name}`}
              >
                −
              </button>
              <span className="min-w-[1ch] text-center text-sm font-semibold text-white">
                {quantity}
              </span>
              <button
                onClick={() => addItem(item)}
                className="text-lg font-semibold leading-none text-white"
                aria-label={`Add one more ${item.name}`}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
