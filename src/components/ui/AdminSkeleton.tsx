"use client";

export function AdminSkeleton() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-12">
      <header className="animate-pulse">
        <div className="w-24 h-4 bg-on-surface/5 mb-4" />
        <div className="w-64 h-12 bg-on-surface/10 mb-2" />
        <div className="w-80 h-4 bg-on-surface/5" />
      </header>

      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface border-2 border-on-surface/10 h-32 relative overflow-hidden animate-pulse">
            <div className="border-b-2 border-on-surface/5 p-4 flex justify-between">
              <div className="w-48 h-3 bg-on-surface/5" />
              <div className="w-32 h-3 bg-on-surface/5" />
            </div>
            <div className="p-6 space-y-4">
              <div className="w-full h-3 bg-on-surface/5" />
              <div className="w-2/3 h-3 bg-on-surface/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
