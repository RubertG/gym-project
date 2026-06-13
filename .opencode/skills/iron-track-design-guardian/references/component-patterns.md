# Component Patterns — Voltage Industrial

Ejemplos de implementación correcta en **Tailwind CSS** (clases de utilidad) para cada componente base del design system. Copiar y pegar directamente.

---

## 1. Button Primary

High-emphasis action button.

```html
<button
  class="bg-[#CCFF00] border-2 border-[#CCFF00] px-6 py-3 font-bold text-black transition-all duration-200 hover:bg-[#ddff99] active:scale-[0.97]"
>
  Acción Principal
</button>
```

---

## 2. Button Secondary

Low-emphasis action button.

```html
<button
  class="border-2 border-[#c8c6c5] bg-transparent px-6 py-3 font-bold text-[#e0dcdb] transition-all duration-200 hover:bg-[#a09e9d] hover:text-black active:scale-[0.97]"
>
  Acción Secundaria
</button>
```

---

## 3. Input Field

Standard text input.

```html
<input
  type="text"
  placeholder="Escribe aquí..."
  class="w-full border-2 border-[#383635] bg-[#131313] px-4 py-3 text-[#F0F0F0] transition-colors placeholder:text-[#787675] focus:border-[#CCFF00] focus:outline-none"
/>
```

---

## 4. Card Glass

Glass-morphism card surface.

```html
<div
  class="border border-[rgba(204,255,0,0.2)] bg-[rgba(8,8,8,0.8)] p-6 backdrop-blur-md"
>
  <h3 class="font-display text-lg font-bold text-[#F0F0F0]">Título Glass</h3>
  <p class="mt-2 text-[#A0A0A0]">Contenido dentro de la tarjeta glass.</p>
</div>
```

---

## 5. Glow Effect

Subtle neon glow effect.

```html
<div
  class="shadow-[0_0_25px_rgba(204,255,0,0.3)]"
>
  Elemento con glow primario
</div>
```

---

## Notas de uso

- **No border-radius:** todos los ejemplos omiten `rounded-*` salvo avatares circulares (`rounded-full`).
- **Active feedback:** todos los botones incluyen `active:scale-[0.97]`.
- **Glass requiere:** un fondo semitransparente (`bg-[rgba(8,8,8,0.8)]`) + `backdrop-blur-md` + borde sutil `rgba(204,255,0,0.2)`.
- **Tailwind arbitrary values:** se usan valores arbitrarios (`bg-[#CCFF00]`, `shadow-[...]`) para garantizar la exactitud de los tokens del design system sin depender de una configuración de `tailwind.config` extendida.
