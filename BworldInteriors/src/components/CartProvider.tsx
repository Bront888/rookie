"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";

export type CartLine = {
  key: string; // slug|size|color
  slug: string;
  name: string;
  size?: string | null;
  color?: string | null;
  unitPrice: number;
  qty: number;
};

type Action =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; line: CartLine }
  | { type: "qty"; key: string; qty: number }
  | { type: "remove"; key: string }
  | { type: "clear" };

const MAX_QTY = 20;
const STORAGE_KEY = "bworld-cart-v1";

export const lineKey = (slug: string, size?: string | null, color?: string | null) =>
  [slug, size ?? "", color ?? ""].join("|");

function reducer(state: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case "hydrate":
      return action.lines;
    case "add": {
      const existing = state.find((l) => l.key === action.line.key);
      if (existing) {
        return state.map((l) =>
          l.key === existing.key ? { ...l, qty: Math.min(MAX_QTY, l.qty + action.line.qty) } : l,
        );
      }
      return [...state, { ...action.line, qty: Math.min(MAX_QTY, action.line.qty) }];
    }
    case "qty":
      return state
        .map((l) => (l.key === action.key ? { ...l, qty: Math.min(MAX_QTY, action.qty) } : l))
        .filter((l) => l.qty > 0);
    case "remove":
      return state.filter((l) => l.key !== action.key);
    case "clear":
      return [];
  }
}

type CartContextValue = {
  lines: CartLine[];
  ready: boolean;
  count: number;
  subtotal: number;
  add: (line: CartLine) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, []);
  const [ready, setReady] = useState(false);

  // Load saved cart after mount (avoids server/client hydration mismatch).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) dispatch({ type: "hydrate", lines: parsed });
      }
    } catch {
      /* storage unavailable: start with an empty cart */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, ready]);

  const add = useCallback((line: CartLine) => dispatch({ type: "add", line }), []);
  const setQty = useCallback((key: string, qty: number) => dispatch({ type: "qty", key, qty }), []);
  const remove = useCallback((key: string) => dispatch({ type: "remove", key }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      ready,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.qty * l.unitPrice, 0),
      add,
      setQty,
      remove,
      clear,
    }),
    [lines, ready, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
