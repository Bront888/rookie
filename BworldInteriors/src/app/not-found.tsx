import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="glass panel empty">
        <h1 className="display">We couldn&apos;t find that page</h1>
        <p className="muted">It may have moved, or the link might be mistyped.</p>
        <Link href="/shop" className="btn btn-primary">
          Back to the shop
        </Link>
      </div>
    </section>
  );
}
