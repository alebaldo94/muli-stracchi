---
name: Stracchi Athletic
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4d4732'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#7e775f'
  outline-variant: '#d0c6ab'
  surface-tint: '#705d00'
  primary: '#705d00'
  on-primary: '#ffffff'
  primary-container: '#ffd700'
  on-primary-container: '#705e00'
  inverse-primary: '#e9c400'
  secondary: '#bc0003'
  on-secondary: '#ffffff'
  secondary-container: '#e41f16'
  on-secondary-container: '#fffbff'
  tertiary: '#5f5e5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#dcd9d9'
  on-tertiary-container: '#605f5e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe16d'
  primary-fixed-dim: '#e9c400'
  on-primary-fixed: '#221b00'
  on-primary-fixed-variant: '#544600'
  secondary-fixed: '#ffdad5'
  secondary-fixed-dim: '#ffb4a8'
  on-secondary-fixed: '#410000'
  on-secondary-fixed-variant: '#930002'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-xl:
    fontFamily: Lexend
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Lexend
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Lexend
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 0.5rem
  sm: 1rem
  md: 1.5rem
  lg: 2.5rem
  xl: 4rem
  gutter: 1.5rem
  margin: 2rem
---

## Brand & Style

The design system is built on the intersection of raw, gritty adventure and high-performance professionalism. It captures the spirit of "The Tired Mules"—a nod to the endurance and relentless effort of the cycling community. The visual language is **High-Contrast & Bold**, utilizing aggressive color blocking and clean, modern lines to evoke speed and movement. 

While the aesthetic is rooted in the "grit" of the road, the UI remains organized and systematic. This is achieved through a structured card-based architecture that prioritizes legibility and functional hierarchy, ensuring that even the most information-dense screens feel approachable and reliable.

## Colors

The palette is derived directly from racing heritage. The **Primary Yellow** is high-visibility and energetic, used for call-to-actions and key brand moments. **Racing Red** acts as an accent for urgency and performance-related data (e.g., heart rate, speed limits, or critical alerts). 

The foundations are built on **Charcoal and Deep Black**, providing a heavy, grounded contrast that keeps the design feeling "gritty" and professional rather than whimsical. Surface colors use high-contrast whites and very light greys to ensure that text remains the primary focus against the vibrant brand accents.

## Typography

This design system employs a dual-font strategy. **Lexend** is the primary choice for headlines and labels due to its athletic, clear-cut geometry and superior readability at speed. It is used in heavy weights to convey strength and reliability. 

**Inter** handles all body copy and technical data. Its neutral, systematic nature balances the expressive headlines, providing a professional and "engineered" feel to the content. All labels and overlines should utilize uppercase styling with tighter letter spacing to mimic the typography found on racing jerseys and technical gear.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model to maintain a sense of precision and structure. A 12-column grid is standard for desktop applications, while a 4-column grid is used for mobile. 

Spacing follows a strict 4px baseline rhythm. Generous margins and gutters are used to prevent the high-contrast colors from feeling claustrophobic. Components should be spaced to allow "breathing room," but internal card padding should remain tight and efficient to reflect the compact nature of cycling equipment and dashboard telemetry.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layers** and crisp **Ambient Shadows**. This design system avoids excessive blur, opting for shadows that feel structural rather than decorative. 

- **Level 0 (Surface):** The base background, typically light grey or white.
- **Level 1 (Cards):** Subtle 1px borders in a darker grey or primary yellow to define the container, paired with a soft, low-opacity shadow.
- **Level 2 (Interactions):** Increased shadow spread and depth when a card or button is hovered, simulating a physical "lift" from the road surface.

To enhance the "gritty" feel, use a subtle 5% opacity "noise" or "asphalt texture" overlay on Level 0 surfaces to break up large flat areas of color.

## Shapes

The shape language is **Rounded (Level 2)**. This specific radius (0.5rem base) provides a modern, friendly feel while maintaining enough structural integrity to appear professional. It strikes a balance between the sharp, aggressive angles of a bicycle frame and the ergonomic curves of cycling apparel. 

Small elements like tags or "chips" may use a Pill-shaped (Level 3) radius to differentiate them as interactive or status-based items, contrasting against the more rigid card structures.

## Components

### Buttons
Primary buttons use the Bold Yellow background with Charcoal text. They feature a slight "skew" or a heavy bottom border (2px) to suggest forward motion. Secondary buttons use a thick Charcoal outline.

### Cards
Cards are the primary content vessel. They should feature a "racing stripe" or a color-coded top border (Yellow for info, Red for alerts, Charcoal for neutral data). Backgrounds should be pure white to contrast against the light grey page surface.

### Input Fields
Inputs use a high-contrast white background with a 1px Charcoal border that thickens and turns Yellow on focus. Typography within inputs should be Inter Body-MD.

### Chips & Stats
Chips utilize the "Pill" shape and are often paired with icons. For performance metrics (Distance, Elevation, Speed), use the Headline-MD typography in Lexend to make the numbers pop.

### Textures
Subtle chevron patterns (mimicking tire treads) can be used as background accents in headers or as separators between large sections to reinforce the adventurous, "on-the-road" brand personality.