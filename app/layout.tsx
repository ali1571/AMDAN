import type { Metadata } from "next";
import { Poppins, Playfair_Display, Oswald } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import Banner from "@/components/Banner"; // Import the banner

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--next-font-poppins",
});

const playfair = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--next-font-playfair", // Renamed to avoid self-reference loop
});

const oswald = Oswald({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--next-font-oswald", // Renamed to avoid self-reference loop
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
    <html
      lang="en"
      className={`${poppins.variable} ${playfair.variable} ${oswald.variable}`}
    >
      <body className="font-sans antialiased">
        <Banner />
        {children}
        <Analytics />
      </body>
    </html>
  );
}