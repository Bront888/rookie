import "server-only";
import { prisma } from "./db";

export type OrderItem = {
  slug: string;
  name: string;
  size?: string | null;
  color?: string | null;
  unitPrice: number;
  qty: number;
};

/**
 * Marks an order PAID, but only if the amount Paystack collected matches the
 * order total. Safe to call repeatedly (webhook + redirect can both fire).
 */
export async function markOrderPaid(reference: string, amountKobo: number) {
  const order = await prisma.order.findUnique({ where: { reference } });
  if (!order) return null;
  if (order.status === "PAID") return order;

  if (amountKobo !== order.total * 100) {
    console.error(
      `[orders] amount mismatch for ${reference}: paid ${amountKobo} kobo, expected ${order.total * 100}`,
    );
    return order;
  }

  return prisma.order.update({
    where: { reference },
    data: { status: "PAID", paidAt: new Date() },
  });
}

export async function markOrderFailed(reference: string) {
  await prisma.order.updateMany({
    where: { reference, status: "PENDING" },
    data: { status: "FAILED" },
  });
}
