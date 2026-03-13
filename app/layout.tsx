import type { Metadata } from "next";
import { Outfit, Space_Mono, Syne } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["200", "300", "400", "500", "600", "700"],
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CUBER — Creative talent · AI coworkers · One ride",
  description:
    "A decentralised creative agency platform where brands post creative needs through a guided dialogue, AI structures it into a brief, matched freelance talent bids automatically.",
  metadataBase: new URL("https://cuberdrive.com"),
  openGraph: {
    title: "CUBER",
    description: "Creative talent · AI coworkers · One ride",
    url: "https://cuberdrive.com",
    siteName: "CUBER",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CUBER",
    description: "Creative talent · AI coworkers · One ride",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${spaceMono.variable} ${syne.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
