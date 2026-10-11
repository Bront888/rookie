import { NextResponse } from "next/server";
import { isValidWebhookSignature } from "@/lib/paystack";
import { markOrderPaid } from "@/lib/orders";

export const dynamic = "force-dynamic";

// Paystack calls this URL after a payment. Set it in your dashboard:
// Settings → API Keys & Webhooks → Webhook URL = https://YOUR-DOMAIN/api/paystack/webhook
export async function POST(req: Request) {
  // The signature is computed over the RAW body, so read it as text first.
  const raw = await req.text();

  if (!isValidWebhookSignature(raw, req.headers.get("x-paystack-signature"))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string; amount?: number } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Bad payload" }, { status: 400 });
  }

  if (event.event === "charge.success" && event.data?.reference && typeof event.data.amount === "number") {
    await markOrderPaid(event.data.reference, event.data.amount);
  }

  // Always answer 200 quickly so Paystack doesn't keep retrying.
  return NextResponse.json({ received: true });
}
