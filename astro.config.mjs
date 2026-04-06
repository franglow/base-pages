import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://basepages.dev',
  adapter: vercel(),
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          es: 'es',
          de: 'de',
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwind()],
  },
});
