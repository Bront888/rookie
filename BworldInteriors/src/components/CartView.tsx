"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import ProductVisual from "./ProductVisual";
import { getProduct } from "@/lib/products";
import { deliveryFor, naira, FREE_DELIVERY_OVER } from "@/lib/config";
import { whatsappEnabled, whatsappLink, WHATSAPP_SLOW_NOTE } from "@/lib/whatsapp";

export default function CartView() {
  const { lines, ready, subtotal, setQty, remove } = useCart();
  const delivery = deliveryFor(subtotal);
  const total = subtotal + delivery;

  if (!ready) return <div className="glass panel empty">Loading your cart…</div>;

  if (lines.length === 0) {
    return (
      <div className="glass panel empty">
        <h2 className="display">Your cart is empty</h2>
        <p className="muted">Browse the collection and add something lovely.</p>
        <Link className="btn btn-primary" href="/shop">
          Start shopping
        </Link>
      </div>
    );
  }

  const waMessage = [
    "Hello Bworld Interiors, I'd like to order:",
    ...lines.map(
      (l) => `• ${l.name}${l.size ? ` (${l.size})` : ""}${l.color ? `, ${l.color}` : ""} × ${l.qty}: ${naira(l.unitPrice * l.qty)}`,
    ),
    "",
    `Items: ${naira(subtotal)}`,
    `Delivery: ${delivery === 0 ? "Free" : naira(delivery)} (to be confirmed for my location)`,
    `Total: ${naira(total)}`,
    "",
    "Please confirm availability, delivery and payment details.",
  ].join("\n");

  return (
    <div className="cart-layout">
      <ul className="cart-lines">
        {lines.map((l) => {
          const product = getProduct(l.slug);
          return (
            <li key={l.key} className="glass cart-line">
              <ProductVisual
                category={product?.category ?? ""}
                tones={product?.tones}
                image={product?.image}
                alt={l.name}
                tint={product?.colors?.find((c) => c.name === l.color)?.hex}
                className="cart-thumb"
              />
              <div className="cart-info">
                <Link href={`/product/${l.slug}`} className="cart-name">
                  {l.name}
                </Link>
                <p className="muted small">{[l.size, l.color].filter(Boolean).join(" · ")}</p>
                <button type="button" className="link-btn" onClick={() => remove(l.key)}>
                  Remove
                </button>
              </div>
              <div className="stepper" role="group" aria-label={`Quantity for ${l.name}`}>
                <button type="button" onClick={() => setQty(l.key, l.qty - 1)} aria-label="Decrease quantity">−</button>
                <span>{l.qty}</span>
                <button type="button" onClick={() => setQty(l.key, l.qty + 1)} aria-label="Increase quantity">+</button>
              </div>
              <p className="line-total">{naira(l.unitPrice * l.qty)}</p>
            </li>
          );
        })}
      </ul>

      <aside className="glass panel summary">
        <h2 className="summary-title">Order summary</h2>
        <dl className="totals">
          <div><dt>Items</dt><dd>{naira(subtotal)}</dd></div>
          <div><dt>Delivery</dt><dd>{delivery === 0 ? "Free" : naira(delivery)}</dd></div>
          <div className="grand"><dt>Total</dt><dd>{naira(total)}</dd></div>
        </dl>
        {FREE_DELIVERY_OVER > 0 && delivery > 0 && (
          <p className="notice">Add {naira(FREE_DELIVERY_OVER - subtotal)} more for free delivery.</p>
        )}
        <p className="order-choice-title">How would you like to order?</p>
        <Link href="/checkout" className="btn btn-primary btn-block">
          Order online
        </Link>
        <p className="muted small">Pay by card, transfer or USSD through Paystack. Confirmed instantly.</p>
        {whatsappEnabled && (
          <>
            <a className="btn btn-ghost btn-block" href={whatsappLink(waMessage)} target="_blank" rel="noopener noreferrer">
              Order on WhatsApp
            </a>
            <p className="muted small">{WHATSAPP_SLOW_NOTE}</p>
          </>
        )}
      </aside>
    </div>
  );
}
