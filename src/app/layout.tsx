import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";

import "./globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ClientProvidersWrapper } from "@/components/utils/ClientProvidersWrapper";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
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
    <html lang="en" className={cn("font-sans", spaceGrotesk.variable)} suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${spaceGrotesk.variable} antialiased min-h-screen bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container`}>
        <ClientProvidersWrapper>
          <div className="min-h-screen bg-surface text-on-surface flex flex-col relative">
            <div className="bg-noise" />
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ClientProvidersWrapper>
      </body>
    </html>
  );
}
