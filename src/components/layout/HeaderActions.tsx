"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { CartIcon } from "../cart/CartIcon";

export default function HeaderActions() {
  const { user, userData, logout } = useAuth();
  const isAdmin = userData?.role === 'admin';

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <CartIcon />
        <span className="material-symbols-outlined text-3xl cursor-pointer hover:bg-primary-container transition-colors p-2">
          search
        </span>
        
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 group relative">
              <div className="flex flex-col items-end">
                <span className="font-black uppercase text-[10px] tracking-widest opacity-50">
                  {isAdmin ? 'Admin_Node' : 'Authorized_Node'}
                </span>
                <span className="font-black uppercase text-xs">
                  {userData?.name || user.displayName || user.email?.split('@')[0]}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    className="material-symbols-outlined text-3xl cursor-pointer hover:bg-primary-container transition-colors p-2"
                    title="Admin Panel"
                  >
                    admin_panel_settings
                  </Link>
                )}
                <Link 
                  href="/profile" 
                  className="material-symbols-outlined text-3xl cursor-pointer hover:bg-primary-container transition-colors p-2"
                  title="Profile"
                >
                  person
                </Link>
                <button 
                  onClick={() => logout()}
                  className="material-symbols-outlined text-3xl cursor-pointer hover:text-error transition-colors p-2"
                  title="Logout"
                >
                  logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Link 
            href="/login"
            className="material-symbols-outlined text-3xl cursor-pointer hover:bg-primary-container transition-colors p-2"
          >
            account_circle
          </Link>
        )}
      </div>
    </div>
  );
}
