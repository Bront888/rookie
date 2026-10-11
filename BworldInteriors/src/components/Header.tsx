"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { STORE_NAME } from "@/lib/config";

export default function Header() {
  const { count, ready } = useCart();

  return (
    <header className="site-header">
      <div className="glass header-bar">
        <Link href="/" className="brand" aria-label={`${STORE_NAME} home`}>
          <span className="brand-mark" aria-hidden="true">B</span>
          <span className="brand-text">
            Bworld<em>Interiors</em>
          </span>
        </Link>

        <nav className="nav" aria-label="Main">
          <Link href="/shop">Shop</Link>
          <Link href="/shop?category=curtains">Curtains</Link>
          <Link href="/shop?category=duvets">Duvets</Link>
          <Link href="/shop?category=towels">Bath</Link>
          <Link href="/shop?category=decoration-flowers">Decor</Link>
        </nav>

        <Link href="/cart" className="cart-link" aria-label={`Cart, ${ready ? count : 0} items`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 8h14l-1.2 11H6.2L5 8Z" />
            <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
          </svg>
          <span>Cart</span>
          {ready && count > 0 && <b className="badge">{count}</b>}
        </Link>
      </div>
    </header>
  );
}
