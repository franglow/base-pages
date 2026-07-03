/**
 * Build Open Graph social-share images (1200x630) for each service tier.
 *
 * Single source of truth for the branded OG cards. Re-run whenever a
 * price or tagline changes:
 *
 *     node scripts/build-og-images.mjs
 *
 * Requires `sharp` (already a project dependency) to rasterize SVG -> PNG.
 */

import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '../public/images/og');

const BG_TOP = '#151d2b';
const BG_BOTTOM = '#0f1520';
const TITLE = '#ffffff';
const SUBTITLE = '#9aa3b4';
const SAGE = '#A8BFAF';
const CREAM = '#E8DDC8';
const PEACH = '#F6D7C8';

const TIERS = [
  { slug: 'og-starter', title: ['Starter', 'Package'], sub: 'From \u20ac890 \u00b7 Live in 3\u20135 days' },
  { slug: 'og-growth', title: ['Growth', 'Package'], sub: 'From \u20ac1,750 \u00b7 10-day funnel launch' },
  { slug: 'og-scale', title: ['Scale', 'Package'], sub: 'From \u20ac5,800 \u00b7 Built to scale' },
  { slug: 'og-care', title: ['Continuous', 'Care'], sub: 'From \u20ac190/month \u00b7 Cancel anytime' },
  { slug: 'og-care-plus', title: ['Care', 'Plus'], sub: 'Tune-up from \u20ac490 \u00b7 then \u20ac290/mo' },
  { slug: 'og-partnership', title: ['Designer', 'Partnership'], sub: 'From \u20ac1,750/page \u00b7 white-label dev' },
];

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function svg({ title, sub }) {
  const W = 1200;
  const H = 630;
  const titleSize = 96;
  const lineHeight = 100;
  const startY = title.length > 1 ? 236 : 300;
  const titleLines = title
    .map((line, i) =>
      `<text x="80" y="${startY + i * lineHeight}" font-family="Arial, Helvetica, sans-serif" font-size="${titleSize}" font-weight="700" fill="${TITLE}" letter-spacing="-2">${esc(line)}</text>`
    )
    .join('\n    ');
  const subY = startY + title.length * lineHeight + 6;

  return Buffer.from(`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${BG_TOP}"/>
      <stop offset="1" stop-color="${BG_BOTTOM}"/>
    </linearGradient>
    <radialGradient id="orbSage" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${SAGE}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${SAGE}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orbCream" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${CREAM}" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="${CREAM}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orbPeach" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${PEACH}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${PEACH}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <g>
    <ellipse cx="980" cy="250" rx="300" ry="290" fill="url(#orbSage)"/>
    <ellipse cx="1010" cy="330" rx="300" ry="300" fill="url(#orbCream)"/>
    <ellipse cx="1050" cy="430" rx="290" ry="280" fill="url(#orbPeach)"/>
  </g>

  <rect width="${W}" height="${H}" fill="#0f1520" opacity="0.06"/>

  ${titleLines}

  <text x="82" y="${subY}" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="400" fill="${SUBTITLE}">${esc(sub)}</text>

  <text x="80" y="566" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="${TITLE}">base-pages</text>
</svg>`);
}

mkdirSync(OUT_DIR, { recursive: true });

for (const tier of TIERS) {
  const out = resolve(OUT_DIR, `${tier.slug}.png`);
  await sharp(svg(tier)).png().toFile(out);
  console.log(`  [ok] ${tier.slug}.png  (${tier.sub})`);
}

console.log(`\nDone. ${TIERS.length} OG images written to public/images/og/ (1200x630).`);
