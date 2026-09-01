# Kitchen Display System (KDS)

The kitchen-facing screen: shows live orders and lets staff advance them
through PLACED → PREPARING → READY → SERVED.

## Setup

```bash
npm install
cp .env.example .env   # adjust VITE_API_URL / VITE_WS_URL if your backend isn't on localhost:8080
npm run dev
```

Opens at http://localhost:5174

## Notes

- Requires the Spring Boot backend running and a staff account seeded
  (the backend's DataSeeder creates one on first run: admin / changeme123).
- Orders are fetched once via REST on load (covers anything missed while
  disconnected), then kept live via a WebSocket subscription to /topic/kitchen.
- The elapsed-time badge on each order shifts color: teal under 8 minutes,
  amber 8–15 minutes, red past 15 - tune these thresholds in
  ElapsedTimeBadge.jsx (`urgencyClasses`) to match real kitchen pace.
