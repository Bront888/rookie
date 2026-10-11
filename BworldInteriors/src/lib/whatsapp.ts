// WhatsApp ordering helpers. Set NEXT_PUBLIC_WHATSAPP_NUMBER in .env
// (country code + number, digits only, e.g. 2348012345678).

const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
export const WHATSAPP_NUMBER = raw.replace(/\D/g, "");
export const whatsappEnabled = WHATSAPP_NUMBER.length >= 8;

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Shown wherever customers can choose between paying online and ordering on WhatsApp. */
export const WHATSAPP_SLOW_NOTE =
  "WhatsApp replies can be slow because we answer messages one by one. For instant confirmation, order online.";
