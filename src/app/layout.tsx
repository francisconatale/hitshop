import type { Metadata } from "next";
import { Inter, Space_Grotesk, Geist } from "next/font/google";

import "./globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DevConsole from "@/components/layout/DevConsole";
import { AuthProvider } from "@/context/AuthContext";
import { SystemProvider } from "@/context/SystemContext";
import { LocalesProvider } from "@/context/LocalesContext";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "System Hardware",
  description: "RAW SILICON POWER - High-Performance Hardware",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("light", "font-sans", geist.variable)}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased min-h-screen bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container`}>
        <AuthProvider>
          <LocalesProvider>
            <SystemProvider>
              <CartProvider>
                <div className="min-h-screen bg-surface text-on-surface flex flex-col relative">
                  <div className="bg-noise" />
                  <Header />
                  <main className="flex-grow">
                    {children}
                  </main>
                  <Footer />
                </div>
                <CartDrawer />
                <DevConsole />
              </CartProvider>
            </SystemProvider>
          </LocalesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}