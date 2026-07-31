import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/providers";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Glow Up | Luxury Cosmetics",
  description: "Premium skincare and makeup for your natural glow.",
  keywords: ["skincare", "makeup", "luxury cosmetics", "beauty"],
  openGraph: {
    title: "Glow Up | Luxury Cosmetics",
    description: "Premium skincare and makeup for your natural glow.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glow Up | Luxury Cosmetics",
    description: "Premium skincare and makeup for your natural glow.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${inter.variable}`}>
      <body suppressHydrationWarning className="font-body bg-cream text-charcoal min-h-screen antialiased">
        <Providers>
          {children}
        </Providers>
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#2D2D2D',
            color: '#FFF8F0',
            borderRadius: '8px',
          },
        }} />
      </body>
    </html>
  );
}
