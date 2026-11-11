import type { Metadata } from "next";
import { Poppins, Playfair_Display, Oswald } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import Banner from "@/components/Banner"; // Import the banner

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        
        <Banner /> {/* <-- Drops in right below the nav, full width */}
        {children}
        <Analytics />
      </body>
    </html>
  );
}