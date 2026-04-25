# HitShop Design System: Silicon Brutalism (V1.3)

This document is the aesthetic law of HitShop. The agent MUST consult this file before performing any UI modification.

## 1. Visual Identity
- **Concept**: Industrial, raw, high-contrast, "Silicon Brutalism".
- **Philosophy**: The product is the hero. The interface is the framework (visible technical infrastructure).
- **Global Texture**: Always apply the noise overlay (`.bg-noise`) to eliminate the "digital plastic" feel.

## 2. Layout Constraints & Patterns

| Element | Rule | Token / Tailwind Class |
| :--- | :--- | :--- |
| **Borders** | Strictly straight (Zero radius) | `rounded-none` (Forced via global CSS) |
| **Border Weight** | Industrial / Bold | `border-2` (Primary) or `border` (Grid/Secondary) |
| **Shadows** | Hard shadows (No blur) | `.brutal-shadow` or `.brutal-shadow-primary` |
| **Grid** | Shared borders effect | `border-r border-b border-on-surface/10` |
| **Container** | Maximum working width | `max-w-[1440px]` |

### 🛠 The "Fixed Viewport" Pattern (CRITICAL)
Used in Checkout and Success flows to ensure a controlled, high-density experience without global page scroll.
- **Root Container**: `max-h-[calc(100vh-200px)]` (approx) to fit the screen.
- **Structure**: Grid layout (usually `lg:grid-cols-12`).
  - **Main Info (8 cols)**: `overflow-y-auto` with `custom-scrollbar`.
  - **Actions/Sidebar (4 cols)**: Fixed position within the grid, no internal scroll.
- **Mobile Behavior**: Collapse to single column, but maintain high density.

## 3. Print Protocol
The system prints technical data, not interface chrome.
- **Hidden Elements**: `Header` and `Footer` MUST use `print:hidden`.
- **Layout Reset**: Remove external margins and shadows (`print:p-0`, `print:border-0`, `print:shadow-none`).

## 4. Admin & Data Management
- **Identity**: Technical IDs and UIDs MUST use `font-mono`, `text-[9px]`, all-caps, `opacity-40`.
- **Critical Actions**: 
  - Delete buttons use `text-error`.
  - Labels: `CRITICAL_ACTION: PERMANENTLY_DELETE_TRANSACTION_LOG?`.
- **Loading State**: Mandatory Shimmer Skeletons via `loading.tsx`. No empty white screens.

## 5. Color Palette (Tokens)
- **Primary (Silicon Lime)**: `#a3fe00` (`--primary-fixed`) -> Critical actions and energy accents.
- **Surface (Industrial Cream)**: `#f8f7ee` (`--surface`) -> Main system background.
- **On-Surface (Deep Olive)**: `#1B2601` (`--on-surface`) -> Main text, borders, and solid shadows.
- **On-Surface Variant**: `#3D4530` -> Secondary text and disabled states.
- **Error**: State defined in Tailwind for critical/destructive actions.

## 6. Typography & Micro-Metadata
- **Headings**: `Space Grotesk`, Black (900), Uppercase. Tight tracking.
- **Huge Text**: `.text-huge` (Responsive, line-height 0.85).
- **Body**: `Inter` or `Geist`, Medium (500).
- **Metadata (Technical)**: `Monospace` (`Geist`), Bold, All-caps.
  - **Small Data**: `text-[7px]` or `text-[9px]`, `tracking-[0.2em]`, `opacity-20` to `opacity-40`.

## 7. Component Recipes

### Industrial Button
```tsx
<button className="bg-surface text-on-surface border border-on-surface/20 px-3 py-1 font-black uppercase text-[9px] tracking-widest transition-all hover:bg-on-surface hover:text-surface active:scale-95">
  RESERVE
</button>
```

### Product Card (Grid System)
```tsx
<div className="group border-r border-b border-on-surface/10 bg-surface flex flex-col relative overflow-hidden transition-all duration-300 hover:bg-on-surface/[0.02]">
  {/* Content with mix-blend-multiply images */}
</div>
```

## 8. Image Treatment
- **Blending**: Product images on cream backgrounds MUST use `mix-blend-multiply` to integrate with the paper/noise texture.
- **Padding**: Generous internal spacing in image containers to prevent the product from touching industrial borders.
