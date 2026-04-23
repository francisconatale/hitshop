export function ProductGridSkeleton() {
  return (
    <div className="max-w-[1440px] mx-auto mb-6 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-l border-t border-on-surface">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="group border-r border-b border-on-surface bg-surface flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center px-3 py-[9px] border-b border-on-surface/10">
              <div className="h-[7px] w-16 bg-on-surface/10 animate-pulse" />
              <div className="h-[7px] w-12 bg-on-surface/10 animate-pulse" />
            </div>

            <div className="aspect-square relative overflow-hidden bg-on-surface/5 animate-pulse" />

            <div className="p-4 flex flex-col flex-grow border-t border-on-surface/10">
              <div className="flex justify-between items-start mb-3">
                <div className="h-5 w-3/4 bg-on-surface/10 animate-pulse" />
                <div className="h-2 w-6 bg-on-surface/10 animate-pulse" />
              </div>
            </div>

            <div className="p-4 pt-0 mt-auto flex justify-between items-end">
              <div className="flex flex-col gap-2">
                <div className="h-2 w-8 bg-on-surface/10 animate-pulse" />
                <div className="h-5 w-16 bg-on-surface/10 animate-pulse" />
              </div>

              <div className="h-[26px] w-[52px] bg-on-surface/10 animate-pulse border-2 border-on-surface/20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
