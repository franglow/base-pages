# Team Assets

## Founder portrait — `francisco.*`

**Current state:** temporary SVG silhouette placeholder (`francisco.svg`).
This unblocks downstream component work (`p1-08` FounderSignature, `p1-10` mounts) without forcing a photo decision yet.

### When you're ready to swap in the real photo

Drop the following two files at this same path:

- `francisco.jpg` — 512×512, under 60KB (JPEG quality 75–85)
- `francisco.webp` — 256×256, under 60KB (WebP quality 80)

Then open `src/components/sections/FounderSignature.astro` and switch the default `avatarUrl` import from `francisco.svg` → `francisco.jpg` (and add a `<source srcset="…francisco.webp" type="image/webp">` branch to the `<picture>` element).

Finally, delete `francisco.svg` so there's no dead asset lying around.

### Why two raster formats

- **JPEG 512×512** — universal fallback; retina-safe; survives email-client previews.
- **WebP 256×256** — 30–40% smaller payload, served by default to every modern browser. 256px is plenty because the component renders the avatar at 56px (so even on a 3× retina screen we only need 168px).

### How to generate from a source photo

Any tool works. Quick recipes:

**ImageMagick one-liners**

```bash
magick source.jpg -resize 512x512^ -gravity center -extent 512x512 -quality 82 francisco.jpg
magick francisco.jpg -resize 256x256 -quality 80 francisco.webp
```

**Squoosh.app (browser, no install)**

1. Drag source photo in → crop square → resize to 512×512.
2. Export as MozJPEG, quality 82 → `francisco.jpg`.
3. Reopen, resize to 256×256.
4. Export as WebP, quality 80 → `francisco.webp`.

### Size budget (enforced manually for now)

| File | Max | Why |
|---|---|---|
| `francisco.jpg` | 60 KB | Fallback for edge cases; keeps LCP budget tight. |
| `francisco.webp` | 60 KB | Served to every modern browser; must be tiny. |
| `francisco.svg` | — | Placeholder only; delete once rasters are in. |
