#!/usr/bin/env python3
"""
Build one-pager PDFs for each tier × language.

Generates PDF/1.4 files from scratch — no dependencies, produces
~2KB browser-viewable PDFs under ``public/one-pagers/{lang}/``.

Re-run whenever the source content below changes::

    python3 scripts/build-one-pagers.py
"""

from __future__ import annotations

import zlib
from pathlib import Path
from textwrap import dedent

# ---------------------------------------------------------------------------
# Source content — single source of truth for the 5 one-pagers × 3 languages.
# ---------------------------------------------------------------------------

TIERS_EN: list[dict] = [
    {
        "slug": "starter",
        "title": "The Starter Package",
        "subtitle": "Launch fast. Look amazing. Own the code.",
        "price": "From \u20ac890",
        "timeline": "3\u20135 working days",
        "sections": [
            ("What you get", [
                "Single long-form page, up to 4 sections",
                "Mobile-first responsive design",
                "Contact form wired to your inbox",
                "Decap headless CMS + 30 min training",
                "Core Web Vitals >= 95 Lighthouse",
            ]),
            ("Proof", [
                "Cornelia Jaeger - creative coach site, live in 5 days",
                "Carma Retreats - first retreat sold out at launch",
                "Starter clients ship in <7 days on average",
            ]),
            ("Included", [
                "SEO basics + sitemap + schema.org",
                "Analytics setup (Plausible or GA4)",
                "2 revision rounds on staging",
                "2 weeks free post-launch bug cover",
            ]),
        ],
    },
    {
        "slug": "growth",
        "title": "The Growth Package",
        "subtitle": "High-converting landing for paid campaigns.",
        "price": "From \u20ac1,750",
        "timeline": "10-day funnel launch · Lighthouse ≥ 95",
        "sections": [
            ("What you get", [
                "CRO-informed landing page, modular sections",
                "Meta / Google Ads / GA4 / GTM wired in",
                "CRM integration (HubSpot, Brevo, Zapier, ...)",
                "A/B testable component structure",
                "Consent Mode v2 + GDPR defaults",
            ]),
            ("Proof", [
                "Built for founders running EUR 1k+ / month in paid ads",
                "Target: sub-1.5 s LCP, green Core Web Vitals on 3G",
                "Message match to your ad creative by default",
            ]),
            ("Included", [
                "Conversion goal and event tagging",
                "Headless CMS so copy is editable by you",
                "Variant cloning for multi-campaign runs",
                "2 revision rounds on staging",
            ]),
        ],
    },
    {
        "slug": "scale",
        "title": "The Scale Package",
        "subtitle": "Headless CMS platform, built to scale.",
        "price": "From \u20ac5,800",
        "timeline": "4-week launch · Payable in 3 milestones",
        "sections": [
            ("What you get", [
                "Multi-page Astro architecture",
                "Headless CMS (Sanity, Storyblok or Decap)",
                "i18n-ready (English / Spanish / German)",
                "Advanced SEO + JSON-LD on every route",
                "GSAP / View Transitions polish",
            ]),
            ("Proof", [
                "Lighthouse \u2265 95 guaranteed on launch",
                "Designed for growing brands with editorial teams",
                "Content editors never break the layout",
                "All clients own the repo + credentials",
            ]),
            ("Included", [
                "Content migration from WordPress / Webflow / Notion",
                "Search Console + basic GEO plan for AI search",
                "2 revision rounds + handover training",
                "4 weeks free post-launch bug cover",
            ]),
        ],
    },
    {
        "slug": "care",
        "title": "Continuous Care",
        "subtitle": "Your website kept fast, safe and current - whoever built it.",
        "price": "From \u20ac190 / month",
        "timeline": "Cancel anytime",
        "sections": [
            ("What you get", [
                "Faster load times - I find what's slowing you down and fix it",
                "Regular security and software updates",
                "Round-the-clock speed & uptime monitoring",
                "Up to 2 hours of edits a month (text, images, small changes)",
                "A plain-English monthly report",
            ]),
            ("Works with your platform", [
                "Webflow, Wix, Squarespace, WordPress or custom builds",
                "I learn your site first - and never change it without asking",
                "Honest about what your platform's speed can and can't do",
            ]),
            ("Included", [
                "A reply within 48 hours, same-day for urgent issues",
                "Month-to-month, cancel anytime with 5 days' notice",
                "A real person on call - no ticket queues, no chatbots",
                "Only pay for what you use - pro-rated to the day",
            ]),
        ],
    },
    {
        "slug": "care-plus",
        "title": "Care Plus",
        "subtitle": "Get found on Google, locally, and in AI search.",
        "price": "Tune-up from \u20ac490 \u00b7 then \u20ac290 / month to maintain",
        "timeline": "Any platform \u00b7 Honest about what's possible",
        "sections": [
            ("What you get", [
                "Full speed tune-up \u2014 fast pages as the foundation",
                "Traditional SEO \u2014 titles, structure, and content search engines read",
                "Local search \u2014 Google Business Profile and location signals",
                "AI search readiness \u2014 structured for ChatGPT and Google AI answers",
                "Plain-English before-and-after report",
            ]),
            ("Works with your platform", [
                "Webflow, Wix, Squarespace, WordPress, Shopify or custom",
                "I built it or someone else did \u2014 doesn't matter",
                "Honest about what's possible on your platform",
                "Nothing changes without your say-so",
            ]),
            ("Included", [
                "Made for yoga teachers, therapists, studios and small businesses",
                "One-time tune-up or ongoing monthly plan",
                "Clear pricing, no lock-in",
                "A real person on call \u2014 no ticket queues",
            ]),
        ],
    },
    {
        "slug": "partnership",
        "title": "Designer Partnership",
        "subtitle": "Pixel-perfect dev your clients will think you wrote yourself.",
        "price": "From \u20ac1,750 / landing page",
        "timeline": "\u20ac2,800 / Embedded Studio Week",
        "sections": [
            ("What you get", [
                "Pixel-perfect implementation of your Figma file",
                "Astro or Next.js build with Tailwind, accessible by default",
                "Headless CMS integration (Sanity, Storyblok or Decap)",
                "Core Web Vitals + Lighthouse > 95 on launch",
                "Clean Git repo with documented components",
            ]),
            ("How it works", [
                "Brief + NDA: You share the Figma, I return a fixed estimate in 48h",
                "1-3 weeks per project",
                "First cut: Real HTML on a private staging URL, no Lorem Ipsum",
                "Design QA: We walk through together on Loom or live",
                "Handover: Repo, deploy pipeline, CMS access - all in your studio's name",
            ]),
            ("Included", [
                "Loom walkthrough at handover",
                "2 weeks free post-launch bug-fix cover",
                "White-label NDA signed before I see the file",
                "Fixed-scope, fixed-price invoices",
                "Repo is yours from day one",
            ]),
        ],
    },
]

TIERS_DE: list[dict] = [
    {
        "slug": "starter",
        "title": "Das Starter-Paket",
        "subtitle": "Schnell starten. Grossartig aussehen. Code gehoert dir.",
        "price": "Ab 890 \u20ac",
        "timeline": "3-5 Werktage",
        "sections": [
            ("Was Sie bekommen", [
                "Eine Langform-Seite, bis zu 4 Abschnitte",
                "Mobile-first responsives Design",
                "Kontaktformular, verbunden mit Ihrem Postfach",
                "Decap Headless CMS + 30 Min. Schulung",
                "Core Web Vitals >= 95 Lighthouse",
            ]),
            ("Nachweis", [
                "Cornelia Jaeger - kreative Coach-Website, in 5 Tagen live",
                "Carma Retreats - erstes Retreat beim Launch ausverkauft",
                "Starter-Kunden launchen in durchschnittlich <7 Tagen",
            ]),
            ("Enthalten", [
                "SEO-Grundlagen + Sitemap + schema.org",
                "Analytics-Setup (Plausible oder GA4)",
                "2 Revisionsrunden auf Staging",
                "2 Wochen kostenloser Post-Launch-Bugfix-Schutz",
            ]),
        ],
    },
    {
        "slug": "growth",
        "title": "Das Growth-Paket",
        "subtitle": "Hochkonvertierende Landingpage fuer bezahlte Kampagnen.",
        "price": "Ab 1.750 \u20ac",
        "timeline": "Funnel-Launch in 10 Tagen · Lighthouse ≥ 95",
        "sections": [
            ("Was Sie bekommen", [
                "CRO-optimierte Landingpage, modulare Abschnitte",
                "Meta / Google Ads / GA4 / GTM integriert",
                "CRM-Integration (HubSpot, Brevo, Zapier, ...)",
                "A/B-testbare Komponentenstruktur",
                "Consent Mode v2 + DSGVO-Defaults",
            ]),
            ("Nachweis", [
                "Fuer Gruender mit EUR 1k+/Monat in bezahlten Anzeigen",
                "Ziel: unter 1,5 s LCP, gruene Core Web Vitals auf 3G",
                "Message Match zu Ihrer Anzeige standardmaessig",
            ]),
            ("Enthalten", [
                "Conversion-Ziel- und Event-Tagging",
                "Headless CMS fuer selbstaendige Textbearbeitung",
                "Varianten-Kloning fuer Multi-Kampagnen",
                "2 Revisionsrunden auf Staging",
            ]),
        ],
    },
    {
        "slug": "scale",
        "title": "Die Scale-Website",
        "subtitle": "Headless-CMS-Plattform, gebaut fuer Wachstum.",
        "price": "Ab 5.800 \u20ac",
        "timeline": "Launch in 4 Wochen · Zahlbar in 3 Meilensteinen",
        "sections": [
            ("Was Sie bekommen", [
                "Multi-Page Astro-Architektur",
                "Headless CMS (Sanity, Storyblok oder Decap)",
                "i18n-ready (Englisch / Spanisch / Deutsch)",
                "Erweitertes SEO + JSON-LD auf jeder Route",
                "GSAP / View Transitions Feinschliff",
            ]),
            ("Nachweis", [
                "Lighthouse \u2265 95 garantiert beim Launch",
                "Fuer wachsende Marken mit Redaktionsteams",
                "Content-Editoren koennen das Layout nie zerstoeren",
                "Alle Kunden besitzen das Repo + Zugangsdaten",
            ]),
            ("Enthalten", [
                "Content-Migration von WordPress / Webflow / Notion",
                "Search Console + GEO-Plan fuer KI-Suche",
                "2 Revisionsrunden + Uebergabe-Schulung",
                "4 Wochen kostenloser Post-Launch-Bugfix-Schutz",
            ]),
        ],
    },
    {
        "slug": "care",
        "title": "Kontinuierliche Betreuung",
        "subtitle": "Ihre Website schnell, sicher und aktuell - egal, wer sie gebaut hat.",
        "price": "Ab 190 \u20ac / Monat",
        "timeline": "Jederzeit kuendbar",
        "sections": [
            ("Was Sie bekommen", [
                "Schnellere Ladezeiten - ich finde die Bremsen und behebe sie",
                "Regelmaessige Sicherheits- und Software-Updates",
                "Tempo- und Verfuegbarkeits-Monitoring rund um die Uhr",
                "Bis zu 2 Stunden Aenderungen pro Monat (Text, Bilder, Kleines)",
                "Ein monatlicher Report in klarer Sprache",
            ]),
            ("Funktioniert mit Ihrer Plattform", [
                "Webflow, Wix, Squarespace, WordPress oder Custom-Builds",
                "Ich lerne Ihre Seite zuerst - und aendere nie etwas ohne Rueckfrage",
                "Ehrlich, was das Tempo Ihrer Plattform kann und was nicht",
            ]),
            ("Enthalten", [
                "Antwort in 48 Stunden, am selben Tag bei Dringendem",
                "Monatlich kuendbar mit 5 Tagen Frist",
                "Ein echter Mensch auf Abruf - keine Tickets, keine Chatbots",
                "Sie zahlen nur, was Sie nutzen - tagesgenau abgerechnet",
            ]),
        ],
    },
    {
        "slug": "care-plus",
        "title": "Care Plus",
        "subtitle": "Gefunden werden auf Google, lokal und in KI-Suche.",
        "price": "Tuning ab \u20ac490 \u00b7 dann \u20ac290 / Monat zum Erhalt",
        "timeline": "Jede Plattform \u00b7 Ehrlich, was moeglich ist",
        "sections": [
            ("Was Sie bekommen", [
                "Volles Speed-Tuning \u2014 schnelle Seiten als Basis",
                "Klassisches SEO \u2014 Titel, Struktur und Inhalte fuer Suchmaschinen",
                "Lokale Suche \u2014 Google Business Profil und Standort-Signale",
                "KI-Suchbereitschaft \u2014 strukturiert fuer ChatGPT und Google AI",
                "Vorher-Nachher-Report in klarer Sprache",
            ]),
            ("Funktioniert mit Ihrer Plattform", [
                "Webflow, Wix, Squarespace, WordPress, Shopify oder Custom",
                "Ich habe sie gebaut oder jemand anderes \u2014 egal",
                "Ehrlich, was auf Ihrer Plattform moeglich ist",
                "Nichts aendert sich ohne Ihre Zustimmung",
            ]),
            ("Enthalten", [
                "Fuer Yogalehrer, Therapeuten, Studios und kleine Unternehmen",
                "Einmaliges Tuning oder laufender Monatsplan",
                "Klare Preise, keine Bindung",
                "Ein echter Mensch \u2014 keine Ticket-Warteschlangen",
            ]),
        ],
    },
    {
        "slug": "partnership",
        "title": "Designer-Partnerschaft",
        "subtitle": "Pixelgenaue Entwicklung, von der Ihre Kunden denken werden, Sie hätten sie selbst geschrieben.",
        "price": "Ab \u20ac1.750 / Landingpage",
        "timeline": "\u20ac2.800 / Embedded Studio Week",
        "sections": [
            ("Was Sie bekommen", [
                "Pixelgenaue Umsetzung Ihrer Figma-Datei",
                "Astro- oder Next.js-Build mit Tailwind, barrierefrei",
                "Headless-CMS-Integration (Sanity, Storyblok oder Decap)",
                "Core Web Vitals + Lighthouse > 95 beim Launch",
                "Sauberes Git-Repo mit dokumentierten Komponenten",
            ]),
            ("So funktioniert's", [
                "Brief + NDA: Figma teilen, Festpreis in 48h",
                "1-3 Wochen pro Projekt",
                "Erster Entwurf: Echtes HTML auf privater Staging-URL",
                "Design-QA: Gemeinsamer Walk-Through per Loom oder live",
                "Uebergabe: Repo, Deploy, CMS - alles unter Ihrem Namen",
            ]),
            ("Enthalten", [
                "Loom-Walkthrough bei Uebergabe",
                "2 Wochen kostenloser Post-Launch-Bugfix-Schutz",
                "White-Label-NDA, bevor ich die Datei sehe",
                "Festpreis-Rechnungen ohne Ueberraschungen",
                "Repo gehoert Ihnen ab dem ersten Commit",
            ]),
        ],
    },
]

TIERS_ES: list[dict] = [
    {
        "slug": "starter",
        "title": "El Paquete Starter",
        "subtitle": "Lanza rapido. Luce increible. El codigo es tuyo.",
        "price": "Desde \u20ac890",
        "timeline": "3-5 dias habiles",
        "sections": [
            ("Que recibis", [
                "Una pagina larga, hasta 4 secciones",
                "Diseno responsive mobile-first",
                "Formulario de contacto conectado a tu inbox",
                "Decap headless CMS + 30 min de capacitacion",
                "Core Web Vitals >= 95 Lighthouse",
            ]),
            ("Prueba", [
                "Cornelia Jaeger - web de coach creativa, en 5 dias",
                "Carma Retreats - primer retiro agotado en el lanzamiento",
                "Clientes Starter lanzan en <7 dias en promedio",
            ]),
            ("Incluido", [
                "SEO basico + sitemap + schema.org",
                "Setup de analytics (Plausible o GA4)",
                "2 rondas de revision en staging",
                "2 semanas de cobertura de bugs post-lanzamiento",
            ]),
        ],
    },
    {
        "slug": "growth",
        "title": "El Paquete Growth",
        "subtitle": "Landing de alta conversion para campanas pagas.",
        "price": "Desde \u20ac1.750",
        "timeline": "Embudo lanzado en 10 dias · Lighthouse ≥ 95",
        "sections": [
            ("Que recibis", [
                "Landing page con CRO, secciones modulares",
                "Meta / Google Ads / GA4 / GTM integrados",
                "Integracion CRM (HubSpot, Brevo, Zapier, ...)",
                "Estructura de componentes A/B testeable",
                "Consent Mode v2 + GDPR por defecto",
            ]),
            ("Prueba", [
                "Para fundadores con EUR 1k+/mes en ads pagos",
                "Objetivo: LCP < 1,5 s, Core Web Vitals verde en 3G",
                "Message match con tu creatividad por defecto",
            ]),
            ("Incluido", [
                "Tagging de objetivos de conversion y eventos",
                "Headless CMS para editar textos vos mismo",
                "Clonado de variantes para multi-campanas",
                "2 rondas de revision en staging",
            ]),
        ],
    },
    {
        "slug": "scale",
        "title": "El Sitio Scale",
        "subtitle": "Plataforma headless CMS, construida para escalar.",
        "price": "Desde \u20ac5.800",
        "timeline": "Lanzamiento en 4 semanas · Pago en 3 hitos",
        "sections": [
            ("Que recibis", [
                "Arquitectura Astro multi-pagina",
                "Headless CMS (Sanity, Storyblok o Decap)",
                "i18n-ready (Ingles / Espanol / Aleman)",
                "SEO avanzado + JSON-LD en cada ruta",
                "GSAP / View Transitions pulido",
            ]),
            ("Prueba", [
                "Lighthouse \u2265 95 garantizado en el lanzamiento",
                "Para marcas en crecimiento con equipos editoriales",
                "Los editores de contenido nunca rompen el layout",
                "Todos los clientes son duenos del repo + credenciales",
            ]),
            ("Incluido", [
                "Migracion de contenido desde WordPress / Webflow / Notion",
                "Search Console + plan GEO para busqueda IA",
                "2 rondas de revision + capacitacion de entrega",
                "4 semanas de cobertura de bugs post-lanzamiento",
            ]),
        ],
    },
    {
        "slug": "care",
        "title": "Cuidado Continuo",
        "subtitle": "Tu web rapida, segura y al dia - la haya hecho quien la haya hecho.",
        "price": "Desde \u20ac190 / mes",
        "timeline": "Cancelas cuando quieras",
        "sections": [
            ("Que recibis", [
                "Carga mas rapida - encuentro que la frena y lo arreglo",
                "Actualizaciones regulares de seguridad y software",
                "Monitoreo de velocidad y disponibilidad a toda hora",
                "Hasta 2 horas mensuales de ediciones (textos, imagenes, cambios)",
                "Un informe mensual en lenguaje claro",
            ]),
            ("Funciona con tu plataforma", [
                "Webflow, Wix, Squarespace, WordPress o desarrollos a medida",
                "Aprendo tu sitio primero - y nunca lo cambio sin avisar",
                "Honesto sobre que puede y que no la velocidad de tu plataforma",
            ]),
            ("Incluido", [
                "Respuesta en 48 horas, el mismo dia para lo urgente",
                "Mes a mes, cancelas con 5 dias de aviso",
                "Una persona real a tu disposicion - sin tickets ni chatbots",
                "Pagas solo lo que usas - prorrateado por dia",
            ]),
        ],
    },
    {
        "slug": "care-plus",
        "title": "Care Plus",
        "subtitle": "Encontrarte en Google, localmente y en busqueda con IA.",
        "price": "Optimizaci\u00f3n desde \u20ac490 \u00b7 luego \u20ac290 / mes para mantener",
        "timeline": "Cualquier plataforma \u00b7 Honesto sobre lo posible",
        "sections": [
            ("Que recibis", [
                "Ajuste completo de velocidad \u2014 paginas rapidas como base",
                "SEO tradicional \u2014 titulos, estructura y contenido para buscadores",
                "Busqueda local \u2014 Google Business Profile y senales de ubicacion",
                "Preparacion para busqueda con IA \u2014 ChatGPT y Google AI",
                "Informe antes/despues en lenguaje claro",
            ]),
            ("Funciona con tu plataforma", [
                "Webflow, Wix, Squarespace, WordPress, Shopify o custom",
                "Lo hice yo o alguien mas \u2014 no importa",
                "Honesto sobre lo posible en tu plataforma",
                "Nada cambia sin tu aprobacion",
            ]),
            ("Incluido", [
                "Para profesores de yoga, terapeutas, estudios y pequenos negocios",
                "Ajuste puntual o plan mensual continuo",
                "Precios claros, sin permanencia",
                "Una persona real \u2014 sin tickets ni chatbots",
            ]),
        ],
    },
    {
        "slug": "partnership",
        "title": "Partnership para Disenadores",
        "subtitle": "Dev pixel-perfect que tu cliente va a pensar que escribiste vos.",
        "price": "Desde \u20ac1.750 / landing page",
        "timeline": "\u20ac2.800 / Embedded Studio Week",
        "sections": [
            ("Que recibis", [
                "Implementacion pixel-perfect de tu archivo Figma",
                "Build en Astro o Next.js con Tailwind, accesible por defecto",
                "Integracion de CMS headless (Sanity, Storyblok o Decap)",
                "Core Web Vitals + Lighthouse > 95 en el lanzamiento",
                "Repo Git limpio con componentes documentados",
            ]),
            ("Como funciona", [
                "Brief + NDA: Compartis el Figma, presupuesto fijo en 48h",
                "1-3 semanas por proyecto",
                "Primer corte: HTML real en URL de staging privada",
                "QA de diseno: Lo revisamos juntos por Loom o en vivo",
                "Entrega: Repo, deploy, CMS - todo a nombre de tu estudio",
            ]),
            ("Incluido", [
                "Walkthrough por Loom en la entrega",
                "2 semanas de cobertura de bugs post-lanzamiento",
                "NDA white-label firmado antes de ver el archivo",
                "Facturas a precio fijo, sin sorpresas",
                "El repo es tuyo desde el primer commit",
            ]),
        ],
    },
]

LANGS = {
    "en": TIERS_EN,
    "de": TIERS_DE,
    "es": TIERS_ES,
}

CONTACT = {
    "en": "hello@base-pages.com  -  base-pages.com/contact",
    "de": "hello@base-pages.com  -  base-pages.com/de/contact",
    "es": "hello@base-pages.com  -  base-pages.com/es/contact",
}

FOOTER_NOTE = {
    "en": "Prices in EUR. Placeholder version - final copy may evolve.",
    "de": "Preise in EUR. Platzhalter-Version - endgueltiger Text kann abweichen.",
    "es": "Precios en EUR. Version preliminar - el texto final puede cambiar.",
}

FOOTER_CTA = {
    "en": "Ready to talk? ",
    "de": "Bereit zu sprechen? ",
    "es": "Listo para hablar? ",
}


# ---------------------------------------------------------------------------
# Minimal PDF/1.4 emitter
# ---------------------------------------------------------------------------

def escape_pdf_text(s: str) -> str:
    replacements = {
        "\u2014": "-", "\u2013": "-", "\u2022": "*", "\u00b7": "-",
        "\u2026": "...", "\u20ac": "EUR ", "\u2265": ">=", "\u2264": "<=",
        "\u2018": "'", "\u2019": "'", "\u201c": '"', "\u201d": '"',
    }
    for src, dst in replacements.items():
        s = s.replace(src, dst)
    s = s.encode("latin-1", errors="replace").decode("latin-1")
    return s.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def build_content_stream(tier: dict, lang: str) -> bytes:
    width = 595
    margin_x = 56
    top = 800
    lines: list[str] = []

    def text(x, y, font, size, body, color=(0.07, 0.09, 0.15)):
        r, g, b = color
        lines.append(f"{r:.3f} {g:.3f} {b:.3f} rg")
        lines.append(f"BT /{font} {size} Tf {x} {y} Td ({escape_pdf_text(body)}) Tj ET")

    def rule(y, color=(0.9, 0.9, 0.9)):
        r, g, b = color
        lines.append(f"{r:.3f} {g:.3f} {b:.3f} RG 0.5 w {margin_x} {y} m {width - margin_x} {y} l S")

    lines.append("0.067 0.094 0.153 rg")
    lines.append(f"0 {top + 20} {width} 6 re f")
    text(margin_x, top - 6, "F2", 10, "BASE-PAGES  -  ONE-PAGER", color=(0.42, 0.45, 0.50))
    text(margin_x, top - 42, "F1", 28, tier["title"])
    text(margin_x, top - 66, "F2", 12, tier["subtitle"], color=(0.29, 0.33, 0.39))
    text(margin_x, top - 98, "F1", 13, tier["price"] + "   -   " + tier["timeline"])
    rule(top - 110)

    y = top - 140
    for heading, bullets in tier["sections"]:
        text(margin_x, y, "F1", 13, heading.upper())
        y -= 18
        for bullet in bullets:
            text(margin_x, y, "F2", 11, f"-  {bullet}", color=(0.23, 0.27, 0.34))
            y -= 16
        y -= 10

    rule(80)
    text(margin_x, 64, "F2", 10, FOOTER_CTA[lang] + CONTACT[lang], color=(0.42, 0.45, 0.50))
    text(margin_x, 48, "F2", 9, FOOTER_NOTE[lang], color=(0.55, 0.57, 0.62))

    return "\n".join(lines).encode("latin-1")


def build_pdf(tier: dict, lang: str) -> bytes:
    content_raw = build_content_stream(tier, lang)
    content_compressed = zlib.compress(content_raw, 9)
    objects: list[bytes] = []

    def add(obj: bytes) -> int:
        objects.append(obj)
        return len(objects)

    title_bytes = escape_pdf_text(f"{tier['title']} - base-pages one-pager").encode("latin-1")
    subject_bytes = escape_pdf_text(tier["subtitle"]).encode("latin-1")

    add(b"<< /Title (" + title_bytes + b") /Author (Base Pages) /Creator (base-pages build-one-pagers.py) /Producer (base-pages build-one-pagers.py) /Subject (" + subject_bytes + b") >>")
    add(b"<< /Type /Catalog /Pages 3 0 R >>")
    add(b"<< /Type /Pages /Kids [4 0 R] /Count 1 >>")
    add(b"<< /Type /Page /Parent 3 0 R /MediaBox [0 0 595 842] /Contents 5 0 R /Resources << /Font << /F1 6 0 R /F2 7 0 R >> >> >>")
    add(b"<< /Length " + str(len(content_compressed)).encode("ascii") + b" /Filter /FlateDecode >>\nstream\n" + content_compressed + b"\nendstream")
    add(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>")
    add(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>")

    header = b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n"
    body = bytearray(header)
    offsets = [0]
    for i, obj in enumerate(objects, start=1):
        offsets.append(len(body))
        body += f"{i} 0 obj\n".encode("ascii") + obj + b"\nendobj\n"

    xref_offset = len(body)
    body += f"xref\n0 {len(objects) + 1}\n".encode("ascii")
    body += b"0000000000 65535 f \n"
    for offset in offsets[1:]:
        body += f"{offset:010d} 00000 n \n".encode("ascii")

    body += b"trailer\n"
    body += f"<< /Size {len(objects) + 1} /Root 2 0 R /Info 1 0 R >>\n".encode("ascii")
    body += b"startxref\n"
    body += f"{xref_offset}\n".encode("ascii")
    body += b"%%EOF\n"

    return bytes(body)


def main() -> None:
    repo_root = Path(__file__).resolve().parent.parent
    out_dir = repo_root / "public" / "one-pagers"
    total = 0

    for lang, tiers in LANGS.items():
        lang_dir = out_dir / lang
        lang_dir.mkdir(parents=True, exist_ok=True)
        for tier in tiers:
            pdf = build_pdf(tier, lang)
            filename = f"{tier['slug']}-one-pager.pdf"
            path = lang_dir / filename
            path.write_bytes(pdf)
            print(f"  [ok] {path.relative_to(repo_root)}  ({len(pdf)} bytes)")
            total += 1

    print(dedent(f"""
        Done. {total} PDFs written to {out_dir.relative_to(repo_root)}/.
        These are placeholder/text PDFs sized ~2 KB. Replace with final
        design PDFs under the same filenames when ready.
    """).strip())


if __name__ == "__main__":
    main()
