# HitShop Design System: Silicon Brutalism (V1.2)

This document is the aesthetic law of HitShop. The agent MUST consult this file before performing any UI modification.

## 1. Visual Identity
- **Concept**: Industrial, raw, high-contrast, "Silicon Brutalism".
- **Philosophy**: The product is the hero. The interface is the framework (visible technical infrastructure).
- **Global Texture**: Always apply the noise overlay (`.bg-noise`) to eliminate the "digital plastic" feel.

## 2. Layout Constraints
| Element | Rule | Token / Tailwind Class |
| :--- | :--- | :--- |
| **Borders** | Strictly straight (Zero radius) | `rounded-none` (Forced via global CSS) |
| **Border Weight** | Industrial / Bold | `border-2` (Primary) or `border` (Grid/Secondary) |
| **Shadows** | Hard shadows (No blur) | `.brutal-shadow` or `.brutal-shadow-primary` |
| **Grid** | Shared borders effect | `border-r border-b border-on-surface/10` |
| **Container** | Maximum working width | `max-w-[1440px]` |

## 3. Color Palette (Tokens)
- **Primary (Silicon Lime)**: `#a3fe00` (`--primary-fixed`) -> Critical actions and energy accents.
- **Surface (Industrial Cream)**: `#f8f7ee` (`--surface`) -> Main system background.
- **On-Surface (Deep Olive)**: `#1B2601` (`--on-surface`) -> Main text, borders, and solid shadows.
- **On-Surface Variant**: `#3D4530` -> Secondary text and disabled states.
- **Status Badges**:
  - `OUT_OF_STOCK`: 40% opacity, extreme tracking.
  - `POPULAR`: `on-surface` background, `surface` text.

## 4. Typography & Micro-Metadata
- **Headings**: `Space Grotesk`, Black (900), Uppercase. Tight tracking.
- **Huge Text**: `.text-huge` (Responsive, line-height 0.85).
- **Body**: `Inter` or `Geist`, Medium (500).
- **Metadata (Technical)**: `Monospace` (`Geist`), Bold, All-caps.
  - **Small Data**: `text-[7px]` or `text-[9px]`, `tracking-[0.2em]`, `opacity-20` to `opacity-40`.
- **Gradients**: `.text-gradient` (from `on-surface` to `on-surface-variant`).

## 5. Component Recipes

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

### Motion & Feedback
- **Marquee**: Use the `<Marquee />` component for news or stock status.
- **Scramble**: Use `<ScrambleText />` for industrial text entries.
- **Hover Transitions**: `duration-300` to `duration-700` to soften the visual rawness.

## 6. Image Treatment
- **Blending**: Product images on cream backgrounds MUST use `mix-blend-multiply` to integrate with the paper/noise texture.
- **Padding**: Generous internal spacing in image containers to prevent the product from touching industrial borders.
