export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  badge?: string;
}

export interface Print {
  id: number;
  name: string;
  price: number;
  image: string;
  series: string;
}

export const apparelProducts: Product[] = [
  {
    id: 1,
    name: "T-SHIRT",
    price: 45,
    image: "https://picsum.photos/seed/tshirt1/400/500",
    description: "Heavyweight 320GSM single jersey. Oversized architectural fit.",
    badge: "Limited Edition",
  },
  {
    id: 2,
    name: "TORIFF",
    price: 30,
    image: "https://picsum.photos/seed/toriff1/400/500",
    description: "Technical windbreaker with laser-cut ventilation and neon piping.",
    badge: "Pre-Order Now",
  },
  {
    id: 3,
    name: "ETHAN REE JAN",
    price: 60,
    image: "https://picsum.photos/seed/ethan1/400/500",
    description: "Raw selvedge denim. Straight leg, high-waisted reconstruction.",
    badge: "Pre-Order Now",
  },
];

export const prints: Print[] = [
  { id: 4, name: "ETHAN GEN", price: 120, image: "https://picsum.photos/seed/ethangen/400/400", series: "SERIES A" },
  { id: 5, name: "CRETTIC MELL", price: 145, image: "https://picsum.photos/seed/crettic/400/400", series: "SERIES A" },
  { id: 6, name: "RUSK CHEW", price: 110, image: "https://picsum.photos/seed/ruskchew/400/400", series: "SERIES B" },
];