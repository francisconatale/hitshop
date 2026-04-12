import { Product, Print, apparelProducts, prints } from './types';

export function useApparelProducts(): Product[] {
  return apparelProducts;
}

export function usePrints(): Print[] {
  return prints;
}

export function useProductCard({ product }: { product: Product }) {
  return {
    product,
  };
}

export function usePrintCard({ print }: { print: Print }) {
  return {
    print,
  };
}