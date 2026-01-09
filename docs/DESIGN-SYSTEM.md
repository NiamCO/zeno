# Zeno Design System

## Quantum Blue Theme

Zeno uses a professional, accessible design system called "Quantum Blue" focused on clarity, consistency, and modern aesthetics.

## Core Principles

1. **Clarity Over Cleverness**: Design should be intuitive, not clever
2. **Consistency Creates Confidence**: Predictable patterns build trust
3. **Accessibility by Default**: Design for everyone from the start
4. **Responsive by Nature**: Work beautifully at any screen size
5. **Performance Matters**: Fast experiences are better experiences

## Color Palette

### Primary Colors
```css
--zeno-primary: #0D1B2A;      /* Deep Space Blue */
--zeno-secondary: #415A77;    /* Slate Blue */
--zeno-accent: #FF9E00;       /* Amber Gold */
--zeno-background: #F8F9FA;   /* Light Gray */
--zeno-surface: #FFFFFF;      /* White */
Text Colors
css
--zeno-text-primary: #212529;   /* Charcoal - Body text */
--zeno-text-secondary: #6C757D; /* Medium Gray - Supporting text */
--zeno-text-tertiary: #ADB5BD;  /* Light Gray - Placeholders, hints */
Semantic Colors
css
--zeno-success: #2E7D32;    /* Forest Green - Success states */
--zeno-warning: #ED6C02;    /* Burnt Orange - Warnings, alerts */
--zeno-error: #D32F2F;      /* Crimson - Errors, destructive actions */
--zeno-info: #0288D1;       /* Azure Blue - Informational messages */
Interactive States
css
--zeno-hover: rgba(13, 27, 42, 0.04);      /* Hover background */
--zeno-active: rgba(13, 27, 42, 0.08);     /* Active/pressed state */
--zeno-focus: rgba(255, 158, 0, 0.16);     /* Focus ring color */
--zeno-disabled: rgba(108, 117, 125, 0.38);/* Disabled state opacity */
Typography
Font Family
Zeno uses the system font stack for optimal performance and familiarity:

css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
             'Helvetica Neue', Arial, sans-serif;
Font Scale
css
--zeno-font-xs: 0.75rem;     /* 12px - Labels, captions */
--zeno-font-sm: 0.875rem;    /* 14px - Small text, tooltips */
--zeno-font-base: 1rem;      /* 16px - Body text, paragraphs */
--zeno-font-lg: 1.125rem;    /* 18px - Lead text, large buttons */
--zeno-font-xl: 1.25rem;     /* 20px - Subheadings */
--zeno-font-2xl: 1.5rem;     /* 24px - Headings */
--zeno-font-3xl: 1.875rem;   /* 30px - Large headings */
--zeno-font-4xl: 2.25rem;    /* 36px - Display text */
Font Weights
css
--zeno-font-light: 300;      /* Light - for subtle text */
--zeno-font-regular: 400;    /* Regular - default weight */
--zeno-font-medium: 500;     /* Medium - emphasis, buttons */
--zeno-font-semibold: 600;   /* Semibold - headings */
--zeno-font-bold: 700;       /* Bold - strong emphasis */
Line Heights
css
--zeno-leading-tight: 1.25;     /* Tight - headings */
--zeno-leading-snug: 1.375;     /* Snug - UI text */
--zeno-leading-normal: 1.5;     /* Normal - body text */
--zeno-leading-relaxed: 1.625;  /* Relaxed - long form */
--zeno-leading-loose: 2;        /* Loose - poetry, special */
Spacing
Spacing Scale (8px base unit)
css
--zeno-space-1: 4px;    /* 0.25rem - Tiny spacing */
--zeno-space-2: 8px;    /* 0.5rem  - Small spacing */
--zeno-space-3: 12px;   /* 0.75rem - Medium-small */
--zeno-space-4: 16px;   /* 1rem    - Base unit */
--zeno-space-5: 20px;   /* 1.25rem - Medium */
--zeno-space-6: 24px;   /* 1.5rem  - Medium-large */
--zeno-space-8: 32px;   /* 2rem    - Large */
--zeno-space-10: 40px;  /* 2.5rem  - Extra large */
--zeno-space-12: 48px;  /* 3rem    - 2x large */
--zeno-space-16: 64px;  /* 4rem    - 4x large */
--zeno-space-20: 80px;  /* 5rem    - 5x large */
Spacing Usage Examples
css
/* Padding */
padding: var(--zeno-space-4);               /* 16px all sides */
padding: var(--zeno-space-2) var(--zeno-space-4); /* 8px top/bottom, 16px left/right */

/* Margin */
margin-bottom: var(--zeno-space-6);         /* 24px bottom margin */
margin: 0 auto;                             /* Center with auto margins */

/* Gap (for flex/grid) */
gap: var(--zeno-space-3);                   /* 12px between items */
Border Radius
css
--zeno-radius-xs: 2px;      /* Extra small - tags, badges */
--zeno-radius-sm: 4px;      /* Small - buttons, inputs */
--zeno-radius-md: 8px;      /* Medium - cards, dropdowns */
--zeno-radius-lg: 12px;     /* Large - large cards, modals */
--zeno-radius-xl: 16px;     /* Extra large - banners, hero */
--zeno-radius-round: 50%;   /* Round - circles, avatars */
--zeno-radius-pill: 9999px; /* Pill - pill-shaped buttons */
Shadows & Elevation
css
--zeno-shadow-xs: 0 1px 2px rgba(13, 27, 42, 0.05);
--zeno-shadow-sm: 0 2px 4px rgba(13, 27, 42, 0.08);
--zeno-shadow-md: 0 4px 8px rgba(13, 27, 42, 0.12);
--zeno-shadow-lg: 0 8px 16px rgba(13, 27, 42, 0.16);
--zeno-shadow-xl: 0 16px 32px rgba(13, 27, 42, 0.2);
Elevation Usage
css
/* Card with subtle shadow */
.card {
  box-shadow: var(--zeno-shadow-sm);
  border-radius: var(--zeno-radius-md);
}

/* Modal with pronounced shadow */
.modal {
  box-shadow: var(--zeno-shadow-xl);
  border-radius: var(--zeno-radius-lg);
}

/* Floating action button */
.fab {
  box-shadow: var(--zeno-shadow-md);
  border-radius: var(--zeno-radius-round);
}
Transitions & Animations
Timing Functions
css
--zeno-transition-fast: 150ms ease;
--zeno-transition-base: 250ms ease;
--zeno-transition-slow: 350ms ease;
Transition Usage
css
/* Smooth hover effects */
.button {
  transition: background-color var(--zeno-transition-fast),
              transform var(--zeno-transition-base);
}

.button:hover {
  background-color: var(--zeno-hover);
  transform: translateY(-1px);
}

/* Modal animations */
.modal {
  transition: opacity var(--zeno-transition-base),
              transform var(--zeno-transition-base);
}

.modal-enter {
  opacity: 0;
  transform: translateY(-20px);
}
Z-index Layers
css
--zeno-z-dropdown: 1000;        /* Dropdowns, tooltips */
--zeno-z-sticky: 1020;          /* Sticky headers */
--zeno-z-fixed: 1030;           /* Fixed elements */
--zeno-z-modal-backdrop: 1040;  /* Modal backdrops */
--zeno-z-modal: 1050;           /* Modals, dialogs */
--zeno-z-popover: 1060;         /* Popovers */
--zeno-z-tooltip: 1070;         /* Tooltips */
--zeno-z-toast: 1080;           /* Toast notifications */
Component Library
Buttons
css
/* Primary Button */
.btn-primary {
  background-color: var(--zeno-accent);
  color: var(--zeno-primary);
  padding: var(--zeno-space-3) var(--zeno-space-6);
  border-radius: var(--zeno-radius-lg);
  border: none;
  font-weight: var(--zeno-font-medium);
  font-size: var(--zeno-font-base);
  cursor: pointer;
  transition: all var(--zeno-transition-fast);
}

.btn-primary:hover {
  background-color: #FFB133;
  transform: translateY(-1px);
  box-shadow: var(--zeno-shadow-sm);
}

/* Secondary Button */
.btn-secondary {
  background-color: var(--zeno-surface);
  color: var(--zeno-text-primary);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* Outline Button */
.btn-outline {
  background-color: transparent;
  color: var(--zeno-accent);
  border: 1px solid var(--zeno-accent);
}

/* Button Sizes */
.btn-sm {
  padding: var(--zeno-space-2) var(--zeno-space-4);
  font-size: var(--zeno-font-sm);
}

.btn-lg {
  padding: var(--zeno-space-4) var(--zeno-space-8);
  font-size: var(--zeno-font-lg);
}
Cards
css
/* Base Card */
.card {
  background-color: var(--zeno-surface);
  border-radius: var(--zeno-radius-lg);
  box-shadow: var(--zeno-shadow-sm);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all var(--zeno-transition-base);
}

.card:hover {
  box-shadow: var(--zeno-shadow-md);
  transform: translateY(-2px);
}

/* Card Header */
.card-header {
  padding: var(--zeno-space-4) var(--zeno-space-6);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

/* Card Content */
.card-content {
  padding: var(--zeno-space-6);
}

/* Card Footer */
.card-footer {
  padding: var(--zeno-space-4) var(--zeno-space-6);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background-color: var(--zeno-background);
}
Forms
css
/* Input Fields */
.input {
  width: 100%;
  padding: var(--zeno-space-3) var(--zeno-space-4);
  background-color: var(--zeno-background);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--zeno-radius-md);
  font-size: var(--zeno-font-base);
  color: var(--zeno-text-primary);
  transition: all var(--zeno-transition-fast);
}

.input:focus {
  outline: none;
  border-color: var(--zeno-accent);
  box-shadow: 0 0 0 3px var(--zeno-focus);
}

.input::placeholder {
  color: var(--zeno-text-tertiary);
}

/* Labels */
.label {
  display: block;
  font-size: var(--zeno-font-sm);
  font-weight: var(--zeno-font-medium);
  color: var(--zeno-text-primary);
  margin-bottom: var(--zeno-space-2);
}

/* Form Groups */
.form-group {
  margin-bottom: var(--zeno-space-4);
}

.form-group .label {
  margin-bottom: var(--zeno-space-2);
}

.form-group .input {
  margin-bottom: var(--zeno-space-1);
}

.form-group .helper-text {
  font-size: var(--zeno-font-xs);
  color: var(--zeno-text-tertiary);
  margin-top: var(--zeno-space-1);
}
Navigation
css
/* Sidebar Navigation */
.sidebar {
  background-color: var(--zeno-primary);
  color: white;
  width: 280px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--zeno-space-3);
  padding: var(--zeno-space-3) var(--zeno-space-4);
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  border-radius: var(--zeno-radius-md);
  transition: all var(--zeno-transition-fast);
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
}

/* Top Navigation */
.top-nav {
  background-color: var(--zeno-surface);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: var(--zeno-space-4);
}

/* Breadcrumbs */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--zeno-space-2);
  font-size: var(--zeno-font-sm);
  color: var(--zeno-text-secondary);
}

.breadcrumb-item:not(:last-child)::after {
  content: "/";
  margin-left: var(--zeno-space-2);
  color: var(--zeno-text-tertiary);
}
Widgets
css
/* Base Widget */
.widget {
  background-color: var(--zeno-surface);
  border-radius: var(--zeno-radius-xl);
  box-shadow: var(--zeno-shadow-sm);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all var(--zeno-transition-base);
  overflow: hidden;
}

.widget:hover {
  box-shadow: var(--zeno-shadow-md);
  transform: translateY(-2px);
}

/* Widget Header */
.widget-header {
  padding: var(--zeno-space-4) var(--zeno-space-6);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.widget-title {
  display: flex;
  align-items: center;
  gap: var(--zeno-space-3);
  font-weight: var(--zeno-font-semibold);
  color: var(--zeno-text-primary);
}

/* Widget Content */
.widget-content {
  padding: var(--zeno-space-6);
}
Layout System
Grid System
css
/* Grid Container */
.grid {
  display: grid;
  gap: var(--zeno-space-6);
}

/* Responsive Grid Columns */
.grid-cols-1 {
  grid-template-columns: repeat(1, 1fr);
}

.grid-cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

/* Auto-fit Grid (responsive) */
.grid-auto-fit {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
Flexbox Utilities
css
/* Flex Container */
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.flex-row {
  flex-direction: row;
}

/* Alignment */
.items-center {
  align-items: center;
}

.items-start {
  align-items: flex-start;
}

.items-end {
  align-items: flex-end;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.justify-around {
  justify-content: space-around;
}

/* Spacing */
.gap-2 {
  gap: var(--zeno-space-2);
}

.gap-4 {
  gap: var(--zeno-space-4);
}

.gap-6 {
  gap: var(--zeno-space-6);
}
Responsive Design
Breakpoints
css
/* Mobile First Approach */

/* Base styles (mobile) */
.component {
  width: 100%;
  padding: var(--zeno-space-4);
}

/* Tablet (768px and up) */
@media (min-width: 768px) {
  .component {
    width: 50%;
    padding: var(--zeno-space-6);
  }
}

/* Desktop (1024px and up) */
@media (min-width: 1024px) {
  .component {
    width: 33.333%;
    padding: var(--zeno-space-8);
  }
}

/* Large Desktop (1280px and up) */
@media (min-width: 1280px) {
  .component {
    width: 25%;
  }
}
Responsive Utility Classes
css
/* Hide/Show based on screen size */
.hidden { display: none; }
.block { display: block; }

@media (min-width: 768px) {
  .md\:hidden { display: none; }
  .md\:block { display: block; }
  .md\:flex { display: flex; }
}

@media (min-width: 1024px) {
  .lg\:hidden { display: none; }
  .lg\:block { display: block; }
}
Themes
Light Theme (Default)
css
[data-theme="light"] {
  --zeno-primary: #0D1B2A;
  --zeno-secondary: #415A77;
  --zeno-background: #F8F9FA;
  --zeno-surface: #FFFFFF;
  --zeno-text-primary: #212529;
  --zeno-text-secondary: #6C757D;
  --zeno-hover: rgba(13, 27, 42, 0.04);
  --zeno-active: rgba(13, 27, 42, 0.08);
}
Dark Theme
css
[data-theme="dark"] {
  --zeno-primary: #0A1422;
  --zeno-secondary: #33475C;
  --zeno-background: #121212;
  --zeno-surface: #1E1E1E;
  --zeno-text-primary: #E9ECEF;
  --zeno-text-secondary: #CED4DA;
  --zeno-hover: rgba(255, 255, 255, 0.04);
  --zeno-active: rgba(255, 255, 255, 0.08);
}
High Contrast Theme
css
[data-theme="high-contrast"] {
  --zeno-primary: #000000;
  --zeno-secondary: #333333;
  --zeno-accent: #FFFF00;
  --zeno-background: #FFFFFF;
  --zeno-surface: #FFFFFF;
  --zeno-text-primary: #000000;
  --zeno-text-secondary: #333333;
  --zeno-border: #000000;
}
Auto Theme
JavaScript detects system preference:

javascript
if (theme === 'auto') {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.body.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
}
Accessibility Guidelines
Color Contrast
Text must have at least 4.5:1 contrast ratio (WCAG AA)

Large text (18pt+): 3:1 contrast ratio

Interactive elements: Clear visual focus states

Focus Management
css
/* Visible focus indicator */
:focus-visible {
  outline: 2px solid var(--zeno-accent);
  outline-offset: 2px;
}

/* Remove focus outline for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
Screen Reader Support
html
<!-- Semantic HTML -->
<nav aria-label="Main navigation">
  <ul role="menubar">
    <li role="menuitem"><a href="#">Home</a></li>
  </ul>
</nav>

<!-- ARIA labels for icons -->
<button aria-label="Close">
  <svg>...</svg>
</button>

<!-- Live regions for dynamic content -->
<div aria-live="polite" aria-atomic="true">
  <!-- Dynamic content updates here -->
</div>
Keyboard Navigation
Tab order follows visual layout

Skip links for bypassing navigation

All interactive elements keyboard accessible

Escape key closes modals/dropdowns

Icons
Zeno uses Lucide Icons - a consistent, open-source icon set.

Usage
html
<!-- CDN (development) -->
<script src="https://unpkg.com/lucide@latest" defer></script>

<!-- In HTML -->
<span data-lucide="home"></span>
<span data-lucide="mail"></span>
<span data-lucide="calendar"></span>

<!-- In JavaScript -->
<script>
  lucide.createIcons(); // Initialize all icons
</script>
Icon Sizing
css
.icon-sm {
  width: 16px;
  height: 16px;
}

.icon-md {
  width: 20px;
  height: 20px;
}

.icon-lg {
  width: 24px;
  height: 24px;
}

.icon-xl {
  width: 32px;
  height: 32px;
}
Usage Examples
Creating a New Component
css
/* 1. Use design tokens */
.new-component {
  background-color: var(--zeno-surface);
  color: var(--zeno-text-primary);
  padding: var(--zeno-space-4);
  border-radius: var(--zeno-radius-md);
  box-shadow: var(--zeno-shadow-sm);
}

/* 2. Add interactive states */
.new-component:hover {
  background-color: var(--zeno-hover);
  box-shadow: var(--zeno-shadow-md);
}

.new-component:focus-visible {
  outline: 2px solid var(--zeno-accent);
  outline-offset: 2px;
}

/* 3. Make it responsive */
@media (min-width: 768px) {
  .new-component {
    padding: var(--zeno-space-6);
  }
}
Theme Switching
javascript
// Toggle between light/dark themes
function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('zeno-theme', newTheme);
  
  // Update theme switcher UI
  updateThemeSwitcher(newTheme);
}
Best Practices
Do's
✅ Use design tokens for all styling
✅ Follow mobile-first responsive approach
✅ Test color contrast for accessibility
✅ Use semantic HTML elements
✅ Include ARIA attributes for complex components
✅ Maintain consistent spacing with the spacing scale

Don'ts
❌ Hardcode colors, sizes, or spacing
❌ Use !important (except for utilities)
❌ Create overly complex selectors
❌ Forget to test in multiple themes
❌ Skip keyboard navigation testing
❌ Ignore touch targets on mobile (min 44×44px)

Testing the Design System
Visual Regression
Test components in all themes (light, dark, high-contrast)

Test at different screen sizes

Verify color contrast meets WCAG standards

Check focus states are visible

Browser Compatibility
Test in:

Chrome/Edge (latest)

Firefox (latest)

Safari (latest)

Mobile browsers (iOS Safari, Chrome Android)

Performance
Keep CSS selectors simple

Minimize repaints/reflows

Use CSS Grid/Flexbox for layout

Avoid expensive CSS properties (box-shadow with spread)

Contributing to the Design System
Check if a token exists before creating new values

Follow naming conventions: --zeno-[category]-[property]

Update documentation when adding/changing tokens

Test across themes and screen sizes

Consider accessibility implications

Resources
Theme CSS File

Design Figma Mockups (to be created)

WCAG Accessibility Guidelines

Lucide Icons Documentation

CSS Custom Properties MDN

Last Updated: January 15, 2024
Version: 1.0.0