# Pillsure Typography Reference

> Updated to follow unified design system as of YYYY-MM-DD.

## Font Family

Open Sans (Google Fonts), fallback: system-ui, sans-serif.

## Size Scale

| Role | Tailwind Token | Rem | Px |
|------|----------------|-----|----|
| XS   | text-xs        | 0.75rem | 12px |
| SM   | text-sm        | 0.875rem | 14px |
| Base | text-base      | 1rem | 16px |
| LG   | text-lg        | 1.125rem | 18px |
| XL   | text-xl        | 1.25rem | 20px |
| 2XL  | text-2xl       | 1.5rem | 24px |
| 3XL  | text-3xl       | 2rem | 32px |
| 4XL  | text-4xl       | 3rem | 48px |

## Font Weight

| Semantic | Tailwind Class | Weight |
|----------|----------------|--------|
| Regular  | font-normal    | 400 |
| Medium   | font-medium / font-bold / font-semibold | 500 *(re-mapped)* |

All headings (H1–H6) use Medium weight (500). Chart labels and paragraph text use Regular weight (400).

## Letter Spacing

| Token | Tailwind Class | Value |
|-------|----------------|-------|
| Tight | tracking-tight | -0.025em |
| Normal | tracking-normal | 0em |
| Wide | tracking-wide | 0.025em |
| Extra-wide | tracking-extra-wide | 0.1em |

*Use Tight for large headlines, Normal for body text, Wide for improved legibility in UI labels, and Extra-wide for all-caps text.*

---

### Quick Usage Examples

```html
<!-- Page Title -->
<h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>

<!-- Section Header -->
<h2 class="text-lg font-bold tracking-wide">Medication Schedule</h2>

<!-- Body Text -->
<p class="text-base font-normal tracking-normal">Manage your prescription schedule.</p>

<!-- All-Caps Label -->
<span class="text-xs font-medium tracking-extra-wide uppercase">NEW</span>
``` 