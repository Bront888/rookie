import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Bworld Interiors: Bedding, Curtains, Bath & Décor", template: "%s · Bworld Interiors" },
  description:
    "Shop duvets, bedsheets, curtains, towels, bathing robes, pillows, bed toppers and home décor from Bworld Interiors. Pay securely online or order on WhatsApp.",
};

export const viewport: Viewport = {
  themeColor: "#f1e7dc",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <div className="backdrop" aria-hidden="true">
          <span className="orb orb-1" />
          <span className="orb orb-2" />
          <span className="orb orb-3" />
          <span className="orb orb-4" />
        </div>
        <CartProvider>
          <Header />
          <main className="container">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
