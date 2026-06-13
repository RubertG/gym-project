# Design Tokens — Voltage Industrial

Referencia completa de tokens del design system **Voltage Industrial** para IRON TRACK.

---

## Color Tokens

### Primary (`#CCFF00` family)

| Token         | Hex       | RGB                  | Usage                      |
|---------------|-----------|----------------------|----------------------------|
| `primary-50`  | `#f7ffe6` | `rgb(247, 255, 230)` | Subtle lime tints          |
| `primary-100` | `#eeffcc` | `rgb(238, 255, 204)` | Light lime backgrounds     |
| `primary-200` | `#ddff99` | `rgb(221, 255, 153)` | Hover states               |
| `primary-300` | `#ccff00` | `rgb(204, 255, 0)`   | **Base vibrant accent**    |
| `primary-400` | `#abd600` | `rgb(171, 214, 0)`   | Primary action backgrounds |
| `primary-500` | `#8fb300` | `rgb(143, 179, 0)`   | Muted accent               |
| `primary-600` | `#6d8a00` | `rgb(109, 138, 0)`   | Darker accent              |
| `primary-700` | `#4d6100` | `rgb(77, 97, 0)`     | Deep lime                  |
| `primary-800` | `#2e3900` | `rgb(46, 57, 0)`     | Very dark lime             |
| `primary-900` | `#1a2000` | `rgb(26, 32, 0)`     | Near-black lime            |
| `primary-950` | `#0d1100` | `rgb(13, 17, 0)`     | Darkest lime               |

### Secondary (warm greys, base `#c8c6c5`)

| Token           | Hex       | RGB                  | Usage              |
|-----------------|-----------|----------------------|--------------------|
| `secondary-50`  | `#f7f6f6` | `rgb(247, 246, 246)` | Lightest warm grey |
| `secondary-100` | `#efeceb` | `rgb(239, 236, 235)` | Subtle backgrounds |
| `secondary-200` | `#e0dcdb` | `rgb(224, 220, 219)` | Secondary text     |
| `secondary-300` | `#c8c6c5` | `rgb(200, 198, 197)` | **Base warm grey** |
| `secondary-400` | `#a09e9d` | `rgb(160, 158, 157)` | Borders, icons     |
| `secondary-500` | `#787675` | `rgb(120, 118, 117)` | Muted text         |
| `secondary-600` | `#504e4d` | `rgb(80, 78, 77)`    | Darker borders     |
| `secondary-700` | `#383635` | `rgb(56, 54, 53)`    | Input borders      |
| `secondary-800` | `#242221` | `rgb(36, 34, 33)`    | Deep backgrounds   |
| `secondary-900` | `#141312` | `rgb(20, 19, 18)`    | Near-black         |
| `secondary-950` | `#0a0909` | `rgb(10, 9, 9)`      | Darkest warm grey  |

### Background (dark greys/blacks, bases `#131313` / `#000000`)

| Token            | Hex       | RGB                 | Usage               |
|------------------|-----------|---------------------|---------------------|
| `background-50`  | `#262626` | `rgb(38, 38, 38)`   | Lightest dark grey  |
| `background-100` | `#1f1f1f` | `rgb(31, 31, 31)`   | Elevated surfaces   |
| `background-200` | `#1c1c1c` | `rgb(28, 28, 28)`   | Cards               |
| `background-300` | `#1a1a1a` | `rgb(26, 26, 26)`   | Subtle elevation    |
| `background-400` | `#171717` | `rgb(23, 23, 23)`   | Mid-grey            |
| `background-500` | `#131313` | `rgb(19, 19, 19)`   | **Base dark grey**  |
| `background-600` | `#101010` | `rgb(16, 16, 16)`   | Deep surfaces       |
| `background-700` | `#0d0d0d` | `rgb(13, 13, 13)`   | Deeper backgrounds  |
| `background-800` | `#080808` | `rgb(8, 8, 8)`      | Input backgrounds   |
| `background-900` | `#040404` | `rgb(4, 4, 4)`      | **Body background** |
| `background-950` | `#000000` | `rgb(0, 0, 0)`      | Pure black          |

---

## Typography Tokens

| Token            | Family                              | Weights              | Use Case                         |
|------------------|-------------------------------------|----------------------|----------------------------------|
| `font-display`   | `'Space Grotesk', sans-serif`       | 400, 500, 700        | Headings, brand marks, hero text |
| `font-body`      | `'Inter', sans-serif`               | 400, 500, 600, 700   | UI text, paragraphs, labels      |
| `font-mono`      | `'JetBrains Mono', monospace`       | 400, 500, 700        | Stats, timers, code-like data    |
| `font-meta`      | `font-body`                         | 500                  | Metadata / Navigation            |

### Meta Text Rules

- `text-transform: uppercase`
- `font-size: 10px–12px`
- `letter-spacing: 0.05em`
- `font-weight: 500`

---

## Spacing Tokens

Base unit: **8px**.

| Token        | Value (rem) | Pixels |
|--------------|-------------|--------|
| `spacing-1`  | `0.25rem`   | `4px`  |
| `spacing-2`  | `0.5rem`    | `8px`  |
| `spacing-3`  | `0.75rem`   | `12px` |
| `spacing-4`  | `1rem`      | `16px` |
| `spacing-5`  | `1.25rem`   | `20px` |
| `spacing-6`  | `1.5rem`    | `24px` |
| `spacing-8`  | `2rem`      | `32px` |
| `spacing-10` | `2.5rem`    | `40px` |
| `spacing-12` | `3rem`      | `48px` |
| `spacing-16` | `4rem`      | `64px` |
| `spacing-18` | `4.5rem`    | `72px` |
| `spacing-22` | `5.5rem`    | `88px` |
| `spacing-24` | `6rem`      | `96px` |
| `spacing-30` | `7.5rem`    | `120px`|

---

## Border & Effect Tokens

| Token              | Value                                         |
|--------------------|-----------------------------------------------|
| `border-subtle`    | `rgba(255, 255, 255, 0.08)`                   |
| `border-lime-subtle`| `rgba(204, 255, 0, 0.2)`                     |
| `glow-primary`     | `0 0 25px rgba(204, 255, 0, 0.3)`             |
| `backdrop-glass`   | `backdrop-filter: blur(12px)` (`backdrop-blur-md`) |
