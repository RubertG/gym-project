---
name: iron-track-design-guardian
description: >-
    Enforce the 'Voltage Industrial' design system on every frontend output.
    Use this skill whenever creating, modifying, or reviewing React components,
    Astro pages, CSS, Tailwind classes, or any UI element. Ensures dark-only
    mode, exact color tokens (#CCFF00 primary), zero border-radius, glass cards,
    strict typography, and Framer Motion animations with AnimatePresence.
    Do not allow any light mode sections, shadows, or rounded corners.
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

## 8. Animation & Motion — Framer Motion

**Librería obligatoria:** `framer-motion` con `AnimatePresence` para todas las transiciones de entrada/salida.

### Reglas de Animación

- **SIEMPRE usar Framer Motion** para animaciones de componentes interactivos.
- **AnimatePresence** para mount/unmount con animaciones de entrada y salida.
- **Solo `transform` y `opacity`** — no animar `width`, `height`, `top`, `left`.
- **Easing industrial:** `cubic-bezier(0.23, 1, 0.32, 1)` o `easeOut` de Framer Motion.
- **Duraciones cortas:** 0.2s–0.4s para UI, 0.4s–0.6s para modales/overlays.
- **No bounce, no elastic, no spring agresivos.** Movimiento limpio y mecánico.
- **Respetar `prefers-reduced-motion`** — desactivar animaciones si el usuario lo requiere.

### Patrones Obligatorios

#### Entrada/Salida de Modales y Overlays

```tsx
import { motion, AnimatePresence } from 'framer-motion'
;<AnimatePresence>
    {isOpen && (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        >
            {/* Modal content */}
        </motion.div>
    )}
</AnimatePresence>
```

#### Fade In/Out para Listas y Items

```tsx
<AnimatePresence>
    {items.map((item) => (
        <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
        >
            {item.content}
        </motion.div>
    ))}
</AnimatePresence>
```

#### Feedback de Interacción (Botones, Cards)

```tsx
<motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    transition={{ duration: 0.15 }}
>
    Click me
</motion.button>
```

#### Transición de Tabs y Paneles

```tsx
<AnimatePresence mode="wait">
    <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
    >
        {tabContent}
    </motion.div>
</AnimatePresence>
```

### Anti-patrones (NO HACER)

- ❌ Usar `setTimeout` + `useState` para animaciones manuales.
- ❌ Animar propiedades de layout (`width`, `height`, `margin`).
- ❌ Usar `bounce` o `spring` con stiffness alto.
- ❌ Olvidar `AnimatePresence` para componentes que se desmontan.
- ❌ Animaciones sin `initial`, `animate`, `exit` en modales/overlays.

## 9. Pre-flight Check Visual Obligatorio

Antes de entregar cualquier output de UI, verifica:

### Design System

- [ ] No border-radius found except circular avatars.
- [ ] Primary color is exactly `#CCFF00` on all CTAs and active states.
- [ ] All backgrounds are dark (`#131313` or darker).
- [ ] Glass cards have `backdrop-blur` + subtle border.
- [ ] No light mode sections.
- [ ] All interactive elements have `:active scale(0.97)` feedback.
- [ ] Touch targets >= 44px on mobile.
- [ ] No shadows (except glow effects).

### Animaciones (Framer Motion)

- [ ] ¿Usa `framer-motion` para animaciones de componentes interactivos?
- [ ] ¿Usa `AnimatePresence` para mount/unmount con transiciones?
- [ ] ¿Solo anima `transform` y `opacity`? (no width, height, top, left)
- [ ] ¿Duraciones cortas? (0.2s–0.4s para UI, 0.4s–0.6s para modales)
- [ ] ¿Easing industrial? (`easeOut` o `cubic-bezier(0.23, 1, 0.32, 1)`)
- [ ] ¿No usa bounce, elastic, o spring agresivos?
- [ ] ¿Respeta `prefers-reduced-motion`?
- [ ] ¿Tiene `initial`, `animate`, `exit` en modales/overlays?
- [ ] ¿Feedback de interacción? (`whileHover`, `whileTap`)
