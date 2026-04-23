export interface Product {
  id: number | string;
  name: string;
  price: number;
  image: string | string[];
  description: string;
  badge?: string;
  selled?: boolean;
}
