import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script"; // 👈 Add this import

// Domestic imports
import { Providers } from "./providers";
import Header from "@/components/header/header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "iTasks - Streamlining Task Management, Challenges, and Time Management",
  description:
    "Elevate your productivity with iTasks — simplifying task management with seamless efficiency and mastering your time effectively.",
  authors: [
    { name: "Mohan Sharma" },
    {
      name: "Mohan Sharma",
      url: "#",
    },
  ],
  icons: [
    { rel: "apple-touch-icon", url: "/icons/icon-192x192.png" },
    { rel: "icon", url: "/icons/icon-192x192.png" },
    { rel: "favicon", url: "/icons/favicon.ico" },
  ],
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
        </Providers>

        {/* 🚀 Adsterra Popunder Script */}
        <Script
          src="https://pl28144710.effectivegatecpm.com/2e/33/75/2e33752de0185df92de1873c4a9eee19.js"
          strategy="afterInteractive"
        />

        <Analytics />
      </body>
    </html>
  );
}
