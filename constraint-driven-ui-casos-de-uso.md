# Casos de Uso — constraint-driven-ui

## Escenario A: Crear algo nuevo

**Crear un componente desde cero**
> "Crea un componente de card de producto usando el design system."

**Crear una página completa**
> "Crea la página de checkout usando nuestro DESIGN_SYSTEM.md."

**Crear un sistema de estados**
> "Crea los estados vacío, cargando y error para la lista de pedidos, siguiendo el design system."

**Crear un patrón de navegación**
> "Diseña un sidebar de navegación con el design system del proyecto."

---

## Escenario B: Refactorizar algo existente

**Refactorizar un componente con valores hardcodeados**
> "Refactoriza este botón, tiene colores hardcodeados que no siguen el design system."

**Limpiar drift acumulado**
> "Este componente fue creciendo sin control. Refactorizalo para que vuelva a cumplir con HitShop."

**Migrar a un design system nuevo**
> "Actualizamos el DESIGN_SYSTEM.md. Refactoriza estos tres componentes a la nueva versión."

**Unificar inconsistencias entre componentes**
> "Tengo un Card y un Modal que no se ven consistentes entre sí. Refactorizalos para que compartan los mismos tokens."

---

## Escenario C: Auditar sin modificar

**Auditoría antes de un PR**
> "Auditá este componente y decime si cumple el design system, sin cambiarlo. Lo necesito para el code review."

**Diagnóstico general de un archivo**
> "Revisá este archivo y listá todas las desviaciones del design system. No toques nada todavía."

**Verificar trabajo de un tercero**
> "Un externo entregó este componente. Verificá si respeta nuestras reglas antes de mergearlo."

**Checklist de entrega**
> "Antes de hacer el deploy, confirmame que este componente no tiene ningún drift del design system."

---

## Casos Especiales

**Conflicto entre regla local y accesibilidad**
> "Auditá este componente. Si hay alguna regla del design system que rompa WCAG AA, avisame antes de aplicarla."

**Sin DESIGN_SYSTEM.md disponible**
> "Creá este componente con buenas prácticas de UI/UX generales, no tenemos design system todavía."

**Auditoría parcial (solo un aspecto)**
> "Revisá solo el espaciado de este componente contra el design system, lo demás no importa ahora."

**Comparar dos versiones**
> "Tengo dos versiones de este card. Decime cuál cumple mejor con el design system y por qué."
