import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClientOnly from "@/components/utils/ClientOnly";
import DevConsole from "@/components/layout/DevConsole";
import { AuthProvider } from "@/context/AuthContext";
import { SystemProvider } from "@/context/SystemContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
    <html lang="en" className="light">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} min-h-screen bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container`}>
        <AuthProvider>
          <SystemProvider>
            <div className="min-h-screen bg-surface text-on-surface flex flex-col relative">
              <div className="bg-noise" />
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <ClientOnly>
                <Footer />
              </ClientOnly>
            </div>
            <DevConsole />
          </SystemProvider>
        </AuthProvider>
      </body>
    </html>
  );
}