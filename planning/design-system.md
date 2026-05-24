# Voltage Industrial Design System

## Design Philosophy

**Voltage Industrial** is the design system for the IRON TRACK gym workout tracking web app.

It fuses two core aesthetics:

- **Industrial Brutalism**: Raw utility, sharp edges, high-contrast typography, and a no-nonsense layout that prioritizes function over decoration.
- **Cyber-Minimalism**: A restrained color palette, precise spacing, and subtle neon accents that evoke high-tech performance without visual clutter.

The result is an interface that feels like a piece of professional gym equipment: durable, direct, and built for heavy use.

## Color Tokens

All tokens are mapped to a 50–950 scale. The app is **dark mode only**; there is no light mode.

### Primary (`#CCFF00` family)

A vibrant acid-lime used for CTAs, highlights, and energy accents.

| Token         | Hex       | Usage                      |
| ------------- | --------- | -------------------------- |
| `primary-50`  | `#f7ffe6` | Subtle lime tints          |
| `primary-100` | `#eeffcc` | Light lime backgrounds     |
| `primary-200` | `#ddff99` | Hover states               |
| `primary-300` | `#ccff00` | **Base vibrant accent**    |
| `primary-400` | `#abd600` | Primary action backgrounds |
| `primary-500` | `#8fb300` | Muted accent               |
| `primary-600` | `#6d8a00` | Darker accent              |
| `primary-700` | `#4d6100` | Deep lime                  |
| `primary-800` | `#2e3900` | Very dark lime             |
| `primary-900` | `#1a2000` | Near-black lime            |
| `primary-950` | `#0d1100` | Darkest lime               |

### Secondary (warm greys, base `#c8c6c5`)

Used for borders, secondary text, and structural elements.

| Token           | Hex       | Usage              |
| --------------- | --------- | ------------------ |
| `secondary-50`  | `#f7f6f6` | Lightest warm grey |
| `secondary-100` | `#efeceb` | Subtle backgrounds |
| `secondary-200` | `#e0dcdb` | Secondary text     |
| `secondary-300` | `#c8c6c5` | **Base warm grey** |
| `secondary-400` | `#a09e9d` | Borders, icons     |
| `secondary-500` | `#787675` | Muted text         |
| `secondary-600` | `#504e4d` | Darker borders     |
| `secondary-700` | `#383635` | Input borders      |
| `secondary-800` | `#242221` | Deep backgrounds   |
| `secondary-900` | `#141312` | Near-black         |
| `secondary-950` | `#0a0909` | Darkest warm grey  |

### Background (dark greys/blacks, bases `#131313` / `#000000`)

The canvas of the entire application.

| Token            | Hex       | Usage               |
| ---------------- | --------- | ------------------- |
| `background-50`  | `#262626` | Lightest dark grey  |
| `background-100` | `#1f1f1f` | Elevated surfaces   |
| `background-200` | `#1c1c1c` | Cards               |
| `background-300` | `#1a1a1a` | Subtle elevation    |
| `background-400` | `#171717` | Mid-grey            |
| `background-500` | `#131313` | **Base dark grey**  |
| `background-600` | `#101010` | Deep surfaces       |
| `background-700` | `#0d0d0d` | Deeper backgrounds  |
| `background-800` | `#080808` | Input backgrounds   |
| `background-900` | `#040404` | **Body background** |
| `background-950` | `#000000` | Pure black          |

## Typography

| Family      | Stack                         | Weights            | Use Case                         |
| ----------- | ----------------------------- | ------------------ | -------------------------------- |
| **Display** | `'Space Grotesk', sans-serif` | 400, 500, 700      | Headings, brand marks, hero text |
| **Body**    | `'Inter', sans-serif`         | 400, 500, 600, 700 | UI text, paragraphs, labels      |
| **Mono**    | `'JetBrains Mono', monospace` | 400, 500, 700      | Stats, timers, code-like data    |

## Spacing Tokens

The grid is based on an **8px unit**.

| Token        | Value    | Pixels  |
| ------------ | -------- | ------- |
| `spacing-18` | `4.5rem` | `72px`  |
| `spacing-22` | `5.5rem` | `88px`  |
| `spacing-30` | `7.5rem` | `120px` |

## Component Base Classes

### `.btn-primary`

High-emphasis action button.

```css
.btn-primary {
  @apply bg-primary-400 border-primary-400 border-2 px-6 py-3 font-bold text-black transition-all duration-200;
}
.btn-primary:hover {
  @apply bg-primary-300;
}
```

### `.btn-secondary`

Low-emphasis action button.

```css
.btn-secondary {
  @apply text-secondary-200 border-secondary-400 border-2 bg-transparent px-6 py-3 font-bold transition-all duration-200;
}
.btn-secondary:hover {
  @apply bg-secondary-400 text-black;
}
```

### `.input-field`

Standard text input.

```css
.input-field {
  @apply bg-background-800 border-secondary-700 focus:border-primary-400 w-full border-2 px-4 py-3 text-white transition-colors focus:outline-none;
}
```

### `.card-glass`

Glass-morphism card surface.

```css
.card-glass {
  @apply bg-background-800/80 border-primary-400/20 border backdrop-blur-md;
}
```

### `.glow-primary`

Subtle neon glow effect.

```css
.glow-primary {
  box-shadow: 0 0 25px rgba(204, 255, 0, 0.3);
}
```

### `.animate-fade-in-up`

Entrance animation.

```css
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Border Radius Policy

**0px default.** No global border-radius override is applied. Components handle their own sharp edges to maintain the Industrial Brutalism aesthetic. If a rounded element is needed, it is explicitly declared in the component.

## Dark Mode Only

The application is strictly dark mode. There is no light-mode toggle, no alternate palette, and no `dark:` variant switching. All colors are chosen for a black/dark-grey canvas.
