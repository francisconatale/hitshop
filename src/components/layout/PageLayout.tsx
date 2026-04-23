export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-grow">
      {children}
    </main>
  );
}
