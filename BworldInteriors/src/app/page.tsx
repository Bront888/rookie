import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ProductVisual from "@/components/ProductVisual";
import { categories, featuredProducts, productsIn } from "@/lib/products";
import { FREE_DELIVERY_OVER, naira } from "@/lib/config";

export default function Home() {
  const featured = featuredProducts();

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="hero">
        <div className="hero-copy">
          <span className="pill">New season · Bedding, Bath &amp; Décor</span>
          <h1 className="display hero-title">
            Make home <em>the softest</em> place you know.
          </h1>
          <p className="lead">
            Duvets that hug, curtains that glow, towels you won&apos;t want to leave. Everything your rooms need, in one
            calm little shop.
          </p>
          <div className="hero-actions">
            <Link href="/shop" className="btn btn-primary">
              Shop the collection
            </Link>
            <Link href="/shop?category=fur-duvets" className="btn btn-ghost">
              Fur duvets
            </Link>
          </div>
        </div>

        <div className="hero-stack" aria-hidden="true">
          <div className="glass hero-card hc-1">
            <ProductVisual category="curtains" alt="" />
            <span>Curtains</span>
          </div>
          <div className="glass hero-card hc-2">
            <ProductVisual category="fur-duvets" alt="" />
            <span>Fur duvets</span>
          </div>
          <div className="glass hero-card hc-3">
            <ProductVisual category="towels" alt="" />
            <span>Towels</span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ categories */}
      <section className="section">
        <div className="section-head">
          <h2 className="display">Shop by room</h2>
          <Link href="/shop" className="link-btn">
            View everything →
          </Link>
        </div>
        <div className="cat-grid">
          {categories.map((c) => (
            <Link key={c.slug} href={`/shop?category=${c.slug}`} className="glass card cat-card">
              <ProductVisual category={c.slug} alt={c.name} />
              <div className="card-body">
                <h3 className="card-title">{c.name}</h3>
                <p className="muted small">{c.tagline}</p>
                <span className="eyebrow">{productsIn(c.slug).length} styles</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- featured */}
      <section className="section">
        <div className="section-head">
          <h2 className="display">Customer favourites</h2>
          <Link href="/shop" className="link-btn">
            Shop all →
          </Link>
        </div>
        <div className="product-grid">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------- how it works */}
      <section className="section">
        <div className="glass panel how">
          <h2 className="display">Order your way</h2>
          <div className="how-grid">
            <div>
              <b>1 · Pick</b>
              <p className="muted">Choose your size and colour, then add to cart.</p>
            </div>
            <div>
              <b>2 · Pay online</b>
              <p className="muted">Card, bank transfer or USSD through Paystack, confirmed instantly.</p>
            </div>
            <div>
              <b>3 · Or chat</b>
              <p className="muted">Prefer a conversation, or need custom curtain sizes? Order on WhatsApp.</p>
            </div>
          </div>
          {FREE_DELIVERY_OVER > 0 && <p className="notice">Free delivery on orders above {naira(FREE_DELIVERY_OVER)}.</p>}
        </div>
      </section>
    </>
  );
}
