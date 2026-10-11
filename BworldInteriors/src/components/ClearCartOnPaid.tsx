"use client";

import { useEffect } from "react";
import { useCart } from "./CartProvider";

/** Empties the cart once an order is confirmed paid. Renders nothing. */
export default function ClearCartOnPaid() {
  const { clear, ready } = useCart();
  useEffect(() => {
    if (ready) clear();
  }, [ready, clear]);
  return null;
}
