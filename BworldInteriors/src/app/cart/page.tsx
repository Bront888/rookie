import type { Metadata } from "next";
import CartView from "@/components/CartView";

export const metadata: Metadata = { title: "Your cart" };

export default function CartPage() {
  return (
    <section className="section">
      <div className="section-head">
        <h1 className="display">Your cart</h1>
      </div>
      <CartView />
    </section>
  );
}
