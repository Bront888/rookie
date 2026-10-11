import Link from "next/link";
import ProductVisual from "./ProductVisual";
import { getCategory, fromPrice, type Product } from "@/lib/products";
import { naira } from "@/lib/config";

export default function ProductCard({ product }: { product: Product }) {
  const cat = getCategory(product.category);
  const hasRange = !!product.sizes && product.sizes.length > 1;

  return (
    <Link href={`/product/${product.slug}`} className="glass card product-card">
      <ProductVisual
        category={product.category}
        tones={product.tones}
        image={product.image}
        alt={product.name}
      />
      <div className="card-body">
        <span className="eyebrow">{cat?.name}</span>
        <h3 className="card-title">{product.name}</h3>
        <div className="card-foot">
          <span className="price">
            {hasRange && <small>from </small>}
            {naira(fromPrice(product))}
          </span>
          {product.colors && product.colors.length > 0 && (
            <span className="dots" aria-label={`${product.colors.length} colours`}>
              {product.colors.slice(0, 4).map((c) => (
                <i key={c.name} style={{ background: c.hex }} title={c.name} />
              ))}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
