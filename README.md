# Suvarna Label

Order, inventory and payment operations for a small women's clothing
business in India — a customer-facing storefront plus an admin portal, backed
by a GraphQL API and PostgreSQL/Prisma.

## Included

- Admin dashboard (open orders, pipeline value, low stock, flagged payments)
- Customer list
- Guided phone-order wizard with article-specific measurements, pricing and
  advance/balance calculation
- Order list
- Product inventory (stock on hand, reorder flag)
- Payments — history, manual reconciliation, and a flagged-payments view for
  orders that need follow-up
- Simple public storefront
- GraphQL API over a PostgreSQL/Prisma domain schema
- A standalone script to check for payments needing attention, meant to be
  driven by a scheduled/looped agent

## Routes

- `/admin` — operations dashboard
- `/admin/customers` — customer list
- `/admin/orders` — order list
- `/admin/orders/new` — guided phone-order wizard
- `/admin/inventory` — product inventory
- `/admin/payments` — payment history and flagged payments
- `/shop` — public storefront
- `/api/graphql` — GraphQL API (graphql-yoga)

## Run locally

```bash
npm install
cp .env.example .env   # set DATABASE_URL to a local PostgreSQL instance
npm run db:generate
npm run db:push
npm run dev
```

Open `http://localhost:3000`.

All pages read and write through the GraphQL API — there's no mock data or
`localStorage` fallback. You'll need at least one `Product` and one
`Customer`/`Order` in the database for the admin pages to show anything (add
them via `/admin/orders/new`, `/admin/inventory`, or `npx prisma studio`).

## Payment monitoring

```bash
npm run check:payments
```

Prints any orders needing attention (overdue balance, stale unpaid orders,
overdue COD). The same logic backs the `flaggedPayments` GraphQL query used
by `/admin/payments`. To run it on a schedule, drive it with a recurring
agent, e.g.:

```
/loop 30m run `npm run check:payments` and tell me about anything flagged
```

## Database

Schema lives in `prisma/schema.prisma`. After changing it:

```bash
npm run db:generate   # regenerate the Prisma client
npm run db:push       # sync a local/dev database (no migration history)
```

For a tracked migration instead of `db push`, use `npx prisma migrate dev`.

## Recommended next implementation

1. Add admin authentication and role permissions.
2. Search customer by Indian mobile number from the order wizard (currently
   always creates/updates on submit).
3. Persist measurement profiles separately from per-order snapshots.
4. Media and publishing pipeline (photography, AI review, customer approval).
5. Reserve raw material when an order is confirmed.
6. Add payment-link and webhook integration (payments are currently recorded
   manually).
7. Add shipping provider integration.
8. Add WhatsApp customer updates.
