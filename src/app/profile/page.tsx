"use client";

import { useAuth } from "@/context/AuthContext";
import PageLayout from "@/components/layout/PageLayout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <span className="font-black uppercase tracking-widest animate-pulse">Loading_Profile...</span>
        </div>
      </PageLayout>
    );
  }

  if (!user) return null;

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto py-20 px-4">
        <header className="mb-12 border-b border-outline-variant pb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-primary-container flex items-center justify-center rounded-full">
              <span className="material-symbols-outlined text-6xl text-primary">person</span>
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter italic">
                {userData?.name || user.displayName || "User_Profile"}
              </h1>
              <p className="text-sm opacity-50 font-mono tracking-widest uppercase">
                UID: {user.uid}
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Admin Quick Access - Solo visible para administradores */}
          {userData?.role === 'admin' && (
            <section className="md:col-span-2 bg-primary/5 border border-primary/20 p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary text-on-primary flex items-center justify-center rounded-sm">
                  <span className="material-symbols-outlined text-3xl">terminal</span>
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight italic">Privileged_Access_Detected</h2>
                  <p className="text-xs opacity-70 font-medium">Your node has root privileges. Access the administrative terminal to manage the system.</p>
                </div>
              </div>
              <Link 
                href="/admin"
                className="bg-primary text-on-primary px-8 py-3 font-black uppercase text-xs tracking-[0.2em] hover:opacity-90 transition-all flex items-center gap-2"
              >
                Go_To_Admin_Console
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </section>
          )}

          <section className="bg-surface-variant p-8 border border-outline-variant">
            <h2 className="text-xl font-black uppercase tracking-tight mb-6 border-b border-outline-variant pb-2">
              System_Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Email_Address</label>
                <p className="font-bold">{user.email}</p>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Account_Type</label>
                <p className="font-bold uppercase tracking-widest text-primary">{userData?.role || 'user'}</p>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Member_Since</label>
                <p className="font-bold">{userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </section>

          <section className="bg-surface-variant p-8 border border-outline-variant flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight mb-6 border-b border-outline-variant pb-2">
                User_Activity
              </h2>
              <p className="opacity-70 italic text-sm">No recent activity detected on this node.</p>
            </div>
            
            <div className="mt-8 pt-8 border-t border-outline-variant flex gap-4">
               <button className="bg-primary text-on-primary px-6 py-2 font-black uppercase text-xs tracking-widest hover:opacity-90 transition-opacity">
                 Edit_Profile
               </button>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
