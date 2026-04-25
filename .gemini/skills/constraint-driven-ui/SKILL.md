---
name: constraint-driven-ui
description: >
  Diseño y auditoría de UI/UX con cumplimiento estricto del design system local.
  Usa esta skill siempre que el usuario quiera crear, modificar, auditar o refactorizar
  componentes de interfaz. Se activa automáticamente cuando hay un DESIGN_SYSTEM.md
  en el workspace. Combina principios senior de UX (jerarquía, Gestalt, Nielsen)
  con cumplimiento total de los tokens y restricciones locales del proyecto.
  Úsala también cuando el usuario pida "revisar si cumple el design system",
  "crear un componente nuevo", "auditar sin tocar" o "refactorizar según nuestras reglas".
---

# Constraint-Driven UI

Esta skill fusiona criterio de diseño senior con cumplimiento estricto de las reglas
locales del proyecto. No tiene estética propia: su salida siempre refleja el
`DESIGN_SYSTEM.md` del workspace.

---

## Paso 0 — Autodescubrimiento (SIEMPRE PRIMERO)

Antes de cualquier otra acción, el agente DEBE:

1. Buscar `DESIGN_SYSTEM.md` en la raíz del proyecto y leerlo completo.
2. Listar skills en `.gemini/skills/` que refieran a Design Systems, Branding, Architecture o Standards, y leerlas.
3. Extraer la lista de restricciones activas (colores, espaciado, radios, tipografía, nomenclatura, etc.).
4. Si no existe `DESIGN_SYSTEM.md`, preguntar al usuario antes de continuar:
   > "No encontré un DESIGN_SYSTEM.md. ¿Querés que trabaje con principios genéricos o tenés las restricciones en otro archivo?"

**Nunca diseñes antes de completar este paso.** Las restricciones locales son la fuente de verdad; el criterio UX genérico solo opera dentro de ellas.

---

## Jerarquía de Prioridad

```
1. Accesibilidad crítica (WCAG AA mínimo)           ← nunca se viola
2. Arquitectura de Información (Orden Lógico)       ← EL DATO ES EL REY
3. Restricciones del DESIGN_SYSTEM.md               ← anulan preferencia estética
4. Principios UX universales (Gestalt, Jerarquía)
5. Criterio propio del agente                       ← última prioridad
```

> Si una regla local genera una violación de accesibilidad, **NO la apliques silenciosamente**.
> Reportala como advertencia antes de proceder.

---

## Escenarios de Uso

### Escenario A — Crear algo nuevo
Prompt: *"Crea un componente de [Tipo] usando el design system."*

Flujo:
1. Paso 0 (Autodescubrimiento).
2. **Priorizar el Orden de Datos**: Definir qué información es primaria, secundaria y de apoyo antes de elegir componentes.
3. Aplicar los Cuatro Pilares (ver más abajo) para planificar la estructura.
4. Traducir cada decisión de diseño a los tokens locales.
5. Generar el código.
6. Emitir el Reporte de Cumplimiento.

---

### Escenario B — Arreglar algo existente
Prompt: *"Refactoriza este componente para que cumpla con el design system."*

Flujo:
1. Paso 0 (Autodescubrimiento).
2. Auditoría: comparar el código actual con las restricciones y el **orden lógico de datos**.
3. Clasificar cada desviación:
   - **Local Violation**: usa un patrón que contradice una regla local.
   - **Architecture Drift**: el orden de los datos confunde o interrumpe la tarea principal.
   - **Project Drift**: usa un estándar genérico cuando existe uno específico.
4. Refactorizar asegurando el cumplimiento de tokens y estructura lógica.
5. Emitir el Reporte de Cumplimiento.

---

### Escenario C — Auditar sin modificar
Prompt: *"Auditá este componente y decime si cumple el design system, sin cambiarlo."*

Flujo:
1. Paso 0 (Autodescubrimiento).
2. Analizar el código, el flujo visual y el orden de los datos.
3. Emitir el Reporte de Cumplimiento detallando desviaciones visuales y estructurales.

---

## Los Cuatro Pilares de Auditoría UX

Aplicar siempre en la fase de diseño/análisis, **filtrados por las restricciones locales**:

### 1. Arquitectura de Información (EL MÁS IMPORTANTE)
- **Orden Lógico**: ¿Los datos siguen el flujo mental del usuario? (ej: Título -> Precio -> Acción).
- **Proximidad Semántica**: Agrupar datos relacionados (Precio + Descuento + Botón de Pago).
- **Escaneabilidad**: ¿Se entiende la jerarquía de la información en 3 segundos?

### 2. Visual Hierarchy & Gestalt
- Whitespace activo: empezar con "demasiado" espacio y ajustar al token del sistema.
- Tamaño y peso: headings 1.5–2× el body. Máximo 3 pesos tipográficos.
- Flujo visual: ¿el ojo va naturalmente del hook (H1) a la acción (CTA)?

### 3. Usabilidad (Heurísticas de Nielsen — top 3)
- **Visibilidad del estado**: ¿Está claro qué está pasando? (loading, empty, error).
- **Consistencia y estándares**: ¿Sigue patrones de la industria?
- Carga cognitiva mínima (Ley de Hick): No abrumar con datos irrelevantes antes de la acción.

### 4. Consistencia Sistemática
- Sin valores hardcodeados: usar solo variables semánticas (`--color-primary`, etc.).
- Estructura atómica: ¿los componentes son modulares y reutilizables?

### 5. Patrones Estructurales Específicos
- **Fixed Viewport**: Obligatorio en flujos transaccionales (Checkout/Success). Prohibido el scroll global de página. Usar rejilla con scroll interno en la columna de datos densos y barra lateral de acciones fija.
- **Admin Protocol**: Representación de IDs en `font-mono text-[9px] opacity-40`. Acciones críticas siempre con confirmación técnica y colores de error.
- **Print Safety**: Ocultar navegación global y eliminar decoraciones de sombra/borde externo en modo impresión.

---

## Reporte de Cumplimiento (formato estándar)

Al finalizar cualquier tarea, emitir siempre este reporte:

```
## ✅ Reporte de Cumplimiento — [Nombre del Componente]

### Skills/Archivos consultados
- DESIGN_SYSTEM.md (vX.X)

### 📂 Arquitectura de Información (Orden de Datos)
| Prioridad | Dato / Bloque | Estado | Observación |
|-----------|---------------|--------|-------------|
| 1 (Primary)| [Ej: Título]  | ✅/⚠️ | [Nota sobre el orden] |
| 2 (Action) | [Ej: CTA]     | ✅/⚠️ | [Nota sobre proximidad] |

### 🎨 Tokens aplicados
| Propiedad       | Token usado           | Valor resuelto | Estado |
|-----------------|-----------------------|----------------|--------|
| Color primario  | --color-brand-500     | #3B6CF4        | ✅     |
| ...             | ...                   | ...            | ✅     |

### ⚠️ Desviaciones encontradas
| Elemento        | Problema              | Tipo           | Acción |
|-----------------|-----------------------|----------------|--------|
| Orden Bloque X  | Corta flujo visual    | Arch. Drift    | [Acción] |
| .btn-secondary  | color hardcodeado     | Local Violation| [Acción] |

### Advertencias de Accesibilidad
[Lista de advertencias WCAG o "Ninguna"]
```

Si el escenario es C (solo auditoría), el reporte lista las desviaciones pero **no indica "Corregido"** — indica "Pendiente".

---

## Checklist Rápida (antes de entregar cualquier output)

- [ ] ¿Leí el DESIGN_SYSTEM.md antes de diseñar?
- [ ] ¿Todos los valores provienen de tokens locales?
- [ ] ¿La acción principal es el elemento más visible?
- [ ] ¿Hay suficiente whitespace para respirar?
- [ ] ¿La interfaz es escaneable sin leer cada palabra?
- [ ] ¿Hay alguna violación de WCAG AA que deba advertir?
- [ ] ¿Emití el Reporte de Cumplimiento?
