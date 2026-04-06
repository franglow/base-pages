#!/bin/bash

echo "🚀 Iniciando configuración de 'Base Pages'..."

# 1. Crear estructura de carpetas (Ensure ALL directories exist)
echo "📁 Creando estructura de directorios..."
mkdir -p src/styles
mkdir -p src/components/ui
mkdir -p src/components/sections
mkdir -p src/layouts
mkdir -p src/pages
mkdir -p src/content/i18n
mkdir -p public/images/hero

# 2. Archivos de Configuración Base
echo "⚙️  Configurando Proyecto 'base-pages'..."

cat <<EOF > package.json
{
  "name": "base-pages",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0"
  }
}
EOF

cat <<EOF > astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwind()],
  },
});
EOF

cat <<EOF > tsconfig.json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
EOF

# 3. Estilos y Tema (Theme)
echo "🎨 Escribiendo Estilos..."

cat <<EOF > src/styles/theme.css
:root {
  /* --- TYPOGRAPHY --- */
  --font-heading: "Inter", system-ui, -apple-system, sans-serif;
  --font-body: "Inter", system-ui, -apple-system, sans-serif;

  /* --- PALETTE (base-pages.com Spec) --- */
  --color-bg: #F9F9F7;
  --color-surface: #FFFFFF;
  --color-text: #111111;
  --color-text-muted: #666666; 
  --color-accent: #000000;
  --color-accent-fg: #FFFFFF;
  
  /* --- SPACING & SHAPE --- */
  --radius-button: 9999px;
  --radius-card: 24px;
  --container-max: 1440px;
  --header-height: 80px;
}
EOF

cat <<EOF > src/styles/global.css
@import "tailwindcss";
@import "./theme.css";

@theme {
  --font-heading: var(--font-heading);
  --font-body: var(--font-body);
  --color-background: var(--color-bg);
  --color-foreground: var(--color-text);
  --color-primary: var(--color-accent);
}

body {
  font-family: var(--font-body);
  background-color: var(--color-background);
  color: var(--color-foreground);
  antialiased;
}
EOF

# 4. Componentes UI
echo "🧩 Creando Componentes UI..."

cat <<EOF > src/components/ui/Button.astro
---
interface Props {
  href?: string;
  variant?: 'primary' | 'outline';
  class?: string;
}

const { href, variant = 'primary', class: className } = Astro.props;

const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-[var(--radius-button)] font-medium transition-colors cursor-pointer";
const variants = {
  primary: "bg-[var(--color-accent)] text-[var(--color-accent-fg)] hover:opacity-90",
  outline: "border border-current hover:bg-black/5"
};
---

{href ? (
  <a href={href} class:list={[baseStyles, variants[variant], className]}>
    <slot />
  </a>
) : (
  <button class:list={[baseStyles, variants[variant], className]}>
    <slot />
  </button>
)}
EOF

# 5. Secciones (Header, Hero, Footer)
# Nota: Mantenemos la visual "base-pages.com" por ahora como pediste para la réplica exacta,
# pero el proyecto estructuralmente ya es "base-pages".

cat <<EOF > src/components/sections/Header.astro
---
import Button from '../ui/Button.astro';
interface Props {
  navData: any;
}
const { navData } = Astro.props;
---

<header class="fixed top-0 left-0 right-0 z-50 h-[var(--header-height)] flex items-center px-4 md:px-8 bg-[var(--color-bg)]/80 backdrop-blur-md">
  <div class="w-full max-w-[var(--container-max)] mx-auto flex justify-between items-center">
    <a href="/" class="flex items-center gap-2 font-bold text-xl tracking-tight">
      <span>base-pages.com™</span>
    </a>

    <nav class="hidden md:flex items-center gap-8">
      <div class="flex gap-6 text-sm font-medium text-[var(--color-text-muted)]">
        {navData.items.map((item: any) => (
          <a href={item.href} class="hover:text-[var(--color-text)] transition-colors">
            {item.label}
          </a>
        ))}
      </div>
      <Button variant="outline" class="!px-6 !py-2 text-sm">{navData.cta}</Button>
    </nav>

    <button class="md:hidden p-2">
      <div class="w-6 h-0.5 bg-current mb-1.5"></div>
      <div class="w-6 h-0.5 bg-current"></div>
    </button>
  </div>
</header>
EOF

cat <<EOF > src/components/sections/Hero.astro
---
import Button from '../ui/Button.astro';

interface Props {
  data: any;
}
const { data } = Astro.props;

// Configuración de imágenes flotantes
const images = [
  { src: "/images/hero/paper-bag.jpg",  pos: "top-[25%] left-[20%]",    mobile: "hidden" },
  { src: "/images/hero/hoodie-guy.webp", pos: "top-[10%] left-[35%]",    mobile: "top-[5%] left-[70%]" },
  { src: "/images/hero/desktop-letter.webp",     pos: "top-[12%] right-[35%]",   mobile: "hidden" },
  { src: "/images/hero/girl-boy.webp",   pos: "top-[30%] right-[20%]",   mobile: "top-[60%] left-[10%]" },
  { src: "/images/hero/laptop.webp",     pos: "bottom-[10%] left-[38%]", mobile: "top-[10%] left-[10%]" },
  { src: "/images/hero/watch.webp",      pos: "bottom-[20%] left-[25%]", mobile: "top-[15%] right-[10%]" },
  { src: "/images/hero/guy-running.webp",    pos: "bottom-[15%] right-[25%]",mobile: "hidden" },
  { src: "/images/hero/colorfull-bg.webp",         pos: "bottom-[30%] right-[15%]",mobile: "top-[70%] right-[5%]" }
];
---

<section class="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center pt-[var(--header-height)]">
  
  <div class="absolute inset-0 pointer-events-none z-0 max-w-[1600px] mx-auto">
    {images.map((img) => (
      <div class:list={[
        "absolute w-24 md:w-32 lg:w-40 aspect-square rounded-2xl overflow-hidden shadow-sm transition-transform hover:scale-105 duration-500",
        img.pos,
        img.mobile === 'hidden' ? 'hidden md:block' : img.mobile
      ]}>
        <img src={img.src} alt="" class="w-full h-full object-cover" />
      </div>
    ))}
  </div>

  <div class="relative z-10 text-center max-w-2xl px-4 space-y-8">
    <h1 class="text-5xl md:text-7xl font-semibold tracking-tight text-balance leading-[1.1]">
      {data.title}
    </h1>
    <p class="text-lg md:text-xl text-[var(--color-text-muted)]">
      {data.subtitle}
    </p>
    <div class="pt-4">
      <Button class="bg-black text-white px-8 py-4 text-base">{data.cta}</Button>
    </div>
  </div>

  <div class="absolute bottom-8 left-8 hidden md:flex items-center gap-2 text-sm font-medium">
    <span class="text-lg">🌐</span> {data.location}
  </div>

  <div class="absolute bottom-8 right-8 z-20">
    <button class="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-semibold hover:shadow-md transition-shadow">
      {data.promo}
    </button>
  </div>
</section>
EOF

cat <<EOF > src/components/sections/Footer.astro
---
interface Props {
  data: any;
}
const { data } = Astro.props;
---

<footer class="px-4 pb-4">
  <div class="bg-white rounded-[var(--radius-card)] px-8 pt-16 pb-8 md:px-16 md:pb-4 max-w-[var(--container-max)] mx-auto relative overflow-hidden">
    
    <div class="flex flex-col md:flex-row justify-between items-start gap-12 mb-32">
      <div class="flex gap-16">
        {data.columns.map((col: any) => (
          <div class="space-y-4">
            <h4 class="font-medium text-sm text-[var(--color-text-muted)] min-h-[20px]">{col.title}</h4>
            <ul class="space-y-2">
              {col.links.map((link: any) => (
                <li>
                  <a href={link.href} class="text-sm font-medium hover:text-[var(--color-text-muted)] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div class="flex gap-4">
         <a href="#" class="text-xl">📷</a>
         <a href="#" class="text-xl">✖</a>
         <a href="#" class="text-xl">▶</a>
      </div>
    </div>

    <div class="flex flex-col md:flex-row justify-between text-xs text-[var(--color-text-muted)] mb-4 md:mb-0 relative z-10">
      <span>{data.copyright}</span>
      <span>{data.credits}</span>
    </div>

    <div class="mt-8 md:-mb-12 text-center md:text-left">
      <span class="text-[18vw] leading-[0.8] font-bold tracking-tighter block select-none pointer-events-none">
        base-pages.com™
      </span>
    </div>
  </div>
</footer>
EOF

# 6. Contenido y Layouts (EN/DE support)
echo "📝 Escribiendo Contenido..."

cat <<EOF > src/content/i18n/en.json
{
  "nav": {
    "items": [
      { "label": "Home", "href": "/" },
      { "label": "About", "href": "/about" },
      { "label": "Works", "href": "/works" },
      { "label": "Blog", "href": "/blog" }
    ],
    "cta": "Contact"
  },
  "hero": {
    "title": "Designs that resonate",
    "subtitle": "A design team, ready to serve — always.",
    "cta": "Learn more",
    "location": "Canada",
    "promo": "Use for free"
  },
  "footer": {
    "columns": [
      {
        "title": "Pages",
        "links": [
          { "label": "Home", "href": "/" },
          { "label": "About", "href": "/about" },
          { "label": "Works", "href": "/works" }
        ]
      },
      {
        "title": " ",
        "links": [
          { "label": "Work page", "href": "/work" },
          { "label": "Blog", "href": "/blog" },
          { "label": "Contact", "href": "/contact" }
        ]
      }
    ],
    "copyright": "© 2025 base-pages.com",
    "credits": "Powered by Webflow · Created by Template Supply"
  }
}
EOF

# Agregando soporte para tu dominio DE
cat <<EOF > src/content/i18n/de.json
{
  "nav": {
    "items": [
      { "label": "Startseite", "href": "/" },
      { "label": "Über uns", "href": "/about" },
      { "label": "Projekte", "href": "/works" },
      { "label": "Blog", "href": "/blog" }
    ],
    "cta": "Kontakt"
  },
  "hero": {
    "title": "Design, das bewegt",
    "subtitle": "Ein Designteam, immer zu Diensten.",
    "cta": "Mehr erfahren",
    "location": "Deutschland",
    "promo": "Kostenlos nutzen"
  },
  "footer": {
    "columns": [
      {
        "title": "Seiten",
        "links": [
          { "label": "Startseite", "href": "/" },
          { "label": "Über uns", "href": "/about" },
          { "label": "Projekte", "href": "/works" }
        ]
      },
      {
        "title": " ",
        "links": [
          { "label": "Arbeitsseite", "href": "/work" },
          { "label": "Blog", "href": "/blog" },
          { "label": "Kontakt", "href": "/contact" }
        ]
      }
    ],
    "copyright": "© 2025 base-pages.com",
    "credits": "Powered by Webflow · Erstellt von Template Supply"
  }
}
EOF

cat <<EOF > src/layouts/Layout.astro
---
import '../styles/global.css';
interface Props {
  title: string;
}
const { title } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <slot />
  </body>
</html>
EOF

cat <<EOF > src/pages/index.astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/sections/Header.astro';
import Hero from '../components/sections/Hero.astro';
import Footer from '../components/sections/Footer.astro';
import enData from '../content/i18n/en.json';
---

<Layout title="Base Pages">
  <Header navData={enData.nav} />
  <main>
    <Hero data={enData.hero} />
  </main>
  <Footer data={enData.footer} />
</Layout>
EOF

echo "✅ ÉXITO: Proyecto 'base-pages' configurado."
echo "👉 Ejecuta: 'npm install' y luego 'npm run dev'"