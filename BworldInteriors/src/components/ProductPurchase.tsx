"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, lineKey } from "./CartProvider";
import ProductVisual from "./ProductVisual";
import { naira } from "@/lib/config";
import { unitPriceFor, type Product } from "@/lib/products";
import { whatsappEnabled, whatsappLink, WHATSAPP_SLOW_NOTE } from "@/lib/whatsapp";

export default function ProductPurchase({ product }: { product: Product }) {
  const router = useRouter();
  const { add } = useCart();
  const [size, setSize] = useState<string | null>(product.sizes?.[0]?.label ?? null);
  const [color, setColor] = useState<string | null>(product.colors?.[0]?.name ?? null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const unitPrice = unitPriceFor(product, size) ?? product.price;
  const selectedColor = product.colors?.find((c) => c.name === color);

  function addLine() {
    add({
      key: lineKey(product.slug, size, color),
      slug: product.slug,
      name: product.name,
      size,
      color,
      unitPrice,
      qty,
    });
  }

  function addToCart() {
    addLine();
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  }

  function orderOnline() {
    addLine();
    router.push("/checkout");
  }

  const waMessage = [
    "Hello Bworld Interiors, I'd like to order:",
    `• ${product.name}${size ? ` (${size})` : ""}${color ? `, ${color}` : ""} × ${qty}`,
    `Price: ${naira(unitPrice * qty)}`,
    "",
    "Please confirm availability and delivery.",
  ].join("\n");

  return (
    <div className="product-layout">
      <ProductVisual
        category={product.category}
        tones={product.tones}
        image={product.image}
        alt={product.name}
        tint={selectedColor?.hex}
        className="product-hero"
      />

      <div className="glass panel product-panel">
        <h1 className="display product-title">{product.name}</h1>
        <p className="product-price">{naira(unitPrice)}</p>
        <p className="lead">{product.blurb}</p>

        {product.sizes && (
          <fieldset className="field-group">
            <legend>Size</legend>
            <div className="chips">
              {product.sizes.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  className={`chip ${size === s.label ? "is-active" : ""}`}
                  aria-pressed={size === s.label}
                  onClick={() => setSize(s.label)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {product.colors && (
          <fieldset className="field-group">
            <legend>
              Colour: <b>{color}</b>
            </legend>
            <div className="swatches">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  className={`swatch ${color === c.name ? "is-active" : ""}`}
                  style={{ background: c.hex }}
                  aria-label={c.name}
                  aria-pressed={color === c.name}
                  onClick={() => setColor(c.name)}
                />
              ))}
            </div>
          </fieldset>
        )}

        <div className="stepper stepper-lg" role="group" aria-label="Quantity">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
          <span aria-live="polite">{qty}</span>
          <button type="button" onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Increase quantity">+</button>
        </div>

        <div className="order-choice">
          <p className="order-choice-title">How would you like to order?</p>

          <button type="button" className="btn btn-primary btn-block" onClick={orderOnline}>
            Order online · {naira(unitPrice * qty)}
          </button>
          <p className="muted small">Pay by card, transfer or USSD. Confirmed instantly.</p>

          {whatsappEnabled && (
            <>
              <a className="btn btn-ghost btn-block" href={whatsappLink(waMessage)} target="_blank" rel="noopener noreferrer">
                Order on WhatsApp
              </a>
              <p className="muted small">{WHATSAPP_SLOW_NOTE}</p>
            </>
          )}

          <button type="button" className="link-btn" onClick={addToCart}>
            {added ? "Added to cart ✓ (see Cart above)" : "Or add to cart and keep shopping"}
          </button>
        </div>

        <ul className="detail-list">
          {product.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
