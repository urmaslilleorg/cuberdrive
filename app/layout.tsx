import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
