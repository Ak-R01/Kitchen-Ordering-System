# Restaurant Ordering & Kitchen Display System

A full-stack restaurant platform: customers order from their table by scanning a QR code, orders appear instantly on a live kitchen display, and staff manage the menu, tables, and accounts from an admin dashboard.

Built as a learning project to go deep on Spring Boot, real-time systems, and production-grade backend practices (JWT auth, WebSocket-level security, versioned schema migrations) alongside a multi-app React frontend.

## What it does

- **Customers** scan a QR code at their table, browse the menu, and place an order — no login, no app download.
- **Kitchen staff** see new orders the instant they're placed, on a live-updating display, and move them through `Placed → Preparing → Ready → Served`.
- **Admins** manage tables (and their QR codes), the menu, staff accounts, and can review full order history.

## Architecture

Three independent React applications, all talking to one Spring Boot backend:

```
┌────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  customer-app    │     │  staff-kds-app     │     │  admin-app        │
│  (React)          │     │  (React)            │     │  (React)          │
│  QR ordering      │     │  Kitchen display    │     │  Tables, menu,    │
│  no login          │     │  live order feed    │     │  staff, history   │
└────────┬─────────┘     └─────────┬──────────┘     └────────┬─────────┘
         │  REST                    │  REST + WebSocket        │  REST
         └────────────────────────┬────────────────────────────┘
                                    │
                          ┌─────────────────┐
                          │   backend          │
                          │   Spring Boot       │
                          │   REST + WebSocket   │
                          │   Spring Security    │
                          └────────┬──────────┘
                                    │
                          ┌─────────────────┐
                          │   PostgreSQL       │
                          │   (Flyway-managed)  │
                          └─────────────────┘
```

Orders placed via REST are broadcast to the kitchen display in real time over a WebSocket/STOMP topic — no polling.

## Tech stack

**Backend:** Java 21, Spring Boot, Spring Data JPA, Spring Security, JWT, WebSocket/STOMP, PostgreSQL, Flyway, Maven

**Frontend (×3):** React, Vite, Tailwind CSS, React Router, `@stomp/stompjs` (kitchen display), `qrcode` (admin app)

## Key design decisions

- **Table identity uses opaque random tokens, not sequential IDs** — QR codes encode a UUID, not a guessable table number, so the URL can't be edited to spoof another table's orders.
- **Order line items snapshot their name and price at order time** — editing the menu later never changes what a historical order shows it charged.
- **The WebSocket connection itself requires a valid JWT on the STOMP `CONNECT` frame** — not just the REST endpoints — so the live kitchen feed can't be subscribed to anonymously.
- **Schema is managed with Flyway migrations**, not Hibernate auto-DDL — every schema change is an explicit, version-controlled SQL file.

## Project structure

```
restaurant-ordering/
├── backend/          Spring Boot API (REST + WebSocket)
├── customer-app/      Table ordering app (React)
├── staff-kds-app/       Kitchen display (React)
└── admin-app/          Menu, table, and staff management (React)
```

## Getting started

### Prerequisites
- Java 21+, Maven
- Node.js 18+
- PostgreSQL

### 1. Backend

```bash
cd backend
# create the database
psql -U postgres -c "CREATE DATABASE restaurant_db;"

# copy the properties template and fill in your DB credentials + a real JWT secret
cp src/main/resources/application.properties.example src/main/resources/application.properties

mvn clean install
mvn spring-boot:run
```
Runs on `http://localhost:8080`. Schema is created automatically by Flyway on first startup. A default admin account (`admin` / `changeme123`) is seeded — log in once and change the password immediately via the admin app.

### 2. Frontends

Each app is a separate Vite project — repeat for `customer-app`, `staff-kds-app`, and `admin-app`:

```bash
cd <app-name>
npm install
cp .env.example .env
npm run dev
```

| App | Default port |
|---|---|
| customer-app | 5173 |
| staff-kds-app | 5174 |
| admin-app | 5175 |

### Getting a table QR code
Log into the admin app (seeded admin account) → **Tables** → create a table → **QR code** to view/download it. Scan it, or visit the customer app manually at `/order?t=<token>` using the token shown in the admin dashboard.

## Security notes

- Change the seeded admin password immediately after first login (**Change password**, in either staff app).
- Generate a real random `jwt.secret` before running anywhere beyond localhost — never use the placeholder value.
- Never commit `application.properties` or any `.env` file with real credentials — see `.gitignore`.

