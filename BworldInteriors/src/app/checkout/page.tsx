import type { Metadata } from "next";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <section className="section">
      <div className="section-head">
        <h1 className="display">Checkout</h1>
      </div>
      <CheckoutForm />
    </section>
  );
}
