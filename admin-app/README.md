# Restaurant Admin

Back-office app for managing tables (and their QR codes) and the menu.

## Setup

```bash
npm install
cp .env.example .env   # set VITE_CUSTOMER_APP_URL once the customer app is deployed
npm run dev
```

Opens at http://localhost:5175

## Notes

- Uses the same `/api/admin/login` endpoint as any staff login; the client
  additionally checks the returned role is `ADMIN` and rejects kitchen-only
  accounts (the backend also enforces this server-side on every `/api/admin/**`
  call, so this is a UX nicety, not the real security boundary).
- QR codes are generated entirely client-side with the `qrcode` package - no
  external API calls, so table tokens never leave your machine during generation.
- Rotating a table's token immediately invalidates any printed QR code for
  that table - reprint after rotating.
