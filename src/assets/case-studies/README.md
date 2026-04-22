# Case Study Assets

Drop each project's hero screenshot here. The `CaseStudyBlock.astro` component falls back to `placeholder.svg` whenever a case study does not supply an `imageUrl`, so you can mount blocks before the real shots are ready.

## File naming

Use kebab-case, slug-friendly names aligned to the client:

```
martas-yoga.webp
schoeneberg-cafe.webp
berlin-illustrator.webp
```

Pair each with a JPG fallback if you prefer non-WebP browsers to fetch something smaller than the SVG placeholder:

```
martas-yoga.jpg
```

## Size budget

- Dimensions: **1600 × 1200** source, served as **800 × 600** via `astro:assets`.
- Target weight: **≤ 120 KB** (WebP Q80) / **≤ 180 KB** (JPG Q82).
- Color profile: sRGB. Strip EXIF.

## Generation recipe (macOS, ImageMagick + cwebp)

```bash
# From a 1600x1200 master
magick master.png -resize 1600x1200^ -gravity center -extent 1600x1200 -strip -quality 82 martas-yoga.jpg
cwebp -q 80 martas-yoga.jpg -o martas-yoga.webp
```

## Wiring into the component

```astro
---
import martasYoga from '../../assets/case-studies/martas-yoga.webp';
---

<CaseStudyBlock
  clientName="Marta's Yoga Retreats"
  industry="Wellness · Berlin"
  headlineMetric={{ value: '+180%', label: 'inquiries in 6 weeks' }}
  challenge="Handwritten inquiries, missed retreat bookings."
  outcome="Bilingual landing page + instant quote form. Calls doubled."
  quote="The inquiries pile showed up the week we launched."
  quoteAttribution="Marta R., Founder"
  imageUrl={martasYoga.src}
  imageAlt="Marta's Yoga Retreats homepage shown on laptop"
  projectUrl="/work/martas-yoga"
/>
```

## Replacing the placeholder site-wide

You don't need to remove `placeholder.svg`. The component only pulls it when `imageUrl` is missing. Keeping it means any future case study without a shot yet still renders gracefully.
