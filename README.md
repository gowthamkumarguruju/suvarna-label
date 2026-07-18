# Suvarna Label Starter

First implementation slice for a small women's clothing business in India.

## Included

- Admin dashboard
- Guided phone-order wizard
- Article-specific measurements
- Pricing, advance payment and balance calculation
- Delivery, photography, AI image and publishing choices
- Order list
- Raw-material inventory overview
- Media and publishing pipeline
- Simple customer storefront
- PostgreSQL/Prisma domain schema

## Routes

- `/admin` — operations dashboard
- `/admin/orders` — order list
- `/admin/orders/new` — guided phone-order flow
- `/admin/inventory` — raw material inventory
- `/admin/media` — images, AI review, customer approval and publishing
- `/shop` — first public storefront concept

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:3000`.

The UI works with sample data. The order wizard temporarily saves created
orders to browser `localStorage`.

## Connect PostgreSQL

1. Create a PostgreSQL database.
2. Update `DATABASE_URL` in `.env`.
3. Run:

```bash
npm run db:generate
npm run db:push
```

## Recommended next implementation

1. Add admin authentication and role permissions.
2. Add Prisma API/service functions for customers and orders.
3. Search customer by Indian mobile number.
4. Persist measurement profiles and immutable order snapshots.
5. Reserve raw material when an order is confirmed.
6. Add product/media upload storage.
7. Add payment-link and webhook integration.
8. Add shipping provider integration.
9. Add WhatsApp customer updates.
10. Add AI image generation only behind admin review and consent controls.

## Repository integration

Copy these files into the `suvarna-label` repository, or replace its initial
scaffold if the repository is empty. Review dependency versions if that
repository already has a package manager lockfile.
