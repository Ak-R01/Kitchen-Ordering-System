# Customer Ordering App

The table-side ordering experience, opened via a QR code scan.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Opens at http://localhost:5173

Since there's no login, you can't just visit the homepage - you need a table
token in the URL, e.g.:

```
http://localhost:5173/order?t=PASTE_A_REAL_TABLE_TOKEN
```

Grab a real token from the admin app's Tables page (or straight from
`GET /api/admin/tables`).

## Notes

- No login - the table token in the URL is the entire session, exactly as
  planned. An invalid/missing token shows a friendly error screen instead
  of a blank page or a crash.
- Cart is shared per table (not per person) and persisted to localStorage
  keyed by the table token, so a refresh mid-browsing doesn't lose it.
- Order submission goes straight to `POST /api/orders` - no auth header,
  since the backend validates the table token server-side.
- The confirmation screen reads the order from React Router navigation state
  (passed right after a successful order) - if someone bookmarks or refreshes
  that page directly, it shows a graceful fallback instead of erroring.
