"use client";

import PageLayout from "@/components/layout/PageLayout";

export default function Loading() {
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto py-12 px-4 space-y-12">
        <header className="animate-pulse">
          <div className="w-24 h-4 bg-on-surface/5 mb-4" />
          <div className="w-64 h-12 bg-on-surface/10 mb-2" />
          <div className="w-80 h-4 bg-on-surface/5" />
        </header>

        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-2 border-on-surface/5 bg-surface h-64 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-on-surface/[0.03] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              <div className="p-4 border-b-2 border-on-surface/5 flex justify-between">
                <div className="w-32 h-4 bg-on-surface/10" />
                <div className="w-24 h-4 bg-on-surface/10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 h-full">
                <div className="md:col-span-4 p-6 border-r-2 border-on-surface/5 space-y-4">
                  <div className="w-full h-4 bg-on-surface/5" />
                  <div className="w-3/4 h-4 bg-on-surface/5" />
                  <div className="w-1/2 h-4 bg-on-surface/5" />
                </div>
                <div className="md:col-span-8 p-6 space-y-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-on-surface/5" />
                    <div className="flex-1 space-y-2">
                      <div className="w-1/2 h-3 bg-on-surface/5" />
                      <div className="w-1/4 h-2 bg-on-surface/5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
