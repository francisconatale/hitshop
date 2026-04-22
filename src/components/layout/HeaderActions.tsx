"use client";
import { useAuth } from "@/context/AuthContext";

export default function HeaderActions() {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-3xl cursor-pointer hover:bg-primary-container transition-colors p-2">
          search
        </span>
        
        {user ? (
          <div className="flex items-center gap-2 group relative">
            <div className="flex flex-col items-end">
              <span className="font-black uppercase text-[10px] tracking-widest opacity-50">Authorized_Node</span>
              <span className="font-black uppercase text-xs">
                {user.displayName || user.email?.split('@')[0]}
              </span>
            </div>
            <button 
              onClick={() => logout()}
              className="material-symbols-outlined text-3xl cursor-pointer hover:text-error transition-colors p-2"
              title="Logout"
            >
              logout
            </button>
          </div>
        ) : (
          <button 
            onClick={() => window.location.href = '/login'}
            className="material-symbols-outlined text-3xl cursor-pointer hover:bg-primary-container transition-colors p-2"
          >
            account_circle
          </button>
        )}
      </div>
    </div>
  );
}
