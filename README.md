# Azima web portal

Next.js (App Router) + shadcn/ui portal for **caterers** (`/provider`) and **administrators** (`/admin`). Every screen loads and saves through the Azima Django API.

## Run it

```bash
cp .env.example .env.local        # NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
npm install
npm run dev                       # http://localhost:3000
```

Start the API from the backend repo (`python manage.py runserver`) and, for demo data, run `python manage.py seed_demo --reset`. Demo logins (password `Demo12345!`): `admin@demo.azima.test`, `kitchen.yummy@demo.azima.test`.

## How it is organised

- `lib/api/*` — typed API client (`client.ts` handles auth headers, token refresh and error shapes) and one module per area (`auth`, `admin`, `provider`, `notifications`, `support`).
- `hooks/use-api.ts` — small data hook (`loading`, `error`, `reload`); `components/form-error.tsx` renders request failures.
- `components/auth-provider.tsx` / `auth-guard.tsx` — session, role-based redirects, provider approval gate.
- `lib/format.ts`, `lib/order-meta.ts` — display helpers shared by admin and provider screens.

## Scripts

`npm run typecheck` · `npm run lint` · `npm run build`
