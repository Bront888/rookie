"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { deliveryFor, naira, NIGERIAN_STATES } from "@/lib/config";

export default function CheckoutForm() {
  const { lines, ready, subtotal } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const delivery = deliveryFor(subtotal);
  const total = subtotal + delivery;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting || lines.length === 0) return;
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const get = (k: string) => String(form.get(k) ?? "").trim();

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: get("name"),
            email: get("email"),
            phone: get("phone"),
            address: get("address"),
            city: get("city"),
            state: get("state"),
            note: get("note"),
          },
          items: lines.map((l) => ({ slug: l.slug, size: l.size ?? null, color: l.color ?? null, qty: l.qty })),
        }),
      });
      const data = (await res.json()) as { authorizationUrl?: string; error?: string };
      if (!res.ok || !data.authorizationUrl) {
        throw new Error(data.error || "We couldn't start your payment. Please try again.");
      }
      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (!ready) return <div className="glass panel empty">Loading…</div>;

  if (lines.length === 0) {
    return (
      <div className="glass panel empty">
        <h2 className="display">Nothing to check out yet</h2>
        <Link className="btn btn-primary" href="/shop">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <form className="glass panel form" onSubmit={onSubmit}>
        <h2 className="summary-title">Delivery details</h2>

        <label className="field">
          <span>Full name</span>
          <input name="name" required autoComplete="name" minLength={2} maxLength={100} />
        </label>

        <div className="field-row">
          <label className="field">
            <span>Email</span>
            <input name="email" type="email" required autoComplete="email" maxLength={120} />
          </label>
          <label className="field">
            <span>Phone (WhatsApp preferred)</span>
            <input name="phone" type="tel" required autoComplete="tel" minLength={7} maxLength={20} placeholder="0801 234 5678" />
          </label>
        </div>

        <label className="field">
          <span>Delivery address</span>
          <input name="address" required autoComplete="street-address" minLength={5} maxLength={200} />
        </label>

        <div className="field-row">
          <label className="field">
            <span>City / Area</span>
            <input name="city" required autoComplete="address-level2" maxLength={80} />
          </label>
          <label className="field">
            <span>State</span>
            <select name="state" required defaultValue="">
              <option value="" disabled>
                Select state
              </option>
              {NIGERIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="field">
          <span>Note (optional)</span>
          <textarea name="note" rows={3} maxLength={500} placeholder="Landmark, preferred delivery time…" />
        </label>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? "Redirecting to Paystack…" : `Pay ${naira(total)}`}
        </button>
        <p className="muted small">You'll be taken to Paystack's secure page to pay by card, bank transfer or USSD.</p>
      </form>

      <aside className="glass panel summary">
        <h2 className="summary-title">Your order</h2>
        <ul className="mini-lines">
          {lines.map((l) => (
            <li key={l.key}>
              <span>
                {l.qty} × {l.name}
                {(l.size || l.color) && <small> ({[l.size, l.color].filter(Boolean).join(", ")})</small>}
              </span>
              <b>{naira(l.unitPrice * l.qty)}</b>
            </li>
          ))}
        </ul>
        <dl className="totals">
          <div><dt>Items</dt><dd>{naira(subtotal)}</dd></div>
          <div><dt>Delivery</dt><dd>{delivery === 0 ? "Free" : naira(delivery)}</dd></div>
          <div className="grand"><dt>Total</dt><dd>{naira(total)}</dd></div>
        </dl>
        <Link href="/cart" className="link-btn">
          ← Edit cart
        </Link>
      </aside>
    </div>
  );
}
