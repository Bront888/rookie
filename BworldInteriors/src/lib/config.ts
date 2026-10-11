// Store-wide settings. Placeholders: change to match your real delivery policy.

export const STORE_NAME = "Bworld Interiors";

/** Flat delivery fee in Naira. */
export const DELIVERY_FEE = 3500;

/** Orders at or above this subtotal get free delivery. Set to 0 to disable. */
export const FREE_DELIVERY_OVER = 75000;

export const deliveryFor = (subtotal: number) =>
  subtotal <= 0 ? 0 : FREE_DELIVERY_OVER > 0 && subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;

export const naira = (n: number) => "₦" + Math.round(n).toLocaleString("en-US");

export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT (Abuja)", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara",
];
