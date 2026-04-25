"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAuthForm } from '@/hooks/useAuthForm';

export default function RegisterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { 
    displayName, setDisplayName,
    email, setEmail, 
    password, setPassword, 
    error, isSubmitting, 
    handleAuth 
  } = useAuthForm('register');

  // Redirigir si ya está logueado
  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-16 h-16 border-8 border-on-surface border-t-primary-container animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border-8 border-on-surface p-10 brutal-shadow relative">
        <form onSubmit={(e) => handleAuth('email', e)} className="space-y-4 mt-6">
          {error && (
            <div className="bg-error text-surface border-4 border-on-surface p-3 font-black uppercase text-xs animate-pulse">
              {`> ERROR: ${error}`}
            </div>
          )}

          <div>
            <label className="block text-on-surface font-black uppercase tracking-widest text-[10px] mb-2 opacity-50">Email_Identidad</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container border-4 border-on-surface p-4 font-black uppercase text-lg focus:outline-none focus:border-primary-container transition-all placeholder:opacity-20"
              placeholder="USUARIO@SISTEMA.COM"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-on-surface font-black uppercase tracking-widest text-[10px] mb-2 opacity-50">Nombre_Identidad</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-surface-container border-4 border-on-surface p-4 font-black uppercase text-lg focus:outline-none focus:border-primary-container transition-all placeholder:opacity-20"
              placeholder="NOMBRE_USUARIO"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-on-surface font-black uppercase tracking-widest text-[10px] mb-2 opacity-50">Clave_De_Acceso</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container border-4 border-on-surface p-4 font-black uppercase text-lg focus:outline-none focus:border-primary-container transition-all placeholder:opacity-20"
              placeholder="********"
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-4 font-black uppercase text-xl border-4 border-on-surface transition-all flex items-center justify-center gap-4 mt-4 ${
              isSubmitting 
              ? 'bg-on-surface-variant text-on-surface/30 cursor-not-allowed' 
              : 'bg-on-surface text-surface hover:bg-primary-container hover:text-on-surface active:translate-x-1 active:translate-y-1'
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="w-5 h-5 border-4 border-on-surface border-t-transparent animate-spin rounded-full" />
                Inicializando...
              </>
            ) : 'Ejecutar_Inyección'}
          </button>
        </form>

        <div className="mt-10 flex flex-col gap-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-4 border-on-surface/20"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
              <span className="bg-surface px-4 text-on-surface/40">Autenticación_Alternativa</span>
            </div>
          </div>

          <button
            onClick={() => handleAuth('google')}
            disabled={isSubmitting}
            className={`w-full p-4 font-black uppercase text-lg border-4 border-on-surface transition-all flex items-center justify-center gap-4 ${
              isSubmitting
              ? 'bg-on-surface/5 opacity-50 cursor-not-allowed'
              : 'bg-on-surface text-surface hover:bg-primary-container hover:text-on-surface'
            }`}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" />
            </svg>
            Google_Oauth
          </button>
        </div>

        <div className="mt-8 pt-6 border-t-2 border-on-surface/10 text-center">
          <p className="font-black uppercase text-[10px] tracking-widest opacity-50">
            ¿Nodo activo?{' '}
            <Link href="/login" className="text-on-surface hover:text-primary-container transition-colors underline underline-offset-4 decoration-4">
              Acceder_Al_Sistema
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
