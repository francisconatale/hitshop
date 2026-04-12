export default function Footer() {
  return (
    <footer className="border-t-8 border-on-surface bg-surface p-4">
      <div className="flex items-center justify-between">
        <span className="font-bold text-xs uppercase">© 2024 HITSHOP</span>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-sm">facebook</span>
          <span className="material-symbols-outlined text-sm">twitter</span>
          <span className="material-symbols-outlined text-sm">instagram</span>
        </div>
      </div>
    </footer>
  );
}