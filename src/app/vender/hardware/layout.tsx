import AuthGuard from "@/components/layout/AuthGuard";

export default function VenderHardwareLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}
