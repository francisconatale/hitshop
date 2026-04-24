# PLAN: Refinamiento de Diseño HITSHOP

## Fase 1: Estilos Globales e Interactividad
- [ ] Agregar animaciones de `view-transition` en `globals.css`.
- [ ] Refinar curvas de tiempo para transiciones entre páginas.

## Fase 2: Navegación y Header
- [ ] Agregar links "BUILDS" y "DROPS" en `Header.tsx`.
- [ ] Actualizar `HeaderActions.tsx` para mostrar "BAG [N]" en lugar de íconos.

## Fase 3: Hero Section (ProductGrid.tsx)
- [ ] Crear el panel lateral oscuro (Sidebar) con contraste invertido.
- [ ] Implementar componente de Countdown para urgencia de compra.
- [ ] Reajustar el grid de estado (ahora simplificado) para que conviva con el nuevo sidebar.

## Fase 4: Contenido y Tarjetas
- [ ] Agregar grilla de "Productos Destacados" (3 columnas) bajo el Hero.
- [ ] Implementar hover state en `ProductCard.tsx` (cambio a fondo verde).
- [ ] Asegurar que el scroll fluya naturalmente desde el Hero a los productos.
