# Bworld Interiors

Online store for bedding, curtains, bath and décor, built with **Next.js (App Router) + TypeScript**,
**Postgres (Prisma)** and **Paystack** payments. Customers can pay online *or* send their order on **WhatsApp**.

Categories: Bed Toppers · Pillows · Bedsheets · Duvets · Fur Duvets · Corduroy Duvets · Curtains · Towels ·
Bathing Robes · Decoration Flowers · Decoration Novels.

## Run it locally

```bash
cd BworldInteriors
cp .env.example .env        # then fill in the values (see below)
npm install
npx prisma db push          # creates the Orders table in your Postgres database
npm run dev                 # http://localhost:3000
```

### Environment variables (`.env`)

| Variable | What it is |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (Neon, Supabase, Railway or local Postgres all work). |
| `PAYSTACK_SECRET_KEY` | From the Paystack dashboard → Settings → API Keys. Use `sk_test_…` while testing. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Your WhatsApp number, country code first, digits only (e.g. `2348012345678`). Leave empty to hide WhatsApp buttons. |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (used for the Paystack return link). |

## How ordering works

1. **Online:** cart → checkout form → `POST /api/checkout` saves a `PENDING` order (prices are recalculated on the
   server from the catalogue, never trusted from the browser) and starts a Paystack transaction → customer pays on
   Paystack → returns to `/order/<reference>`, where we verify the payment with Paystack and mark the order `PAID`.
2. **Webhook (backup):** in the Paystack dashboard set the webhook URL to
   `https://YOUR-DOMAIN/api/paystack/webhook`. It verifies Paystack's signature and marks the order `PAID`,
   even if the customer closes the tab before returning.
3. **WhatsApp:** every product page and the cart have an "Order on WhatsApp" button that opens a pre-filled message
   (items, sizes, colours, total).

Orders live in the `Order` table. View them with `npx prisma studio`.

## Edit the catalogue

Everything is in [`src/lib/products.ts`](src/lib/products.ts): categories, products, sizes, colours and prices.

> **All prices, sizes, colours and descriptions are placeholders: replace them with your real ones.**

Product images: put files in `public/products/` and set `image: "/products/your-file.jpg"` on the product. Until then,
each product shows a glass-style illustration tile in its colour.

Delivery fee and free-delivery threshold are in [`src/lib/config.ts`](src/lib/config.ts).

## Going live checklist

- Swap to your **live** Paystack key and register the webhook URL.
- Set `NEXT_PUBLIC_SITE_URL` to your real domain.
- Add real product photos and confirm prices/delivery fees.
- Deploy (Vercel works well) with the same environment variables.
