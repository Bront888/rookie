import Link from "next/link";
import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { categories, getCategory, products } from "@/lib/products";

export const metadata: Metadata = { title: "Shop" };

type SearchParams = Promise<{ category?: string; q?: string }>;

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const { category, q } = await searchParams;
  const active = category ? getCategory(category) : undefined;
  const query = (q ?? "").trim().toLowerCase();

  const list = products.filter((p) => {
    if (active && p.category !== active.slug) return false;
    if (query) {
      const hay = `${p.name} ${p.blurb} ${getCategory(p.category)?.name ?? ""}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <h1 className="display">{active ? active.name : "The collection"}</h1>
          <p className="muted">{active ? active.tagline : "Everything for your bed, bath, windows and shelves."}</p>
        </div>
        <form action="/shop" className="search glass">
          {active && <input type="hidden" name="category" value={active.slug} />}
          <input type="search" name="q" defaultValue={q ?? ""} placeholder="Search products…" aria-label="Search products" />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      <div className="chips filter-row" role="navigation" aria-label="Categories">
        <Link href="/shop" className={`chip ${!active ? "is-active" : ""}`}>
          All
        </Link>
        {categories.map((c) => (
          <Link key={c.slug} href={`/shop?category=${c.slug}`} className={`chip ${active?.slug === c.slug ? "is-active" : ""}`}>
            {c.name}
          </Link>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="glass panel empty">
          <h2 className="display">Nothing matched</h2>
          <p className="muted">Try a different word, or browse all categories.</p>
          <Link href="/shop" className="btn btn-primary">
            Clear filters
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
