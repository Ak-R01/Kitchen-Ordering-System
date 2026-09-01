import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

const CUSTOMER_APP_URL = import.meta.env.VITE_CUSTOMER_APP_URL;

export default function QrCodeModal({ table, onClose }) {
  const [dataUrl, setDataUrl] = useState(null);
  const orderUrl = `${CUSTOMER_APP_URL}/order?t=${table.publicToken}`;

  useEffect(() => {
    QRCode.toDataURL(orderUrl, { width: 320, margin: 2 }).then(setDataUrl);
  }, [orderUrl]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-admin-border bg-admin-surface p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-1 font-display text-lg font-semibold">{table.tableNumber}</h3>
        <p className="mb-4 text-xs text-admin-muted">Scan to open the ordering page</p>

        {dataUrl ? (
          <img src={dataUrl} alt={`QR code for ${table.tableNumber}`} className="mx-auto rounded-lg" />
        ) : (
          <div className="mx-auto flex h-[320px] w-[320px] items-center justify-center text-admin-muted">
            Generating…
          </div>
        )}

        <p className="mt-4 break-all rounded-lg bg-admin-surfaceMuted px-3 py-2 font-mono text-xs text-admin-muted">
          {orderUrl}
        </p>

        <div className="mt-4 flex gap-2">
          <a
            href={dataUrl}
            download={`${table.tableNumber.replace(/\s+/g, '-')}-qr.png`}
            className="flex-1 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
          >
            Download
          </a>
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-admin-border py-2.5 text-sm font-semibold text-admin-muted transition hover:bg-admin-surfaceMuted"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
