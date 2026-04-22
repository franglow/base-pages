#!/usr/bin/env python3
"""
Build placeholder one-pager PDFs for each tier.

Generates PDF/1.4 files from scratch — no dependencies, produces
~2KB browser-viewable PDFs under ``public/one-pagers/``.

Re-run whenever the source content below changes::

    python3 scripts/build-one-pagers.py
"""

from __future__ import annotations

import zlib
from pathlib import Path
from textwrap import dedent

# ---------------------------------------------------------------------------
# Source content — single source of truth for the 4 placeholder one-pagers.
# When we upgrade to final design PDFs, just replace the emitted binaries.
# ---------------------------------------------------------------------------
TIERS: list[dict] = [
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
                "Core Web Vitals \u2265 95 Lighthouse",
            ]),
            ("Proof", [
                "Cornelia Jaeger \u2014 creative coach site, live in 5 days",
                "Carma Retreats \u2014 first retreat sold out at launch",
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
                "CRM integration (HubSpot, Brevo, Zapier, \u2026)",
                "A/B testable component structure",
                "Consent Mode v2 + GDPR defaults",
            ]),
            ("Proof", [
                "Built for founders running \u20ac1k+ / month in paid ads",
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
                "Mon\u2013Fri 9\u201318 CET, first reply \u2264 4 h",
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
]

CONTACT = "hello@base-pages.com  \u00b7  base-pages.com/contact"


# ---------------------------------------------------------------------------
# Minimal PDF/1.4 emitter. Uses PDF's built-in 14 Helvetica family so we
# don't need to embed fonts. Text is expressed in ``(literal)`` strings —
# any ``(``, ``)`` or ``\`` gets escaped.
# ---------------------------------------------------------------------------

def escape_pdf_text(s: str) -> str:
    # Map a few common unicode glyphs to ASCII equivalents that WinAnsiEncoding
    # (the default PDF encoding for Helvetica) renders cleanly everywhere.
    replacements = {
        "\u2014": "-",  # em dash
        "\u2013": "-",  # en dash
        "\u2022": "*",  # bullet
        "\u00b7": "-",  # middle dot
        "\u2026": "...",
        "\u20ac": "EUR ",
        "\u2265": ">=",
        "\u2264": "<=",
        "\u2018": "'", "\u2019": "'",
        "\u201c": '"', "\u201d": '"',
    }
    for src, dst in replacements.items():
        s = s.replace(src, dst)
    # Strip any remaining non-latin1 codepoints (fallback safety).
    s = s.encode("latin-1", errors="replace").decode("latin-1")
    return (
        s.replace("\\", "\\\\")
        .replace("(", "\\(")
        .replace(")", "\\)")
    )


def build_content_stream(tier: dict) -> bytes:
    """
    Build the content stream for one tier PDF (A4 portrait: 595 x 842 pt).
    Returns the *uncompressed* content stream as bytes.
    """
    width = 595
    margin_x = 56
    top = 800

    lines: list[str] = []

    def text(x: int, y: int, font: str, size: int, body: str, color: tuple[float, float, float] = (0.07, 0.09, 0.15)) -> None:
        r, g, b = color
        lines.append(f"{r:.3f} {g:.3f} {b:.3f} rg")
        lines.append(f"BT /{font} {size} Tf {x} {y} Td ({escape_pdf_text(body)}) Tj ET")

    def rule(y: int, color: tuple[float, float, float] = (0.9, 0.9, 0.9)) -> None:
        r, g, b = color
        lines.append(f"{r:.3f} {g:.3f} {b:.3f} RG 0.5 w {margin_x} {y} m {width - margin_x} {y} l S")

    # Brand strip
    lines.append("0.067 0.094 0.153 rg")
    lines.append(f"0 {top + 20} {width} 6 re f")

    # Eyebrow
    text(margin_x, top - 6, "F2", 10, "BASE-PAGES  -  ONE-PAGER", color=(0.42, 0.45, 0.50))

    # Title
    text(margin_x, top - 42, "F1", 28, tier["title"])

    # Subtitle
    text(margin_x, top - 66, "F2", 12, tier["subtitle"], color=(0.29, 0.33, 0.39))

    # Price / timeline pill
    text(margin_x, top - 98, "F1", 13, tier["price"] + "   -   " + tier["timeline"])
    rule(top - 110)

    # Body sections
    y = top - 140
    for heading, bullets in tier["sections"]:
        text(margin_x, y, "F1", 13, heading.upper())
        y -= 18
        for bullet in bullets:
            text(margin_x, y, "F2", 11, f"-  {bullet}", color=(0.23, 0.27, 0.34))
            y -= 16
        y -= 10

    # Footer
    rule(80)
    text(margin_x, 64, "F2", 10, "Ready to talk? " + CONTACT, color=(0.42, 0.45, 0.50))
    text(margin_x, 48, "F2", 9, "Prices in EUR + local VAT. Placeholder version - final copy may evolve.", color=(0.55, 0.57, 0.62))

    return "\n".join(lines).encode("latin-1")


def build_pdf(tier: dict) -> bytes:
    """Assemble a single-page PDF/1.4 for this tier."""
    content_raw = build_content_stream(tier)
    content_compressed = zlib.compress(content_raw, 9)

    objects: list[bytes] = []

    def add(obj: bytes) -> int:
        objects.append(obj)
        return len(objects)

    title_bytes = escape_pdf_text(f"{tier['title']} - base-pages one-pager").encode("latin-1")
    subject_bytes = escape_pdf_text(tier["subtitle"]).encode("latin-1")

    info_id = add(
        b"<< /Title (" + title_bytes
        + b") /Author (Base Pages) /Creator (base-pages build-one-pagers.py)"
        + b" /Producer (base-pages build-one-pagers.py)"
        + b" /Subject (" + subject_bytes + b") >>"
    )
    catalog_id = add(b"<< /Type /Catalog /Pages 3 0 R >>")  # we'll fix refs below
    pages_id = add(b"<< /Type /Pages /Kids [4 0 R] /Count 1 >>")
    page_id = add(
        b"<< /Type /Page /Parent 3 0 R /MediaBox [0 0 595 842] "
        b"/Contents 5 0 R /Resources << /Font << "
        b"/F1 6 0 R /F2 7 0 R >> >> >>"
    )
    content_id = add(
        b"<< /Length " + str(len(content_compressed)).encode("ascii") + b" /Filter /FlateDecode >>\nstream\n"
        + content_compressed + b"\nendstream"
    )
    font1_id = add(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>")
    font2_id = add(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>")

    # Re-stitch IDs: info=1, catalog=2, pages=3, page=4, content=5, f1=6, f2=7.
    assert (info_id, catalog_id, pages_id, page_id, content_id, font1_id, font2_id) == (1, 2, 3, 4, 5, 6, 7), \
        f"Unexpected object ID order: {(info_id, catalog_id, pages_id, page_id, content_id, font1_id, font2_id)}"

    header = b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n"
    body = bytearray()
    body += header
    offsets = [0]  # object 0
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
    out_dir.mkdir(parents=True, exist_ok=True)

    for tier in TIERS:
        pdf = build_pdf(tier)
        path = out_dir / f"{tier['slug']}.pdf"
        path.write_bytes(pdf)
        print(f"  [ok] {path.relative_to(repo_root)}  ({len(pdf)} bytes)")

    print(dedent(f"""
        Done. {len(TIERS)} PDFs written to {out_dir.relative_to(repo_root)}/.
        These are placeholder/text PDFs sized ~2 KB. Replace with final
        design PDFs under the same filenames when ready.
    """).strip())


if __name__ == "__main__":
    main()
