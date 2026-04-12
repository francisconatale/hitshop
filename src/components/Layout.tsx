import Header from "./navbar/Navbar";
import HeaderActions from "./HeaderActions";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Header />
      <header className="sticky top-0 w-full flex justify-between items-center px-8 py-6 bg-surface border-b-8 border-on-surface z-40">
        <span></span>
        <HeaderActions />
      </header>
      <main className="ml-64">{children}</main>
    </div>
  );
}