# OrganicSMM

Organic social media growth platform with USDT BEP20 deposit system.

## Tech Stack

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions + Realtime)
- **Payments**: USDT BEP20 on BNB Smart Chain

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

## Features

- User auth (signup/login)
- SMM services ordering
- Organic engagement orders
- Wallet with USDT BEP20 deposits (verified on-chain via BSC RPC)
- Transaction history
- Admin panel (services, users, orders, settings)
- Subscription system
- Multi-currency support

## Deploying Edge Functions

```bash
export SUPABASE_ACCESS_TOKEN=your_token
npx supabase functions deploy verify-usdt-deposit --project-ref your_project_id --no-verify-jwt
```

## Build for Production

```bash
npm run build
```
