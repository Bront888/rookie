import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { initializeTransaction } from "@/lib/paystack";
import { markOrderFailed, type OrderItem } from "@/lib/orders";
import { getProduct, isValidColor, unitPriceFor } from "@/lib/products";
import { deliveryFor, NIGERIAN_STATES } from "@/lib/config";

export const dynamic = "force-dynamic";

type Body = {
  customer?: Record<string, unknown>;
  items?: { slug?: unknown; size?: unknown; color?: unknown; qty?: unknown }[];
};

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return bad("Invalid request.");
  }

  // ---- customer details
  const c = body.customer ?? {};
  const customer = {
    name: str(c.name, 100),
    email: str(c.email, 120).toLowerCase(),
    phone: str(c.phone, 20),
    address: str(c.address, 200),
    city: str(c.city, 80),
    state: str(c.state, 40),
    note: str(c.note, 500),
  };
  if (customer.name.length < 2) return bad("Please enter your full name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) return bad("Please enter a valid email address.");
  if (customer.phone.replace(/\D/g, "").length < 7) return bad("Please enter a valid phone number.");
  if (customer.address.length < 5) return bad("Please enter your delivery address.");
  if (!customer.city) return bad("Please enter your city or area.");
  if (!NIGERIAN_STATES.includes(customer.state)) return bad("Please select your state.");

  // ---- items: prices are ALWAYS recomputed on the server, never trusted from the browser
  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 40) {
    return bad("Your cart is empty.");
  }

  const items: OrderItem[] = [];
  for (const raw of body.items) {
    const product = typeof raw.slug === "string" ? getProduct(raw.slug) : undefined;
    const qty = Number(raw.qty);
    const size = typeof raw.size === "string" ? raw.size : null;
    const color = typeof raw.color === "string" ? raw.color : null;

    if (!product || !Number.isInteger(qty) || qty < 1 || qty > 20) {
      return bad("One of the items in your cart is no longer available. Please review your cart.");
    }
    const unitPrice = unitPriceFor(product, size);
    if (unitPrice === null || !isValidColor(product, color)) {
      return bad(`Please re-select the size/colour for "${product.name}".`);
    }
    items.push({ slug: product.slug, name: product.name, size, color, unitPrice, qty });
  }

  const subtotal = items.reduce((n, i) => n + i.unitPrice * i.qty, 0);
  const deliveryFee = deliveryFor(subtotal);
  const total = subtotal + deliveryFee;
  const reference = `BW-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString("hex").toUpperCase()}`;

  try {
    await prisma.order.create({
      data: {
        reference,
        customerName: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        note: customer.note || null,
        items: items as unknown as Prisma.InputJsonValue,
        subtotal,
        deliveryFee,
        total,
      },
    });
  } catch (err) {
    console.error("[checkout] could not save order", err);
    return bad("We couldn't save your order. Please try again shortly.", 500);
  }

  try {
    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
    const tx = await initializeTransaction({
      email: customer.email,
      amountKobo: total * 100,
      reference,
      callbackUrl: `${origin.replace(/\/$/, "")}/order/${reference}`,
      metadata: { customer: customer.name, phone: customer.phone },
    });
    return NextResponse.json({ authorizationUrl: tx.authorization_url, reference });
  } catch (err) {
    console.error("[checkout] paystack init failed", err);
    await markOrderFailed(reference);
    return bad("We couldn't start your payment. Please try again, or order on WhatsApp.", 502);
  }
}
