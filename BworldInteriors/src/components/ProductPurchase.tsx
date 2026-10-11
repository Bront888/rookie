"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart, lineKey } from "./CartProvider";
import ProductVisual from "./ProductVisual";
import { naira } from "@/lib/config";
import { unitPriceFor, type Product } from "@/lib/products";
import { whatsappEnabled, whatsappLink } from "@/lib/whatsapp";

export default function ProductPurchase({ product }: { product: Product }) {
  const { add } = useCart();
  const [size, setSize] = useState<string | null>(product.sizes?.[0]?.label ?? null);
  const [color, setColor] = useState<string | null>(product.colors?.[0]?.name ?? null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const unitPrice = unitPriceFor(product, size) ?? product.price;
  const selectedColor = product.colors?.find((c) => c.name === color);

  function addToCart() {
    add({
      key: lineKey(product.slug, size, color),
      slug: product.slug,
      name: product.name,
      size,
      color,
      unitPrice,
      qty,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
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

        <div className="buy-row">
          <div className="stepper" role="group" aria-label="Quantity">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
            <span aria-live="polite">{qty}</span>
            <button type="button" onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Increase quantity">+</button>
          </div>
          <button type="button" className="btn btn-primary btn-grow" onClick={addToCart}>
            {added ? "Added to cart ✓" : `Add to cart · ${naira(unitPrice * qty)}`}
          </button>
        </div>

        {added && (
          <p className="notice">
            <Link href="/cart">View cart →</Link>
          </p>
        )}

        {whatsappEnabled && (
          <a className="btn btn-ghost btn-block" href={whatsappLink(waMessage)} target="_blank" rel="noopener noreferrer">
            Prefer to chat? Order on WhatsApp
          </a>
        )}

        <ul className="detail-list">
          {product.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
