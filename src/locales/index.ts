export const navItems = [
  { label: "INICIO", href: "/", icon: "home" },
  { label: "GPUs", href: "/gpus", icon: "memory" },
  { label: "CPUs", href: "/cpus", icon: "developer_board" },
  { label: "SISTEMAS", href: "/systems", icon: "desktop_windows" },
  { label: "PERIFÉRICOS", href: "/peripherals", icon: "keyboard" },
];

export const sidebar = {
  title: "HITSHOP",
  subtitle: "POTENCIA PURA",
};

export const productTexts = {
  heroTitle: "SYSTEM HARDWARE",
  heroDescription: "RAW PERFORMANCE. SILICON, POWER, AND THERMALS PUSHED TO THEIR LIMITS. NO COMPROMISES.",
  dropLabel: "Drop 01 / Vol 01",
  footerBigText: ["POTENCIA", "PURA", "SILICIO"] as const,
  copyright: "2026 SYSTEM HARDWARE",
  footerLinks: {
    terms: "Términos",
    shipping: "Envíos",
    instagram: "Instagram",
  },
  addButton: "RESERVAR",
};

export const ticker = [
  { label: "POTENCIA", value: "SILICIO PURO", color: "text-on-surface" },
  { label: "ESTADO", value: "SISTEMA ESTABLE", color: "text-on-surface" },
  { label: "ACTIVOS", value: "SOLO VERIFICADOS", color: "text-on-surface" },
  { label: "DROP", value: "01 DISPONIBLE", color: "text-error font-black" },
];

export const cartTexts = {
  steps: {
    selection: "01_SELECCIÓN",
    validation: "02_VALIDACIÓN",
    procurement: "03_ADQUISICIÓN",
  },
  socialProof: {
    log: "LOG: +42 ACTIVOS ADQUIRIDOS VÍA ESTE NODO EN LAS ÚLTIMAS 24H",
    status: "ESTADO_NODO: ONLINE // CANAL ENCRIPTADO",
  },
  cta: {
    execute: "ASEGURAR ACTIVOS VÍA WHATSAPP",
    warning: "ACTIVOS NO RESERVADOS HASTA LA ADQUISICIÓN",
  }
};
