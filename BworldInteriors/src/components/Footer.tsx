import Link from "next/link";
import { categories } from "@/lib/products";
import { STORE_NAME } from "@/lib/config";
import { whatsappEnabled, whatsappLink } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="glass footer-panel">
        <div>
          <p className="footer-brand">{STORE_NAME}</p>
          <p className="muted">Bedding, curtains, bath and décor that make a house feel like home.</p>
          {whatsappEnabled && (
            <a className="btn btn-ghost" href={whatsappLink("Hello Bworld Interiors, I have a question.")} target="_blank" rel="noopener noreferrer">
              Chat with us on WhatsApp
            </a>
          )}
        </div>
        <div>
          <p className="footer-title">Shop</p>
          <ul className="footer-list">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/shop?category=${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="footer-title">&nbsp;</p>
          <ul className="footer-list">
            {categories.slice(6).map((c) => (
              <li key={c.slug}>
                <Link href={`/shop?category=${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="legal">© {new Date().getFullYear()} {STORE_NAME}. All rights reserved.</p>
    </footer>
  );
}
