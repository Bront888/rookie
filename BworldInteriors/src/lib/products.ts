// ---------------------------------------------------------------------------
// Catalogue. Prices (in Naira) and descriptions are PLACEHOLDERS: edit freely.
// To use real photos, drop images in /public/products and set `image`
// (e.g. image: "/products/white-pillow.jpg") on the product.
// ---------------------------------------------------------------------------

export type Pattern =
  | "pillow"
  | "sheet"
  | "quilt"
  | "fur"
  | "ribs"
  | "folds"
  | "towel"
  | "robe"
  | "flowers"
  | "books";

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  tones: [string, string];
  pattern: Pattern;
};

export const categories: Category[] = [
  { slug: "bed-toppers", name: "Bed Toppers", tagline: "Cloud-soft comfort over any mattress", tones: ["#f4e9dc", "#d9c3a5"], pattern: "quilt" },
  { slug: "pillows", name: "Pillows", tagline: "Plump, supportive, made for sleep", tones: ["#efe3ea", "#c9a9bd"], pattern: "pillow" },
  { slug: "bedsheets", name: "Bedsheets", tagline: "Crisp, cool, effortlessly layered", tones: ["#dfe8e3", "#9db8aa"], pattern: "sheet" },
  { slug: "duvets", name: "Duvets", tagline: "Warm without the weight", tones: ["#f1e2d6", "#d29f84"], pattern: "quilt" },
  { slug: "fur-duvets", name: "Fur Duvets", tagline: "Plush, fluffy, deeply cosy", tones: ["#f3eee8", "#cbb9a6"], pattern: "fur" },
  { slug: "corduroy-duvets", name: "Corduroy Duvets", tagline: "Textured ribs, quiet luxury", tones: ["#e9d9c4", "#b98a5c"], pattern: "ribs" },
  { slug: "curtains", name: "Curtains", tagline: "Frame your windows, soften your light", tones: ["#e6dde9", "#a590b3"], pattern: "folds" },
  { slug: "towels", name: "Towels", tagline: "Thirsty, thick, spa-day ready", tones: ["#dbe9ea", "#8fb5ba"], pattern: "towel" },
  { slug: "bathing-robes", name: "Bathing Robes", tagline: "Wrap up after every shower", tones: ["#f0e0dc", "#c98e83"], pattern: "robe" },
  { slug: "decoration-flowers", name: "Decoration Flowers", tagline: "Blooms that never wilt", tones: ["#f3dfe3", "#d98f9f"], pattern: "flowers" },
  { slug: "decoration-novels", name: "Decoration Novels", tagline: "Shelf-styling books with character", tones: ["#e5e0d4", "#8f8566"], pattern: "books" },
];

export type SizeOption = { label: string; price: number };
export type ColorOption = { name: string; hex: string };

export type Product = {
  slug: string;
  name: string;
  category: string; // Category["slug"]
  /** Base ("from") price in Naira. Ignored per-size when `sizes` is set. */
  price: number;
  sizes?: SizeOption[];
  colors?: ColorOption[];
  blurb: string;
  details: string[];
  tones?: [string, string];
  featured?: boolean;
  image?: string;
};

const bed = (single: number, dbl: number, queen: number, king: number): SizeOption[] => [
  { label: "Single (3.5 × 6 ft)", price: single },
  { label: "Double (4.5 × 6 ft)", price: dbl },
  { label: "Queen (6 × 6 ft)", price: queen },
  { label: "King (7 × 7 ft)", price: king },
];

const neutrals: ColorOption[] = [
  { name: "Ivory", hex: "#f3ead9" },
  { name: "Sand", hex: "#d8c3a5" },
  { name: "Stone", hex: "#a8a29a" },
  { name: "Charcoal", hex: "#4a4644" },
];

const softColors: ColorOption[] = [
  { name: "Blush", hex: "#e8c4c0" },
  { name: "Sage", hex: "#a9bfae" },
  { name: "Sky", hex: "#b7cfdc" },
  { name: "Cream", hex: "#f3ead9" },
];

const richColors: ColorOption[] = [
  { name: "Burgundy", hex: "#7b2d3a" },
  { name: "Forest", hex: "#2f5a46" },
  { name: "Navy", hex: "#28385e" },
  { name: "Mocha", hex: "#6b4f3f" },
];

export const products: Product[] = [
  // ---- Bed toppers
  {
    slug: "quilted-hotel-bed-topper",
    name: "Quilted Hotel Bed Topper",
    category: "bed-toppers",
    price: 28000,
    sizes: bed(22000, 28000, 36000, 44000),
    colors: [neutrals[0], { name: "White", hex: "#fbfaf7" }],
    blurb: "A deep, quilted layer that turns a firm mattress into a hotel bed.",
    details: ["Quilted top for even, lasting cushioning", "Elasticated skirt keeps it in place", "Machine washable"],
    featured: true,
  },
  {
    slug: "soft-fibre-mattress-pad",
    name: "Soft-Fibre Mattress Pad",
    category: "bed-toppers",
    price: 19000,
    sizes: bed(15000, 19000, 25000, 31000),
    colors: [neutrals[0], neutrals[2]],
    blurb: "Light, breathable padding for an everyday comfort upgrade.",
    details: ["Lightweight and easy to store", "Fitted corners", "Great for guest rooms"],
  },

  // ---- Pillows
  {
    slug: "cloud-fibre-pillow-pair",
    name: "Cloud Fibre Pillow (Pair)",
    category: "pillows",
    price: 12000,
    colors: [{ name: "White", hex: "#fbfaf7" }],
    blurb: "Two generously filled pillows that hold their shape night after night.",
    details: ["Sold as a pair", "Medium-soft support", "Smooth, soft cover"],
    featured: true,
  },
  {
    slug: "hotel-comfort-pillow",
    name: "Hotel Comfort Pillow",
    category: "pillows",
    price: 7500,
    colors: [{ name: "White", hex: "#fbfaf7" }],
    blurb: "The classic five-star pillow: full, fluffy and supportive.",
    details: ["Single pillow", "Side and back sleepers", "Easy to fluff back to shape"],
  },
  {
    slug: "decorative-cushion-set",
    name: "Decorative Cushion Set",
    category: "pillows",
    price: 16500,
    colors: softColors,
    blurb: "A set of coordinated cushions to pull a sofa or bed together.",
    details: ["Set of 4 cushions", "Covers included", "Pick your colour palette"],
  },

  // ---- Bedsheets
  {
    slug: "classic-cotton-bedsheet-set",
    name: "Classic Cotton Bedsheet Set",
    category: "bedsheets",
    price: 18000,
    sizes: bed(14000, 18000, 24000, 29000),
    colors: [...softColors, neutrals[2]],
    blurb: "A breathable everyday set, soft from the very first wash.",
    details: ["Flat or fitted sheet plus pillowcases", "Breathable and cool", "Machine washable"],
    featured: true,
  },
  {
    slug: "satin-sheen-bedsheet-set",
    name: "Satin Sheen Bedsheet Set",
    category: "bedsheets",
    price: 24000,
    sizes: bed(19000, 24000, 31000, 38000),
    colors: [richColors[0], { name: "Champagne", hex: "#d9c29a" }, richColors[2]],
    blurb: "A silky, subtle shine that makes any bed look like a boutique hotel.",
    details: ["Smooth, cool-to-the-touch finish", "Includes pillowcases", "Gentle-cycle wash"],
  },
  {
    slug: "striped-percale-bedsheet-set",
    name: "Striped Percale Bedsheet Set",
    category: "bedsheets",
    price: 21000,
    sizes: bed(16500, 21000, 27500, 33500),
    colors: [{ name: "Sage stripe", hex: "#a9bfae" }, { name: "Navy stripe", hex: "#28385e" }],
    blurb: "A crisp, tailored stripe for a clean, grown-up bedroom.",
    details: ["Crisp, matte finish", "Includes pillowcases", "Machine washable"],
  },

  // ---- Duvets
  {
    slug: "all-season-duvet",
    name: "All-Season Duvet",
    category: "duvets",
    price: 32000,
    sizes: bed(26000, 32000, 41000, 50000),
    colors: [{ name: "White", hex: "#fbfaf7" }],
    blurb: "A balanced fill that keeps you comfortable in every season.",
    details: ["Box-stitched so the fill stays put", "Soft cover", "Duvet cover sold separately"],
    featured: true,
  },
  {
    slug: "printed-duvet-cover-set",
    name: "Printed Duvet Cover Set",
    category: "duvets",
    price: 26000,
    sizes: bed(21000, 26000, 33000, 40000),
    colors: [softColors[0], softColors[1], richColors[2]],
    blurb: "A refreshed look for your duvet: cover plus matching pillow shams.",
    details: ["Duvet cover plus 2 pillow shams", "Zip closure", "Machine washable"],
  },

  // ---- Fur duvets
  {
    slug: "faux-fur-duvet",
    name: "Faux-Fur Duvet",
    category: "fur-duvets",
    price: 48000,
    sizes: bed(38000, 48000, 60000, 72000),
    colors: [{ name: "Cream", hex: "#f3ead9" }, { name: "Taupe", hex: "#a79484" }, { name: "Grey", hex: "#9a9a9a" }],
    blurb: "Deep, fluffy faux fur on one side. Pure cosiness for cold nights and harmattan mornings.",
    details: ["Ultra-plush faux-fur surface", "Warm and generously filled", "Spot-clean or gentle wash"],
    featured: true,
  },
  {
    slug: "fur-and-fleece-duvet",
    name: "Fur & Fleece Duvet",
    category: "fur-duvets",
    price: 42000,
    sizes: bed(34000, 42000, 53000, 64000),
    colors: [{ name: "Mocha", hex: "#6b4f3f" }, { name: "Cream", hex: "#f3ead9" }],
    blurb: "Fluffy fur on top, smooth fleece underneath: soft against your skin.",
    details: ["Reversible fur and fleece", "Warm yet lightweight", "Gentle wash"],
  },

  // ---- Corduroy duvets
  {
    slug: "corduroy-ribbed-duvet",
    name: "Corduroy Ribbed Duvet",
    category: "corduroy-duvets",
    price: 40000,
    sizes: bed(32000, 40000, 51000, 62000),
    colors: [richColors[3], richColors[1], { name: "Oat", hex: "#d8c3a5" }],
    blurb: "Soft ribbed corduroy with a warm, lived-in texture.",
    details: ["Ribbed corduroy surface", "Warm and weighty feel", "Gentle wash"],
    featured: true,
  },
  {
    slug: "corduroy-duvet-cover-set",
    name: "Corduroy Duvet Cover Set",
    category: "corduroy-duvets",
    price: 34000,
    sizes: bed(27000, 34000, 43000, 52000),
    colors: [richColors[0], richColors[3], { name: "Oat", hex: "#d8c3a5" }],
    blurb: "Give any duvet a textured, cosy upgrade with a corduroy cover.",
    details: ["Duvet cover plus 2 pillow shams", "Zip closure", "Gentle wash"],
  },

  // ---- Curtains
  {
    slug: "blackout-curtains-pair",
    name: "Blackout Curtains (Pair)",
    category: "curtains",
    price: 30000,
    sizes: [
      { label: "Standard (2 × 2.3 m per panel)", price: 30000 },
      { label: "Wide (2.8 × 2.3 m per panel)", price: 40000 },
    ],
    colors: [neutrals[3], neutrals[2], richColors[2], softColors[3]],
    blurb: "Thick, light-blocking panels for restful sleep and instant privacy.",
    details: ["Pair of panels", "Eyelet or pencil-pleat header available", "Custom sizes: message us on WhatsApp"],
    featured: true,
  },
  {
    slug: "sheer-voile-curtains-pair",
    name: "Sheer Voile Curtains (Pair)",
    category: "curtains",
    price: 18000,
    sizes: [
      { label: "Standard (2 × 2.3 m per panel)", price: 18000 },
      { label: "Wide (2.8 × 2.3 m per panel)", price: 25000 },
    ],
    colors: [{ name: "White", hex: "#fbfaf7" }, { name: "Champagne", hex: "#e7d8bd" }],
    blurb: "Airy sheers that filter daylight and layer beautifully with heavier drapes.",
    details: ["Pair of panels", "Light and breezy", "Custom sizes: message us on WhatsApp"],
  },
  {
    slug: "velvet-drape-curtains-pair",
    name: "Velvet Drape Curtains (Pair)",
    category: "curtains",
    price: 46000,
    sizes: [
      { label: "Standard (2 × 2.3 m per panel)", price: 46000 },
      { label: "Wide (2.8 × 2.3 m per panel)", price: 60000 },
    ],
    colors: [richColors[0], richColors[1], richColors[2], { name: "Gold", hex: "#b98f3e" }],
    blurb: "Rich, heavy velvet with a dramatic fall for living rooms and master bedrooms.",
    details: ["Pair of panels", "Lined for a luxurious drape", "Custom sizes: message us on WhatsApp"],
  },

  // ---- Towels
  {
    slug: "luxury-bath-towel",
    name: "Luxury Bath Towel",
    category: "towels",
    price: 8500,
    colors: [{ name: "White", hex: "#fbfaf7" }, { name: "Grey", hex: "#b4b0aa" }, { name: "Sky", hex: "#b7cfdc" }, { name: "Blush", hex: "#e8c4c0" }],
    blurb: "Thick, absorbent and soft: the towel that makes bath time feel like a spa.",
    details: ["Large bath size", "Quick-drying", "Machine washable"],
    featured: true,
  },
  {
    slug: "bath-towel-set-of-4",
    name: "Bath Towel Set (4 pieces)",
    category: "towels",
    price: 26000,
    colors: [{ name: "White", hex: "#fbfaf7" }, { name: "Grey", hex: "#b4b0aa" }, { name: "Sage", hex: "#a9bfae" }],
    blurb: "Two bath towels and two hand towels in a matching colour.",
    details: ["2 bath towels + 2 hand towels", "Matching colour", "Gift-ready"],
  },

  // ---- Bathing robes
  {
    slug: "classic-bathing-robe",
    name: "Classic Bathing Robe",
    category: "bathing-robes",
    price: 17000,
    sizes: [
      { label: "S / M", price: 17000 },
      { label: "L / XL", price: 18500 },
      { label: "XXL", price: 20000 },
    ],
    colors: [{ name: "White", hex: "#fbfaf7" }, { name: "Grey", hex: "#b4b0aa" }, { name: "Navy", hex: "#28385e" }],
    blurb: "Soft and absorbent, with a belt and deep pockets.",
    details: ["Shawl collar", "Belt and two pockets", "Unisex fit"],
    featured: true,
  },
  {
    slug: "waffle-spa-robe",
    name: "Waffle Spa Robe",
    category: "bathing-robes",
    price: 19500,
    sizes: [
      { label: "S / M", price: 19500 },
      { label: "L / XL", price: 21000 },
      { label: "XXL", price: 22500 },
    ],
    colors: [{ name: "White", hex: "#fbfaf7" }, { name: "Sand", hex: "#d8c3a5" }],
    blurb: "A lightweight waffle weave: the robe you'll actually want to wear all morning.",
    details: ["Waffle-textured weave", "Lightweight and breathable", "Belt and pockets"],
  },

  // ---- Decoration flowers
  {
    slug: "faux-peony-bunch",
    name: "Faux Peony Bunch",
    category: "decoration-flowers",
    price: 6500,
    colors: [{ name: "Blush", hex: "#e8c4c0" }, { name: "Ivory", hex: "#f3ead9" }, { name: "Coral", hex: "#e08a7a" }],
    blurb: "Full, lifelike peonies on a bendable stem. No watering, no wilting.",
    details: ["Bunch of stems", "Long-lasting and dust-wipeable", "Vase sold separately"],
    featured: true,
  },
  {
    slug: "eucalyptus-and-pampas-set",
    name: "Eucalyptus & Pampas Set",
    category: "decoration-flowers",
    price: 9500,
    blurb: "Soft greenery and fluffy pampas for a calm, earthy corner.",
    details: ["Mixed set of stems", "Pairs well with tall vases", "Always fresh-looking"],
  },
  {
    slug: "decorative-vase-with-flowers",
    name: "Vase with Flowers",
    category: "decoration-flowers",
    price: 14500,
    blurb: "Arranged and ready: just place it on a console, dining table or shelf.",
    details: ["Vase and arrangement included", "No assembly needed", "A thoughtful gift"],
  },

  // ---- Decoration novels
  {
    slug: "decor-book-stack-classics",
    name: "Decor Book Stack: Classics",
    category: "decoration-novels",
    price: 11000,
    blurb: "A stylish stack of decorative books in muted classic colours.",
    details: ["Set of 3 decorative books", "For shelves, coffee tables and consoles", "For styling, not for reading"],
    featured: true,
  },
  {
    slug: "decor-novels-shelf-set",
    name: "Decor Novels Shelf Set",
    category: "decoration-novels",
    price: 18500,
    blurb: "A bigger set of decorative novels to give shelves layers and colour.",
    details: ["Set of 6 decorative books", "Mixed heights and spines", "For styling, not for reading"],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const productsIn = (categorySlug: string) => products.filter((p) => p.category === categorySlug);
export const featuredProducts = () => products.filter((p) => p.featured);

/** Lowest available price for "From ₦x" labels. */
export const fromPrice = (p: Product) =>
  p.sizes && p.sizes.length ? Math.min(...p.sizes.map((s) => s.price)) : p.price;

/**
 * Resolve a unit price from a product + chosen size.
 * Returns null if the selection is invalid, so the server can reject tampered carts.
 */
export function unitPriceFor(p: Product, size?: string | null): number | null {
  if (p.sizes && p.sizes.length) {
    const match = p.sizes.find((s) => s.label === size);
    return match ? match.price : null;
  }
  return p.price;
}

export function isValidColor(p: Product, color?: string | null): boolean {
  if (!p.colors || p.colors.length === 0) return !color;
  return !!p.colors.find((c) => c.name === color);
}
