import Header from "./Header";
import Footer from "./Footer";
import ClientOnly from "../utils/ClientOnly";

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
