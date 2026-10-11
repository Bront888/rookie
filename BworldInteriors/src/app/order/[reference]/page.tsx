import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { verifyTransaction } from "@/lib/paystack";
import { markOrderFailed, markOrderPaid, type OrderItem } from "@/lib/orders";
import ClearCartOnPaid from "@/components/ClearCartOnPaid";
import { naira } from "@/lib/config";
import { whatsappEnabled, whatsappLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your order", robots: { index: false } };

type Params = Promise<{ reference: string }>;

export default async function OrderPage({ params }: { params: Params }) {
  const { reference } = await params;
  let order = await prisma.order.findUnique({ where: { reference } });
  if (!order) notFound();

  // Customer just came back from Paystack: confirm with Paystack directly
  // (the webhook may arrive a moment later, or not at all on localhost).
  if (order.status === "PENDING") {
    try {
      const tx = await verifyTransaction(reference);
      if (tx.status === "success") {
        order = (await markOrderPaid(reference, tx.amount)) ?? order;
      } else if (tx.status === "failed" || tx.status === "reversed") {
        await markOrderFailed(reference);
        order = (await prisma.order.findUnique({ where: { reference } })) ?? order;
      }
    } catch (err) {
      console.error("[order] verify failed", err);
    }
  }

  const items = order.items as unknown as OrderItem[];
  const paid = order.status === "PAID";
  const failed = order.status === "FAILED";

  const help = `Hello Bworld Interiors, my order reference is ${order.reference}.`;

  return (
    <section className="section">
      {paid && <ClearCartOnPaid />}

      <div className="glass panel order-card">
        <span className={`status status-${order.status.toLowerCase()}`}>
          {paid ? "Payment received" : failed ? "Payment not completed" : "Awaiting payment confirmation"}
        </span>
        <h1 className="display">
          {paid ? `Thank you, ${order.customerName.split(" ")[0]}!` : failed ? "That payment didn't go through" : "Almost there…"}
        </h1>
        <p className="lead">
          {paid
            ? "Your order is confirmed. We'll contact you shortly to arrange delivery."
            : failed
              ? "No money was taken for this order. You can try again from your cart."
              : "We haven't received confirmation yet. Refresh in a moment; if you were charged, message us with your reference."}
        </p>

        <p className="muted small">
          Reference: <b>{order.reference}</b>
        </p>

        <ul className="mini-lines">
          {items.map((i) => (
            <li key={`${i.slug}-${i.size}-${i.color}`}>
              <span>
                {i.qty} × {i.name}
                {(i.size || i.color) && <small> ({[i.size, i.color].filter(Boolean).join(", ")})</small>}
              </span>
              <b>{naira(i.unitPrice * i.qty)}</b>
            </li>
          ))}
        </ul>
        <dl className="totals">
          <div><dt>Items</dt><dd>{naira(order.subtotal)}</dd></div>
          <div><dt>Delivery</dt><dd>{order.deliveryFee === 0 ? "Free" : naira(order.deliveryFee)}</dd></div>
          <div className="grand"><dt>Total</dt><dd>{naira(order.total)}</dd></div>
        </dl>

        <p className="muted small">
          Deliver to: {order.address}, {order.city}, {order.state}
        </p>

        <div className="hero-actions">
          <Link href={failed ? "/cart" : "/shop"} className="btn btn-primary">
            {failed ? "Back to cart" : "Continue shopping"}
          </Link>
          {whatsappEnabled && (
            <a className="btn btn-ghost" href={whatsappLink(help)} target="_blank" rel="noopener noreferrer">
              Message us on WhatsApp
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
