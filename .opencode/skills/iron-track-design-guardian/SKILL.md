---
name: iron-track-design-guardian
description: >-
    Enforce the 'Voltage Industrial' design system on every frontend output.
    Use this skill whenever creating, modifying, or reviewing React components,
    Astro pages, CSS, Tailwind classes, or any UI element. Ensures dark-only
    mode, exact color tokens (#CCFF00 primary), zero border-radius, glass cards,
    and strict typography. Do not allow any light mode sections, shadows, or
    rounded corners.
---

# Voltage Industrial Design System — Enforcement Rules

## 1. Theme Lock — Dark Mode Only

- **ALWAYS dark mode.** Never generate light mode sections, alternate palettes, or `dark:` variant switches.
- Background base: `#000000` (`background-950`) y `#131313` (`background-500`).
- Surface: `#080808` (`background-800`) con glass overlay cuando aplique.
- Text primary: `#F0F0F0`.
- Text secondary: `#A0A0A0`.

## 2. Color Tokens Obligatorios

- **Primary:** `#CCFF00` (Electric Lime).
- **Secondary:** `#c8c6c5`.
- **Background:** `#131313` / `#000000`.
- **Border:** `rgba(255,255,255,0.08)`.
- **Glow primary:** `box-shadow: 0 0 25px rgba(204, 255, 0, 0.3)`.

> Consulta `references/design-tokens.md` para la escala completa 50–950.

## 3. Shape Language — 0px Border Radius

- **BORDER-RADIUS IS BANNED.** All corners must be `0px`.
- Exception: fully circular avatars ONLY (`rounded-full`).
- Rectángulos estrictos en todo el resto.

## 4. No Sombras

- No drop shadows. La profundidad se comunica por **Tonal Layering** y **Bordes Gruesos**.
- Glass cards: `backdrop-blur-md`, fondo semitransparente, borde sutil `rgba(204,255,0,0.2)`.

## 5. Typography Tokens

- **Display / Headlines:** Space Grotesk (400, 500, 700).
- **Body:** Inter / Geist (400, 500, 600, 700).
- **Mono / Stats / Labels:** JetBrains Mono (400, 500, 700).
- **Metadata / Navigation:** UPPERCASE, 10–12px, tracking 0.05em.

## 6. Layout & Grid

- Grid 8px para spacing.
- CSS Grid con visible 1px dividers entre secciones.
- Mobile First. Touch targets >= 44px en móvil.

## 7. Componentes Base Obligatorios

- `.btn-primary`: Fondo `#CCFF00`, texto negro, borde 2px.
- `.btn-secondary`: Transparente, borde 2px `#c8c6c5`, hover invertido.
- `.input-field`: Fondo `#131313`, borde 2px `#c8c6c5`, focus `#CCFF00`.
- `.card-glass`: Glass-morphism con `backdrop-blur-md` y borde sutil `rgba(204,255,0,0.2)`.
- `.glow-primary`: `box-shadow: 0 0 25px rgba(204, 255, 0, 0.3)`.

> Consulta `references/component-patterns.md` para ejemplos copy-paste en Tailwind.

## 8. Animation & Motion

- Solo `transform` y `opacity` para animaciones.
- Easing: `cubic-bezier(0.23, 1, 0.32, 1)` para interacciones UI.
- No bounce, no elastic.
- Respetar `prefers-reduced-motion`.

## 9. Pre-flight Check Visual Obligatorio

Antes de entregar cualquier output de UI, verifica:

- [ ] No border-radius found except circular avatars.
- [ ] Primary color is exactly `#CCFF00` on all CTAs and active states.
- [ ] All backgrounds are dark (`#131313` or darker).
- [ ] Glass cards have `backdrop-blur` + subtle border.
- [ ] No light mode sections.
- [ ] All interactive elements have `:active scale(0.97)` feedback.
- [ ] Touch targets >= 44px on mobile.
- [ ] No shadows (except glow effects).
