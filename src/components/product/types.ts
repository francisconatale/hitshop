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

// Este objeto ahora actúa como nuestro Mock DB centralizado
export const initialProductsData = {
  cpus: [
    {
      id: 101,
      name: "CORE-X 9000",
      price: 599,
      image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1000&auto=format&fit=crop",
      description: "16 Cores, 32 Threads. 5.4GHz Boost. Extreme overclocking potential.",
      badge: "In Stock"
    },
    {
      id: 102,
      name: "RYZEN-ULTRA",
      price: 449,
      image: "https://images.unsplash.com/photo-1555617766-c94804975da3?q=80&w=1000&auto=format&fit=crop",
      description: "Efficiency meets raw power. Zen 5 Architecture. Low thermals.",
      badge: "Popular"
    }
  ],
  gpus: [
    {
      id: 201,
      name: "RTX-TITAN X",
      price: 1599,
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1000&auto=format&fit=crop",
      description: "24GB VRAM. Ray Tracing Overdrive. The ultimate rendering beast.",
      badge: "High Demand"
    },
    {
      id: 202,
      name: "RX-OVERCLOCK",
      price: 899,
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1000&auto=format&fit=crop",
      description: "Open source performance. Fluid Motion Frames 3. Cool under pressure.",
      badge: "New Release"
    }
  ],
  apparel: apparelProducts,
  peripherals: prints
};
