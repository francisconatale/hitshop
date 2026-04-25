"use client";

import AuthGuard from "@/components/layout/AuthGuard";
import { Suspense } from "react";
import { AdminSkeleton } from "@/components/ui/AdminSkeleton";
import PageLayout from "@/components/layout/PageLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireAdmin>
      <Suspense fallback={<PageLayout><AdminSkeleton /></PageLayout>}>
        {children}
      </Suspense>
    </AuthGuard>
  );
}
