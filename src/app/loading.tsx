export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-16 h-16 border-8 border-on-surface border-t-primary-container animate-spin" />
      <span className="font-black uppercase tracking-[0.3em] animate-pulse text-[10px]">
        Accessing_System_Node...
      </span>
    </div>
  );
}
