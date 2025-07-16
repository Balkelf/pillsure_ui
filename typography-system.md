# Pillsure Typography System

## Overview

Our typography system is designed to be consistent, maintainable, and semantic. It uses Open Sans from Google Fonts with proper Tailwind classes to ensure type consistency across the application.

## Type Scale

| Style | Usage | Classes |
|-------|-------|---------|
| Display 1 | Hero headlines | `text-3xl font-medium tracking-tight` |
| Display 2 | Large headlines | `text-2xl font-medium tracking-tight` |
| Heading 1 | Main section titles | `text-2xl font-medium tracking-tight` |
| Heading 2 | Subsection titles | `text-xl font-medium tracking-tight` |
| Heading 3 | Card titles, small sections | `text-lg font-medium tracking-tight` |
| Body 1 | Main content | `text-base font-normal tracking-normal` |
| Body 2 | Secondary content | `text-sm font-normal tracking-normal` |
| Caption | Small text, metadata | `text-xs font-normal tracking-wide` |
| Label | Form labels, buttons | `text-sm font-medium tracking-wide` |

## Usage Examples

```tsx
// Hero Section
<h1 className="text-3xl font-medium tracking-tight">
  Welcome to Pillsure
</h1>

// Section Title
<h2 className="text-2xl font-medium tracking-tight">
  Medication Schedule
</h2>

// Card Title
<h3 className="text-lg font-medium tracking-tight">
  Today's Medications
</h3>

// Body Text
<p className="text-base font-normal tracking-normal">
  Manage your prescription schedule with ease.
</p>

// Form Label
<label className="text-sm font-medium tracking-wide">
  Medication Name
</label>

// Caption
<span className="text-xs font-normal tracking-wide">
  Last updated 2 hours ago
</span>
```

## Best Practices

1. **Use Semantic Classes**: Instead of direct font-weight classes, use our semantic typography classes.
2. **Maintain Hierarchy**: Follow the type scale for consistent visual hierarchy.
3. **Responsive Text**: Use Tailwind's responsive prefixes for different screen sizes.
4. **Color System**: Use our color system for text colors:
   - Primary text: `text-foreground`
   - Secondary text: `text-muted-foreground`
   - Accent text: `text-accent-foreground`

## Color System

```tsx
// Primary text
<p className="text-foreground">Main content</p>

// Secondary text
<p className="text-muted-foreground">Supporting text</p>

// Accent text
<p className="text-accent-foreground">Highlighted text</p>
```

## Responsive Typography

```tsx
// Responsive heading
<h1 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight">
  Responsive Title
</h1>

// Responsive body text
<p className="text-sm md:text-base font-normal tracking-normal">
  Responsive content
</p>
```

## Accessibility

- Maintain minimum contrast ratios (WCAG 2.1 AA)
- Use relative units (rem) for font sizes
- Ensure sufficient line height for readability
- Support text scaling up to 200% 