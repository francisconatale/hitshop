"use client";

import React from 'react';
import { useSystemUI } from '@/context/SystemUIContext';
import { cn } from '@/lib/utils';
import { ShoppingCart, Trash, WarningCircle, Info } from '@phosphor-icons/react';

export function SystemNotification() {
  const { notification } = useSystemUI();
  const [mounted, setMounted] = React.useState(false);
  
  const [activeNotification, setActiveNotification] = React.useState(notification);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (notification) {
      setActiveNotification(notification);
      // Give React a tick to mount the hidden element, then trigger the CSS transition
      setTimeout(() => {
        setIsVisible(true);
      }, 50);
    } else if (activeNotification) {
      setIsVisible(false);
      // Wait for exit transition to finish before removing from DOM
      const t = setTimeout(() => {
        setActiveNotification(null);
      }, 200);
      return () => clearTimeout(t);
    }
  }, [notification]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[9999999] pointer-events-none flex flex-col items-end justify-end p-6 sm:p-8 overflow-hidden" style={{ zIndex: 9999999, pointerEvents: 'none' }}>
      {activeNotification && (
        <div
          key={activeNotification.id}
          className={cn(
            "w-auto max-w-[300px] px-4 py-3 border border-on-surface/20 rounded-sm pointer-events-auto flex items-center gap-3 bg-surface shadow-xl",
            "transition-all duration-300 ease-out",
            isVisible ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0",
            activeNotification.type === 'add' ? "bg-surface text-on-surface" : 
            activeNotification.type === 'error' ? "bg-error text-on-error" : "bg-surface text-on-surface"
          )}
        >
          <div className="flex-shrink-0 flex items-center justify-center">
            {activeNotification.type === 'add' ? <ShoppingCart size={20} weight="fill" className="text-primary-fixed" /> : 
             activeNotification.type === 'remove' ? <Trash size={20} weight="duotone" className="text-on-surface/60" /> : 
             activeNotification.type === 'error' ? <WarningCircle size={20} weight="fill" /> : 
             <Info size={20} weight="duotone" className="text-on-surface/60" />}
          </div>
          
          <div className="flex-grow pr-2">
            <div className="font-sans text-xs font-bold tracking-tight">
              {activeNotification.message}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
