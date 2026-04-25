"use client";

import React, { useEffect, useState } from 'react';
import { SystemUIProvider } from '@/context/SystemUIContext';
import { CartProvider } from '@/context/CartContext';
import { CheckoutProvider } from '@/context/CheckoutContext';
import { AuthProvider } from '@/context/AuthContext';
import { LocalesProvider } from '@/context/LocalesContext';
import { SystemProvider } from '@/context/SystemContext';
import { CartDrawer } from '../cart/CartDrawer';
import { SystemNotification } from '../ui/SystemNotification';
import DevConsole from '@/components/layout/DevConsole';

export function ClientProvidersWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SystemUIProvider>
      <AuthProvider>
        <LocalesProvider>
          <SystemProvider>
            <CartProvider>
              <CheckoutProvider>
                {children}
                {mounted && (
                  <>
                    <CartDrawer />
                    <SystemNotification />
                    <DevConsole />
                  </>
                )}
              </CheckoutProvider>
            </CartProvider>
          </SystemProvider>
        </LocalesProvider>
      </AuthProvider>
    </SystemUIProvider>
  );
}
