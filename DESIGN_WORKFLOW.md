# 🛠 Flujo de Diseño: Intelligent Constraint-Driven UI

Este documento describe cómo se procesan las tareas de UI/UX en este proyecto utilizando el sistema de **Refactorización por Restricciones**.

## 1. Los Componentes del Sistema

| Capa | Nombre | Función | Ubicación |
| :--- | :--- | :--- | :--- |
| **La Verdad** | `DESIGN_SYSTEM.md` | Define los valores exactos (Colores, Radios, Sombras). | Raíz del proyecto |
| **El Cerebro** | `ui-ux-critic` | Skill que aporta el conocimiento senior de diseño. | `.gemini/skills/` |
| **El Auditor** | `strict-refactorer` | Skill que garantiza que no se rompan las reglas. | `.gemini/skills/` |

---

## 2. El Flujo de Ejecución (Paso a Paso)

1. **Disparo**: El usuario solicita un cambio o creación de UI.
2. **Descubrimiento**: El agente escanea el workspace buscando `DESIGN_SYSTEM.md` y otras skills de diseño.
3. **Auditoría UX**: El agente aplica principios universales (Jerarquía, Gestalt, Contraste) para planificar la estructura.
4. **Traducción Técnica**: El agente filtra sus "instintos" genéricos a través de las restricciones locales (ej: si el agente quiere redondeados pero el sistema dice 0px, se usa 0px).
5. **Implementación**: Se genera el código usando exclusivamente los tokens definidos en el sistema local.
6. **Validación**: Se verifica que el código final no contenga "drift" (desviación) del estándar.

---

## 3. Guía de Operación

### Escenario A: Quieres crear algo nuevo
> *"Crea un componente de [Tipo] usando la skill `ui-ux-critic` basándote en nuestro `DESIGN_SYSTEM.md`."*

### Escenario B: Quieres arreglar algo existente
> *"Audita y refactoriza este archivo con la skill `strict-refactorer` para que cumpla con HitShop."*

---

## 4. Mantenimiento del Sistema

Si decides cambiar la identidad visual del proyecto:
1. **Edita** `DESIGN_SYSTEM.md` con los nuevos valores.
2. **Ejecuta** `/skills reload` en el CLI.
3. **Solicita** una refactorización de los componentes existentes. El agente usará automáticamente la nueva configuración.

---

## 5. Prerequisitos
- El archivo `DESIGN_SYSTEM.md` debe estar actualizado en la raíz.
- Las skills `ui-ux-critic` y `strict-refactorer` deben estar instaladas en `.gemini/skills/`.
- El agente debe ser invocado mencionando explícitamente estas capacidades para asegurar el cumplimiento.
