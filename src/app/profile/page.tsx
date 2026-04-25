"use client";

import { useAuth } from "@/context/AuthContext";
import { useSystemUI } from "@/context/SystemUIContext";
import PageLayout from "@/components/layout/PageLayout";
import AuthGuard from "@/components/layout/AuthGuard";
import Link from "next/link";
import { useState, useEffect } from "react";
import { collectionService } from "@/lib/collections/CollectionService";
import { Order } from "@/lib/collections/OrdersCollection";
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user, userData, updateUserData } = useAuth();
  const { showNotification } = useSystemUI();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [form, setForm] = useState({
    name: "",
    phone: ""
  });

  useEffect(() => {
    if (userData) {
      setForm({
        name: userData.name || "",
        phone: userData.phone || ""
      });
    }
  }, [userData]);

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      const data = await collectionService.getUserOrders(user!.uid);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching user orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUserData(form);
      showNotification("Profile_Updated_Successfully", "system");
      setIsEditing(false);
    } catch (error) {
      showNotification("Update_Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    pending: 'text-primary-fixed',
    processing: 'text-tertiary',
    completed: 'text-success',
    cancelled: 'text-error'
  };

  const inputStyles = "w-full bg-on-surface/[0.05] border-2 border-on-surface/10 focus:border-primary px-4 py-2 text-sm font-mono uppercase tracking-widest outline-none transition-all";

  return (
    <AuthGuard>
      <PageLayout>
        <div className="max-w-4xl mx-auto py-12 md:py-20 px-4">
          <header className="mb-12 border-b-2 border-on-surface pb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-primary-fixed flex items-center justify-center border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="material-symbols-outlined text-6xl text-on-surface">person</span>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-black uppercase tracking-tighter italic">
                  {userData?.name || user?.displayName || "User_Profile"}
                </h1>
                <p className="text-[10px] opacity-40 font-mono tracking-[0.3em] uppercase mt-2">
                  Node_ID: {user?.uid}
                </p>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {userData?.role === 'admin' && (
              <section className="md:col-span-2 bg-primary-fixed/10 border-2 border-on-surface p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                  <span className="material-symbols-outlined text-8xl">shield_person</span>
                </div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-on-surface text-surface flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl">terminal</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight italic">Privileged_Access_Detected</h2>
                    <p className="text-[10px] font-mono opacity-70 uppercase tracking-widest">Administrative privileges active // Root_Access</p>
                  </div>
                </div>
                <Link 
                  href="/admin"
                  className="bg-on-surface text-surface px-8 py-3 font-black uppercase text-xs tracking-[0.2em] hover:bg-primary-fixed hover:text-on-surface transition-all border-2 border-on-surface brutal-shadow-primary relative z-10"
                >
                  Go_To_Admin_Console
                </Link>
              </section>
            )}

            <section className="bg-surface p-8 border-2 border-on-surface space-y-6">
              <h2 className="text-xl font-black uppercase tracking-tight border-b-2 border-on-surface/10 pb-2">
                Identity_Parameters
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Identity_Label (Full Name)</label>
                  {isEditing ? (
                    <input 
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={inputStyles}
                    />
                  ) : (
                    <p className="font-bold text-lg">{userData?.name || "NOT_SET"}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Comm_Link (Phone)</label>
                  {isEditing ? (
                    <input 
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={inputStyles}
                      placeholder="+54..."
                    />
                  ) : (
                    <p className="font-bold text-lg">{userData?.phone || "NOT_SET"}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Access_Key (Email)</label>
                  <p className="font-bold text-lg opacity-60">{user?.email}</p>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-on-surface/10">
                {isEditing ? (
                  <div className="flex gap-4">
                    <button 
                      onClick={handleSave}
                      disabled={loading}
                      className="bg-on-surface text-surface px-6 py-3 font-black uppercase text-xs tracking-widest hover:bg-primary-fixed hover:text-on-surface transition-all border-2 border-on-surface brutal-shadow-primary disabled:opacity-50"
                    >
                      {loading ? "SAVING..." : "COMMIT_CHANGES"}
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditing(false);
                        setForm({
                          name: userData?.name || "",
                          phone: userData?.phone || ""
                        });
                      }}
                      className="px-6 py-3 font-black uppercase text-xs tracking-widest hover:bg-on-surface/5 transition-all"
                    >
                      ABORT
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="bg-on-surface text-surface px-6 py-3 font-black uppercase text-xs tracking-widest hover:bg-primary-fixed hover:text-on-surface transition-all border-2 border-on-surface brutal-shadow-primary"
                  >
                    Edit_Profile_Parameters
                  </button>
                )}
              </div>
            </section>

            <section className="bg-surface p-8 border-2 border-on-surface flex flex-col justify-between">
              <div className="space-y-6">
                <h2 className="text-xl font-black uppercase tracking-tight border-b-2 border-on-surface/10 pb-2">
                  System_Status
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Node_Permissions</label>
                    <p className="font-black uppercase tracking-widest text-primary-fixed bg-on-surface px-3 py-1 inline-block mt-1">
                      {userData?.role || 'user'}
                    </p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Initialization_Date</label>
                    <p className="font-bold font-mono uppercase text-sm">
                      {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'TIMESTAMP_UNKNOWN'}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Order History */}
          <section className="bg-surface border-2 border-on-surface p-8">
            <h2 className="text-2xl font-black uppercase tracking-tighter italic mb-8 border-b-2 border-on-surface pb-4">
              Order_History
            </h2>

            {loadingOrders ? (
              <div className="py-12 flex justify-center">
                <span className="font-mono text-[10px] uppercase tracking-[0.5em] animate-pulse">Syncing_Records...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center opacity-30 italic font-mono text-sm uppercase tracking-widest">
                No_Transactions_Recorded_On_This_Node
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border-2 border-on-surface p-6 flex flex-col md:flex-row justify-between gap-6 hover:bg-on-surface/[0.02] transition-colors">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs font-black text-primary-fixed">#{order.id}</span>
                        <span className="text-[10px] font-mono opacity-40 uppercase tracking-widest">
                          {order.createdAt?.toDate ? format(order.createdAt.toDate(), 'yyyy.MM.dd') : 'PENDING_TS'}
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {order.items.slice(0, 3).map((item, i) => (
                          <div key={i} className="w-10 h-10 border border-on-surface/10 p-1 bg-white">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-10 h-10 border border-on-surface/10 flex items-center justify-center font-mono text-[10px] opacity-40">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col justify-end items-end gap-2">
                      <span className="text-[9px] font-mono opacity-40 uppercase tracking-widest">Total_Valuation</span>
                      <span className="text-2xl font-black tabular-nums tracking-tighter">${order.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </PageLayout>
    </AuthGuard>
  );
}
