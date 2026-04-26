"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import { collectionService } from '@/lib/collections/CollectionService';

interface Identity {
  name: string;
  phone: string;
  notes: string;
}

interface Payment {
  method: string;
  address: string | null;
  pickup: boolean;
}

interface OrderSummary {
  items: { name: string; price: number; quantity: number }[];
  total: number;
}

export interface AssignedContact {
  id: string;
  name: string;
  whatsapp: string;
}

interface CheckoutContextType {
  identity: Identity;
  payment: Payment;
  assignedContact: AssignedContact | null;
  orderId: string | null;
  orderSummary: OrderSummary | null;
  isConfirming: boolean;
  setIdentity: (identity: Identity) => void;
  setPayment: (payment: Payment) => void;
  setAssignedContact: (contact: AssignedContact | null) => void;
  clearCheckout: () => void;
  confirmOrder: (currentPayment?: Payment) => Promise<void>;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const { items, total, clearCart } = useCart();
  const { user, updateUserData, userData } = useAuth();
  
  const [identity, setIdentity] = useState<Identity>({ name: '', phone: '', notes: '' });
  const [payment, setPayment] = useState<Payment>({ method: 'transfer', address: '', pickup: true });
  const [assignedContact, setAssignedContact] = useState<AssignedContact | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  // Persistence
  useEffect(() => {
    const saved = sessionStorage.getItem('hitshop_checkout_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setIdentity(parsed.identity);
        setPayment(parsed.payment);
        if (parsed.assignedContact) setAssignedContact(parsed.assignedContact);
        if (parsed.orderId) setOrderId(parsed.orderId);
        if (parsed.orderSummary) setOrderSummary(parsed.orderSummary);
      } catch (e) {
        console.error("Error parsing checkout state", e);
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('hitshop_checkout_state', JSON.stringify({
      identity,
      payment,
      assignedContact,
      orderId,
      orderSummary
    }));
  }, [identity, payment, assignedContact, orderId, orderSummary]);

  const clearCheckout = useCallback(() => {
    setIdentity({ name: '', phone: '', notes: '' });
    setPayment({ method: 'transfer', address: '', pickup: true });
    setAssignedContact(null);
    setOrderId(null);
    setOrderSummary(null);
    setIsConfirming(false);
    sessionStorage.removeItem('hitshop_checkout_state');
  }, []);

  // Listener para cerrar sesión
  useEffect(() => {
    const handleLogout = () => clearCheckout();
    window.addEventListener('user-logout', handleLogout);
    return () => window.removeEventListener('user-logout', handleLogout);
  }, [clearCheckout]);

  const confirmOrder = useCallback(async (currentPayment?: Payment) => {
    if (isConfirming) return;
    
    setIsConfirming(true);
    const newOrderId = `HS-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const finalPayment = currentPayment || payment;
    
    console.log("Iniciando confirmOrder para:", newOrderId);

    // Guardar resumen para el comprobante
    const summary = {
      items: items.map(i => ({ name: i.name, price: i.price, quantity: 1 })),
      total
    };
    setOrderSummary(summary);

    // 1. Guardar datos del usuario SOLO si no los tenía previamente
    try {
      const updates: any = {};
      if (!userData?.name && identity.name) updates.name = identity.name;
      if (!userData?.phone && identity.phone) updates.phone = identity.phone;

      if (Object.keys(updates).length > 0) {
        console.log("Actualizando perfil de usuario:", updates);
        await updateUserData(updates);
      }
    } catch (error) {
      console.error("CheckoutContext: Error saving user data:", error);
    }

    // 2. Guardar la orden en Firestore
    try {
      const orderData = {
        id: newOrderId,
        userId: user?.uid || null,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: typeof item.image === 'string' ? item.image : item.image[0],
          category: item.category
        })),
        total,
        identity,
        payment: finalPayment,
        assignedContact: assignedContact || undefined,
        status: 'pending' as const
      };

      console.log("Enviando orden a Firestore:", orderData);
      await collectionService.createOrder(orderData);
      console.log("Orden guardada con éxito");
      
      setOrderId(newOrderId);
      setIsConfirming(false);
    } catch (error) {
      console.error("CheckoutContext: Error creating order:", error);
      setIsConfirming(false);
      throw error;
    }
  }, [clearCart, identity, items, payment, assignedContact, total, updateUserData, user, userData, isConfirming]);

  return (
    <CheckoutContext.Provider value={{
      identity,
      payment,
      assignedContact,
      orderId,
      orderSummary,
      isConfirming,
      setIdentity,
      setPayment,
      setAssignedContact,
      clearCheckout,
      confirmOrder
    }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) throw new Error('useCheckout must be used within CheckoutProvider');
  return context;
}
