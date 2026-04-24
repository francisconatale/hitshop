---
name: hitshop-design-system
description: Rules and components for the HitShop design system (Silicon Brutalism). Use this when creating new components, pages, or modifying the visual style of the project to ensure consistency with the industrial, clean, and high-contrast aesthetic.
---

# Silicon Brutalism - HitShop Design System

## Core Principles
1. **Product as Hero**: The UI is a frame. Keep product displays clean, with generous negative space and minimal noise.
2. **Material Honesty**: Elements should feel physical. Use solid shadows (`brutal-shadow`), hard edges (`0px` radius), and industrial borders.
3. **High-Contrast Hierarchy**: Use Silicon Lime (`#a3fe00`) for primary actions and Deep Olive (`#1B2601`) for structural elements.

## Design Tokens

### Colors
- **Surface**: `#f8f7ee` (Industrial Cream)
- **On-Surface**: `#1B2601` (Industrial Black/Green)
- **Primary**: `#a3fe00` (Silicon Lime)
- **Error**: `#b02500` (Signal Red)

### Typography
- **Headlines**: Space Grotesk Black, All-caps, Tracking-tighter.
- **Body**: Inter Medium/Regular.
- **Metadata**: Monospace, Small, All-caps, Tracking-widest.

### UI Specs
- **Border**: 1px subtle, 2px/4px structural.
- **Radius**: Always `0px`.
- **Shadows**: `4px 4px 0px 0px var(--on-surface)`.
- **Interactions**: `active:scale-95` and grayscale-to-color transitions.

## Component Recipes

### Product Cards
- **Header**: ID and Status (Mono text, low opacity).
- **Image**: Grayscale with scale-up hover effect.
- **Footer**: Valuation (Price) and "RESERVAR" button.

### High-End Asset Page
- **Header**: Minimal back link.
- **Layout**: Large image area (7 cols) vs technical info (5 cols).
- **Transparency**: Use `on-surface/5` for backgrounds to add depth without noise.
- **Status**: Use a blur overlay for Sold Out products.
