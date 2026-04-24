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
        "timeline": "7\u201310 working days",
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
        "price": "From \u20ac3,800",
        "timeline": "3\u20135 weeks",
        "sections": [
            ("What you get", [
                "Multi-page Astro architecture",
                "Headless CMS (Sanity, Storyblok or Decap)",
                "i18n-ready (English / Spanish / German)",
                "Advanced SEO + JSON-LD on every route",
                "GSAP / View Transitions polish",
            ]),
            ("Proof", [
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
        "subtitle": "Your site monitored, patched, and improving.",
        "price": "From \u20ac190 / month",
        "timeline": "Cancel anytime",
        "sections": [
            ("What you get", [
                "Dependency & security updates",
                "Uptime + Core Web Vitals monitoring",
                "CVE alerts + same-day critical patches",
                "Monthly implementation hours",
                "Priority over new-build queue",
            ]),
            ("Proof", [
                "Mon-Fri 9-18 CET, first reply <= 4 h",
                "Average site patched within 24 h of CVE",
                "Care clients get direct founder line (no helpdesk)",
            ]),
            ("Included", [
                "Monthly report on performance & uptime",
                "Unused hours roll over 1 month",
                "No lock-in, 14-day cancellation",
                "Emergency cover available as add-on",
            ]),
        ],
    },
    {
        "slug": "partnership",
        "title": "Designer Partnership",
        "subtitle": "Your Figma, shipped as code you're proud to show clients.",
        "price": "From \u20ac80/hr - or per-project",
        "timeline": "1-3 weeks per project",
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
        "timeline": "7-10 Werktage",
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
        "price": "Ab 3.800 \u20ac",
        "timeline": "3-5 Wochen",
        "sections": [
            ("Was Sie bekommen", [
                "Multi-Page Astro-Architektur",
                "Headless CMS (Sanity, Storyblok oder Decap)",
                "i18n-ready (Englisch / Spanisch / Deutsch)",
                "Erweitertes SEO + JSON-LD auf jeder Route",
                "GSAP / View Transitions Feinschliff",
            ]),
            ("Nachweis", [
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
        "subtitle": "Ihre Website, ueberwacht, gepatcht und verbessert.",
        "price": "Ab 190 \u20ac / Monat",
        "timeline": "Jederzeit kuendbar",
        "sections": [
            ("Was Sie bekommen", [
                "Dependency- & Sicherheitsupdates",
                "Uptime + Core Web Vitals Monitoring",
                "CVE-Alerts + kritische Patches am selben Tag",
                "Monatliche Implementierungsstunden",
                "Vorrang vor Neubau-Warteschlange",
            ]),
            ("Nachweis", [
                "Mo-Fr 9-18 CET, erste Antwort <= 4 h",
                "Durchschnittliche Patch-Zeit innerhalb 24 h nach CVE",
                "Care-Kunden haben eine direkte Gruenderleitung",
            ]),
            ("Enthalten", [
                "Monatlicher Bericht ueber Performance & Uptime",
                "Ungenutzte Stunden rollen 1 Monat ueber",
                "Keine Bindung, 14 Tage Kuendigungsfrist",
                "Notfallabdeckung als Add-on verfuegbar",
            ]),
        ],
    },
    {
        "slug": "partnership",
        "title": "Designer-Partnerschaft",
        "subtitle": "Ihr Figma, als Code, den Sie Kunden zeigen moechten.",
        "price": "Ab \u20ac80/Std - oder pro Projekt",
        "timeline": "1-3 Wochen pro Projekt",
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
        "timeline": "7-10 dias habiles",
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
        "price": "Desde \u20ac3.800",
        "timeline": "3-5 semanas",
        "sections": [
            ("Que recibis", [
                "Arquitectura Astro multi-pagina",
                "Headless CMS (Sanity, Storyblok o Decap)",
                "i18n-ready (Ingles / Espanol / Aleman)",
                "SEO avanzado + JSON-LD en cada ruta",
                "GSAP / View Transitions pulido",
            ]),
            ("Prueba", [
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
        "subtitle": "Tu sitio monitoreado, parcheado y mejorando.",
        "price": "Desde \u20ac190 / mes",
        "timeline": "Cancelas cuando quieras",
        "sections": [
            ("Que recibis", [
                "Actualizaciones de dependencias y seguridad",
                "Monitoreo de uptime + Core Web Vitals",
                "Alertas CVE + parches criticos el mismo dia",
                "Horas mensuales de implementacion",
                "Prioridad sobre cola de nuevos proyectos",
            ]),
            ("Prueba", [
                "Lun-Vie 9-18 CET, primera respuesta <= 4 h",
                "Sitio parcheado en promedio dentro de 24 h de CVE",
                "Clientes Care tienen linea directa con el fundador",
            ]),
            ("Incluido", [
                "Reporte mensual de rendimiento y uptime",
                "Horas no usadas se acumulan 1 mes",
                "Sin permanencia, cancelacion en 14 dias",
                "Cobertura de emergencia disponible como add-on",
            ]),
        ],
    },
    {
        "slug": "partnership",
        "title": "Partnership para Disenadores",
        "subtitle": "Tu Figma, llevado a codigo que queres mostrarle al cliente.",
        "price": "Desde \u20ac80/h - o por proyecto",
        "timeline": "1-3 semanas por proyecto",
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
