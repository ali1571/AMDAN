import type { Metadata } from "next";
import { Poppins, Playfair_Display, Oswald } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const playfair = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-playfair",
});

const oswald = Oswald({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: "Amdan | Tech Salary Transparency",
  description: "Anonymous tech salary aggregator for Pakistan.",
};



export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Moving variables to HTML fixes the Tailwind v4 fallback bug
  return (
    <html lang="en" className={`${poppins.variable} ${playfair.variable} ${oswald.variable}`}>
      <body className="font-sans bg-[#f8fafc] text-slate-900 antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}