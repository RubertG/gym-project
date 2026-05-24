---
name: Voltage Industrial
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1b1b'
  surface-container: '#1f1f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c4c9ac'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#303030'
  outline: '#8e9379'
  outline-variant: '#444933'
  surface-tint: '#abd600'
  primary: '#ffffff'
  on-primary: '#283500'
  primary-container: '#c3f400'
  on-primary-container: '#556d00'
  inverse-primary: '#506600'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#ffffff'
  on-tertiary: '#303030'
  tertiary-container: '#e4e2e1'
  on-tertiary-container: '#656464'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c3f400'
  primary-fixed-dim: '#abd600'
  on-primary-fixed: '#161e00'
  on-primary-fixed-variant: '#3c4d00'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e4e2e1'
  tertiary-fixed-dim: '#c8c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474747'
  background: '#131313'
  on-background: '#e2e2e2'
  surface-variant: '#353535'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
  code:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
spacing:
  base: 4px
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  container-max: 1440px
---

## Brand & Style

This design system is built for high-stakes, high-energy technical environments. It targets developers, engineers, and power users who prioritize speed, precision, and a distinctive "hacker-industrial" aesthetic. The UI should feel electric, urgent, and uncompromisingly modern.

The design style is a fusion of **Industrial Brutalism** and **Cyber-Minimalism**. It utilizes a pitch-black foundation to allow high-saturation accents to "pop" with maximum intensity. Visual weight is communicated through thick borders, monospaced data displays, and aggressive contrast rather than soft gradients or organic shadows. The emotional response should be one of hyper-focus and technological dominance.

## Colors

The palette is centered around an "Electric Lime" (#CCFF00)—a high-saturation, aggressive primary color that sits on the border of neon green and yellow. This color is used exclusively for interactive elements, critical status indicators, and primary branding to ensure it never loses its visual impact.

The background is a pure, absolute black (#000000) to maximize the "glow" effect of the primary color. Secondary surfaces use deep charcoals to maintain a low-light, high-contrast environment. Functional colors for error and warning states are equally high-saturation to ensure they are not drowned out by the primary accent.

## Typography

Typography is used as a structural element. **Space Grotesk** provides a geometric, futuristic feel for headlines, utilizing tight letter spacing and heavy weights to create "blocks" of text.

**Geist** serves as the primary body face, offering a clean, technical sans-serif aesthetic that remains legible during long periods of use. For data, labels, and metadata, **JetBrains Mono** is employed to reinforce the developer-centric, industrial nature of the design system. All labels should be set in uppercase to increase their presence as UI anchors.

## Layout & Spacing

This design system uses a strict 8px grid system. Layouts are primarily fluid within a maximum container width of 1440px. On desktop, a 12-column grid is used with generous 24px gutters to allow the high-contrast elements room to breathe.

Margins are kept tight on mobile (16px) to maximize screen real estate for technical data, while desktop margins are expanded (48px) to create a premium, editorial feel. Component spacing should be aggressive—use 0px or 1px spacing between related items with heavy borders to create a "module" effect.

## Elevation & Depth

Depth is conveyed through **Tonal Layering** and **Bold Borders**. Shadows are entirely avoided.

Differentiation between the background and foreground is achieved by stepping the background color from #000000 (Level 0) to #1A1A1A (Level 1) and #333333 (Level 2). Interactive elements use a 2px solid border in the primary Electric Lime color or a muted charcoal. To simulate focus or "elevation," elements do not rise; instead, their border thickness increases or they take on a solid primary-color fill, creating a tactile, "lit-up" effect.

## Shapes

The shape language is strictly **Sharp (0)**. There are no rounded corners in this design system. Every button, input field, card, and modal uses 90-degree angles to reinforce the industrial, unrefined, and technical nature of the brand. This geometric rigidity ensures that the UI feels stable, engineered, and precise.

## Components

### Buttons

Primary buttons are solid Electric Lime (#CCFF00) with black text, using `label-md` for typography. Secondary buttons use a 2px Electric Lime border with no fill. All buttons have a 0px border-radius.

### Input Fields

Inputs are containers with a 1px #333333 border. Upon focus, the border changes to 2px #CCFF00. Labels sit above the input in `label-sm` using a muted grey color.

### Cards & Modules

Cards use #1A1A1A as a background color with no shadows. They are separated by 1px solid #333333 borders. For high-priority modules, use a 1px #CCFF00 border to draw immediate attention.

### Chips & Tags

Chips are rectangular with a 1px border. Status chips use the primary color for "Active" and the error color for "Critical," accompanied by a 4px solid square icon of the same color to mimic hardware LEDs.

### Data Tables

Tables should use `jetbrainsMono` for all cell content. Rows are separated by 1px #1A1A1A lines. Header cells use `label-sm` with a subtle #333333 background fill to distinguish them from data.
