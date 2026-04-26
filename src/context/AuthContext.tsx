"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "firebase/auth";
import { authService } from "@/lib/auth/auth";
import { collectionService } from "@/lib/collections/CollectionService";
import { UserData } from "@/lib/collections/AuthCollection";

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  logout: () => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const data = await collectionService.getUser(currentUser.uid);
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await authService.logout();
    setUserData(null);
    window.dispatchEvent(new Event('user-logout'));
  };

  const updateUserData = async (data: Partial<UserData>) => {
    if (!user) return;
    try {
      await collectionService.updateUser(user.uid, data);
      setUserData(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error("AuthContext: Error updating user data:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, logout, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
