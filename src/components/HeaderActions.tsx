export default function HeaderActions() {
  return (
    <div className="flex items-center gap-6">
      <span className="material-symbols-outlined text-3xl cursor-pointer hover:bg-primary-container transition-colors p-2">
        search
      </span>
      <span className="material-symbols-outlined text-3xl cursor-pointer hover:bg-primary-container transition-colors p-2">
        account_circle
      </span>
    </div>
  );
}