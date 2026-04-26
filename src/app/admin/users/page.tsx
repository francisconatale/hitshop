"use client";

import React, { useEffect, useState } from 'react';
import PageLayout from "@/components/layout/PageLayout";
import { collectionService } from "@/lib/collections/CollectionService";
import { UserData } from "@/lib/collections/AuthCollection";
import Link from 'next/link';
import { format } from 'date-fns';
import { AdminSkeleton } from '@/components/ui/AdminSkeleton';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingUid, setDeletingUid] = useState<string | null>(null);
  const [creatingContactUid, setCreatingContactUid] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await collectionService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContact = async (user: UserData) => {
    const name = user.name || user.displayName || 'Anónimo';
    const phone = user.phone || '';

    if (!phone) {
      alert("ERROR: NODO_SIN_COMMLINK (El usuario no tiene teléfono registrado)");
      return;
    }

    setCreatingContactUid(user.uid);
    try {
      await collectionService.createContact({
        name,
        phone,
        whatsapp: phone,
        email: user.email || undefined
      });
      alert(`PROTOCOLO_EXITOSO: ${name.toUpperCase()} agregado como contacto logístico.`);
    } catch (error) {
      console.error("Error creating contact:", error);
      alert("ERROR: FALLO_EN_LA_CREACIÓN_DEL_CONTACTO");
    } finally {
      setCreatingContactUid(null);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (!window.confirm("ACCIÓN_CRÍTICA: ¿PURGAR_DATOS_DE_USUARIO_DEL_SISTEMA?")) return;
    
    setDeletingUid(uid);
    try {
      await collectionService.deleteUser(uid);
      setUsers(prev => prev.filter(u => u.uid !== uid));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("ERROR: FALLO_EN_LA_PURGA_DEL_NODO");
    } finally {
      setDeletingUid(null);
    }
  };

  if (loading) return <PageLayout><AdminSkeleton /></PageLayout>;

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto py-12 px-4">
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin" className="text-xs font-black uppercase tracking-widest opacity-50 hover:opacity-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              VOLVER_AL_PANEL
            </Link>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic">Registro_De_Nodos</h1>
          <p className="font-mono text-xs opacity-50 uppercase tracking-[0.3em] mt-2">Gestionando accesos autenticados y roles del sistema</p>
        </header>

        <div className="border-2 border-on-surface bg-surface overflow-hidden brutal-shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-on-surface text-surface font-mono text-[10px] uppercase tracking-[0.3em]">
                  <th className="p-4 border-r border-surface/20">Nodo_De_Identidad</th>
                  <th className="p-4 border-r border-surface/20">Enlace_Comunicación</th>
                  <th className="p-4 border-r border-surface/20">Nivel_De_Autenticación</th>
                  <th className="p-4 border-r border-surface/20">Fecha_Sincronización</th>
                  <th className="p-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-on-surface/10">
                {users.map((user) => (
                  <tr key={user.uid} className="hover:bg-on-surface/[0.02] transition-colors">
                    <td className="p-4 border-r-2 border-on-surface/5">
                      <div className="flex flex-col">
                        <span className="font-black uppercase text-sm">{user.name || user.displayName || 'Anónimo'}</span>
                        <span className="font-mono text-[9px] opacity-40 uppercase tracking-tighter">UID_{user.uid.substring(0,12)}...</span>
                      </div>
                    </td>
                    <td className="p-4 border-r-2 border-on-surface/5">
                      <span className="font-mono text-xs opacity-70">{user.email || 'SIN_EMAIL'}</span>
                      {user.phone && <p className="font-mono text-[10px] opacity-40">{user.phone}</p>}
                    </td>
                    <td className="p-4 border-r-2 border-on-surface/5">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 ${user.role === 'admin' ? 'bg-primary-fixed text-on-surface' : 'bg-on-surface/10 opacity-60'}`}>
                        {user.role === 'admin' ? 'ADMIN' : 'USUARIO'}
                      </span>
                    </td>
                    <td className="p-4 border-r-2 border-on-surface/5">
                      <span className="font-mono text-[10px] opacity-40">
                        {user.createdAt ? format(new Date(user.createdAt), 'yyyy.MM.dd') : 'NODO_LEGADO'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleCreateContact(user)}
                          disabled={creatingContactUid === user.uid}
                          className={`text-primary-fixed hover:bg-primary-fixed hover:text-on-surface p-1 transition-colors ${creatingContactUid === user.uid ? 'animate-pulse' : ''}`}
                          title="GENERAR_CONTACTO_LOGÍSTICO"
                        >
                          <span className="material-symbols-outlined text-lg">person_add</span>
                        </button>

                        <button 
                          onClick={() => handleDeleteUser(user.uid)}
                          disabled={deletingUid === user.uid}
                          className="text-error hover:bg-error hover:text-on-error p-1 transition-colors"
                          title="PURGAR_NODO"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
