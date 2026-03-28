# Alafia monorepo

This repository hosts **Alafia** — a health platform oriented around patient-owned records, consent, and multi-role workflows (patient, clinician, lab, pharmacy, admin). Code is split into a **React SPA** and a **Node/Express API**.

---

## Table of contents

1. [Repository layout](#repository-layout)
2. [Tech stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Web app (`apps/web`)](#web-app-appsweb)
5. [API (`apps/apis`)](#api-appsapis)
6. [Running everything locally](#running-everything-locally)
7. [Environment variables](#environment-variables)
8. [Frontend routes](#frontend-routes)
9. [HTTP API overview](#http-api-overview)
10. [Deploying the web app (Vercel)](#deploying-the-web-app-vercel)
11. [Troubleshooting](#troubleshooting)

---

## Repository layout

```
alafia-monorepo/
├── apps/
│   ├── web/                 # Vite + React + TypeScript (SPA)
│   │   ├── index.html       # Vite HTML entry
│   │   ├── public/          # Static files (favicon, manifest, robots, CRA-style index if needed)
│   │   ├── src/
│   │   │   ├── index.tsx    # React bootstrap + React Query provider
│   │   │   └── app/         # Routes, pages, components, styles, API client, stores
│   │   ├── vite.config.ts
│   │   └── tailwind.config.cjs
│   └── apis/                # Express API + PostgreSQL
│       ├── database/        # schema, migrations, seed
│       ├── postman/         # Postman collection for the API
│       ├── src/
│       │   ├── server.js    # HTTP server entry
│       │   ├── app.js       # Express app + `/api` mount
│       │   ├── routes/      # Route modules
│       │   ├── controllers/
│       │   ├── services/
│       │   ├── models/
│       │   ├── middleware/
│       │   └── config/      # e.g. database pool
│       └── tests/
└── README.md
```

---

## Tech stack

### `apps/web`

| Area | Choice |
|------|--------|
| Runtime / build | [Vite](https://vitejs.dev/) 6, TypeScript |
| UI | React 18 |
| Styling | Tailwind CSS v3, PostCSS (configured inside `vite.config.ts`) |
| Routing | React Router 7 (`createBrowserRouter`) |
| Server state | TanStack React Query v4 |
| Client state | Zustand |
| HTTP | Axios |
| Validation (client) | Zod |
| Icons | Lucide React, React Icons |

Dev server defaults to **port 3000** (`vite.config.ts`).

### `apps/apis`

| Area | Choice |
|------|--------|
| Runtime | Node.js |
| Framework | Express 4 |
| Database | PostgreSQL via `pg` (connection pool) |
| Auth | JWT (`jsonwebtoken`), bcrypt for passwords |
| Validation | Zod |
| Email | SendGrid (`@sendgrid/mail`) |
| Tests | Jest + Supertest |

Default **port 5000** (`PORT` env).

---

## Prerequisites

- **Node.js** 18 or newer (20 LTS is a good default).
- **PostgreSQL** for full API behavior (the server can start without `DATABASE_URL`, but DB-backed features need it).
- **npm** (lockfiles are committed under each app where applicable).

---

## Web app (`apps/web`)

### Commands

```bash
cd apps/web
npm install
npm run dev          # Vite dev server (default http://localhost:3000)
npm run start        # same as dev (alias)
npm run build        # tsc --noEmit && vite build → output in dist/
npm run preview      # locally preview the production build
npm run typecheck    # TypeScript check only (no emit)
```

### Entry points and assets

- **Vite entry:** `apps/web/index.html` → `/src/index.tsx`.
- **Global styles:** `src/app/styles/theme.css`, `tailwind.css`, `index.css` (import order matters for Tailwind layers).
- **Static files:** `public/` is copied to the site root on build (e.g. `manifest.json`, `robots.txt`).

### API base URL (important)

The Axios instance lives in `src/app/api/axios.ts`. It currently uses a **placeholder** `baseURL`. For local development, point it at your API (e.g. `http://localhost:5000/api`) or introduce a `VITE_*` env variable and use `import.meta.env` in that file so dev/staging/production can differ without editing source.

---

## API (`apps/apis`)

### Commands

```bash
cd apps/apis
npm install
npm run dev          # nodemon (auto-restart on changes)
npm start            # node src/server.js
npm test             # Jest (run in band)
npm run db:migrate   # node database/run-migrations.js
npm run db:seed      # node database/seed.js
npm run check        # quick load check of the Express app
```

### Behavior notes

- On boot, the server calls `testDbConnection()`. If `DATABASE_URL` is unset, it **warns and skips** the DB check so you can still bring the process up.
- All HTTP routes exposed by `app.js` are under the **`/api`** prefix (see next section).

### Postman

An API collection is available at `apps/apis/postman/alafia-backend.postman_collection.json` (import into Postman or a compatible client).

---

## Running everything locally

1. Start PostgreSQL and create a database; set `DATABASE_URL` in `apps/apis/.env`.
2. From `apps/apis`, run migrations (and seed if you use it): `npm run db:migrate` / `npm run db:seed`.
3. Start the API: `npm run dev` → e.g. `http://localhost:5000`.
4. Point the web app’s Axios `baseURL` at `http://localhost:5000/api` (or your chosen host/port).
5. From `apps/web`, run `npm run dev` → `http://localhost:3000`.

If the browser shows CORS errors, configure CORS on the Express app (not enabled in the snippet above) for your frontend origin during development.

---

## Environment variables

### API — `apps/apis/.env` (typical)

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | For DB features | PostgreSQL connection string |
| `PORT` | No | Server port (default `5000`) |
| `NODE_ENV` | No | `production` enables SSL mode hint for the pool |
| `JWT_SECRET` | Production | Signing key for JWTs (defaults to a dev-only value if unset) |
| `JWT_EXPIRES_IN` | No | Token lifetime (default `7d`) |
| `APP_BASE_URL` | No | Base URL used in invite links (default `http://localhost:5000`) |
| `SENDGRID_API_KEY` | For email | SendGrid API key |
| `SENDGRID_FROM_EMAIL` | For email | Verified sender address |

Create `apps/apis/.env` yourself; it is gitignored. Never commit secrets.

### Web — `apps/web/.env` (optional, recommended pattern)

Vite only exposes variables prefixed with `VITE_`. Example:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

You would then read `import.meta.env.VITE_API_BASE_URL` in `axios.ts` (after you wire it up).

---

## Frontend routes

Defined in `apps/web/src/app/routes.tsx` (React Router).

| Path | Screen |
|------|--------|
| `/` | Landing |
| `/register` | Register |
| `/login`, `/auth/login` | Login |
| `/forgot-password` | Forgot password |
| `/reset-password-otp` | OTP step for reset |
| `/reset-password` | New password |
| `/dashboard` | Redirects to `/dashboard-router` |
| `/dashboard-router` | Role router |
| `/dashboard/patient` | Patient dashboard |
| `/dashboard/doctor` | Doctor dashboard |
| `/dashboard/nurse` | Nurse dashboard |
| `/dashboard/lab` | Lab dashboard |
| `/dashboard/pharmacy` | Pharmacy dashboard |
| `/dashboard/admin` | Admin dashboard |
| `*` (unknown) | Falls through to **Login** |

> **SPA hosting:** Any static host must serve `index.html` for deep links (e.g. `/dashboard/patient`). Configure rewrites on Vercel, Netlify, or your CDN accordingly.

---

## HTTP API overview

All routes below are prefixed with **`/api`** (e.g. `GET /api/health/...`).

| Mount path | Area |
|------------|------|
| `/api/health` | Health checks |
| `/api/auth` | Authentication |
| `/api/hospitals` | Hospitals / invites |
| `/api/patients` | Patients |
| `/api/subscriptions` | Subscriptions |
| `/api/did` | DID / wallet-related |
| `/api/consents` | Consents |
| `/api/integrations` | Integrations |
| `/api/admin` | Admin |
| `/api/doctor` | Doctor |
| `/api/lab` | Lab |

See `apps/apis/src/routes/*.routes.js` for exact methods and paths.

---

## Deploying the web app (Vercel)

1. Connect this Git repository to Vercel.
2. Set **Root Directory** to `apps/web`.
3. Build settings:

   | Field | Value |
   |--------|--------|
   | Install Command | `npm install` (or default) |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |

4. Add **environment variables** in the Vercel project for any `VITE_*` values your build expects.
5. Add a **single-page app rewrite** so client routes work, e.g. `apps/web/vercel.json`:

   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

Deploy the API separately (Railway, Render, Fly.io, ECS, etc.) and set the production API URL in the web app’s Axios config or `VITE_API_BASE_URL`.

---

## Troubleshooting

| Issue | What to check |
|--------|----------------|
| `Can't resolve ... index.html` / webpack errors | You may be on an old **Create React App** install. This repo’s web app is **Vite** — run `npm install` in `apps/web` and use `npm run dev`, not `react-scripts`. |
| `EACCES` / npm cache errors | Do not use `sudo npm install`. Fix ownership of `~/.npm` or use a project-local npm cache (see npm’s error message). |
| API starts but logs DB warning | Set `DATABASE_URL` and ensure PostgreSQL is reachable; run migrations. |
| CORS errors in the browser | Allow your frontend origin on the Express app for development. |
| 404 on refresh for `/dashboard/...` | Configure host rewrites to `index.html` (see Vercel section). |

---

For questions or changes to architecture, open an issue or internal design doc and keep this README in sync when you add apps, env vars, or major routes.
