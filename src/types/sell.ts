import { PublicProduct } from "@/types/product";

export interface SellRequest {
  id: string;
  userId?: string;
  createdAt: Date;
  status: 'pending' | 'accepted' | 'completed';

  // Hardware Proposal
  marca: string;
  modelo: string;
  categoria: 'gpus' | 'cpus' | 'motherboards' | 'ram' | 'storage';
  uso: 'gaming' | 'minado' | 'oficina' | 'otro';
  tempCarga: number;
  tieneCaja: boolean;
  tieneFactura: boolean;
  descripcion?: string;

  // Evidence
  images: string[];

  // Contact
  sellerName: string;
  sellerContact: string; // WhatsApp o Instagram

  // Admin response
  quotation?: number | null;
}
