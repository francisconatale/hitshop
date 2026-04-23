"use client";

import { useAuth } from "@/context/AuthContext";
import PageLayout from "@/components/layout/PageLayout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AdminPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  const isAdmin = userData?.role === 'admin';

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!isAdmin) {
        router.push("/");
      }
    }
  }, [user, userData, loading, router, isAdmin]);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <span className="font-black uppercase tracking-widest animate-pulse">Accessing_Secure_Node...</span>
        </div>
      </PageLayout>
    );
  }

  if (!user || !isAdmin) return null;

  const adminModules = [
    {
      title: "Product_Management",
      description: "Inventory upload, modification and catalog sync.",
      icon: "inventory_2",
      link: "/admin/products",
      status: "Operational"
    },
    {
      title: "Order_Logistics",
      description: "Transaction monitoring and fulfillment processing.",
      icon: "local_shipping",
      link: "/admin/orders",
      status: "Idle"
    },
    {
      title: "User_Registry",
      description: "Node permissions and authentication logs.",
      icon: "group",
      link: "/admin/users",
      status: "Secured"
    },
    {
      title: "System_Analytics",
      description: "Performance metrics and data visualization.",
      icon: "analytics",
      link: "/admin/analytics",
      status: "Processing"
    }
  ];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto py-12 px-4">
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-3 h-3 bg-error rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-error">System_Live_Terminal</span>
              </div>
              <h1 className="text-6xl font-black uppercase tracking-tighter italic leading-none">
                Admin_Panel
              </h1>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs opacity-50 uppercase tracking-widest">Operator: {user.email}</p>
              <p className="font-mono text-xs opacity-50 uppercase tracking-widest">Access_Level: Root_Admin</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminModules.map((module) => (
            <Link 
              key={module.title}
              href={module.link}
              className="group bg-surface-variant border border-outline-variant p-8 hover:border-primary transition-all duration-300 flex flex-col justify-between h-64 relative overflow-hidden"
            >
              <div className="relative z-10">
                <span className="material-symbols-outlined text-4xl mb-6 block group-hover:scale-110 transition-transform">
                  {module.icon}
                </span>
                <h2 className="text-xl font-black uppercase tracking-tight mb-2 italic">
                  {module.title}
                </h2>
                <p className="text-xs opacity-60 leading-relaxed font-medium">
                  {module.description}
                </p>
              </div>
              
              <div className="relative z-10 flex items-center justify-between mt-6">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                  Status: {module.status}
                </span>
                <span className="material-symbols-outlined text-xl opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all">
                  arrow_forward
                </span>
              </div>

              {/* Decorative background element */}
              <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                 <span className="material-symbols-outlined text-[120px]">
                  {module.icon}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-12 bg-surface-variant border border-outline-variant p-8">
           <div className="flex items-center justify-between mb-8 border-b border-outline-variant pb-4">
             <h2 className="text-2xl font-black uppercase tracking-tighter italic">Recent_System_Logs</h2>
             <button className="text-[10px] font-black uppercase tracking-widest border border-outline-variant px-4 py-2 hover:bg-primary hover:text-on-primary transition-colors">
               View_All_Logs
             </button>
           </div>
           <div className="space-y-4 font-mono text-[11px] opacity-60">
             <p>[OK] Authenticated admin node: {user.uid.substring(0,8)}... at {new Date().toLocaleTimeString()}</p>
             <p>[INFO] Catalog sync completed. 142 items online.</p>
             <p>[WARN] High traffic detected on /category/tech.</p>
           </div>
        </section>
      </div>
    </PageLayout>
  );
}
