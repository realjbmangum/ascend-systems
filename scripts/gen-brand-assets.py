#!/usr/bin/env python3
"""
Generate the two sitewide brand assets referenced by src/layouts/Layout.astro:

  public/og-image.png   1200x630 social card (OG + Twitter, every page)
  public/favicon.ico    multi-size icon (16/32/48/64/128/256)

Source of truth is public/brand-v2/logo-mark-only.png (2000x2000 RGBA,
navy #1C2D37 + orange #D37F27 mark on transparency).

Both outputs put the mark on a Deep Charcoal field, so the navy portion of
the mark is recoloured to white for contrast. Orange is left untouched.

Regenerate with:  python3 scripts/gen-brand-assets.py
"""

from PIL import Image, ImageDraw, ImageFont
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
MARK = ROOT / "public" / "brand-v2" / "logo-mark-only.png"
OUT = ROOT / "public"

# Brand palette — mirrors brand-kit.md / globals.css @theme
CHARCOAL = (30, 42, 50)       # #1E2A32  primary
NEAR_BLACK = (22, 32, 40)     # #162028  darkest
ORANGE = (212, 99, 44)        # #D4632C  accent
WHITE = (255, 255, 255)
MUTED = (156, 163, 175)       # #9CA3AF  gray-400

TAGLINE = "Custom software, AI agents, and internal tools"
SUBLINE = "Charlotte, NC  ·  ascendsystems.ai"


def load_font(size, bold=False):
    """Best available system font, preferring SF Pro then Helvetica Neue."""
    for path, idx in (
        ("/System/Library/Fonts/SFNS.ttf", None),
        ("/System/Library/Fonts/HelveticaNeue.ttc", 1 if bold else 0),
        ("/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold
         else "/System/Library/Fonts/Supplemental/Arial.ttf", None),
    ):
        try:
            f = (ImageFont.truetype(path, size) if idx is None
                 else ImageFont.truetype(path, size, index=idx))
            if path.endswith("SFNS.ttf"):
                try:
                    f.set_variation_by_name("Bold" if bold else "Regular")
                except Exception:
                    pass
            return f
        except Exception:
            continue
    return ImageFont.load_default()


def mark_on_dark(keep_cross=True):
    """
    Load the mark, crop to the glyph, and invert it for a dark field.

    Two things to know about the source file, despite its name:
      1. It is NOT mark-only — an "ASCEND SYSTEMS" wordmark sits in a band
         below the glyph, separated by a clean transparent gap at ~93% height.
         We drop it; the OG card sets its own typography.
      2. The cross detail at the peak junction is drawn in opaque WHITE on the
         navy. A naive navy->white pass erases it. So we recolour three ways:
         navy -> white, white -> charcoal, orange -> untouched.
    """
    im = Image.open(MARK).convert("RGBA")
    im = im.crop(im.getbbox())          # strip the transparent margin
    w, h = im.size
    im = im.crop((0, 0, w, int(h * 0.93)))  # drop the wordmark band
    im = im.crop(im.getbbox())

    px = im.load()
    for y in range(im.size[1]):
        for x in range(im.size[0]):
            r, g, b, a = px[x, y]
            if a < 8:
                continue
            if r > 150 and 70 < g < 180 and b < 100:      # orange accent
                continue
            if r > 200 and g > 200 and b > 200:           # the cross detail
                # At favicon sizes the cross is sub-pixel noise, so let it
                # merge into the white mountain instead of muddying the glyph.
                px[x, y] = (CHARCOAL + (a,)) if keep_cross else (255, 255, 255, a)
            elif r < 110 and g < 110 and b < 125:         # navy -> white
                px[x, y] = (255, 255, 255, a)
    return im


def make_og(mark):
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), CHARCOAL)
    d = ImageDraw.Draw(img)

    # Subtle vertical depth: darken toward the bottom.
    for y in range(H):
        t = y / H
        d.line(
            [(0, y), (W, y)],
            fill=tuple(
                int(CHARCOAL[i] + (NEAR_BLACK[i] - CHARCOAL[i]) * t) for i in range(3)
            ),
        )

    # Orange rule along the top edge.
    d.rectangle([0, 0, W, 8], fill=ORANGE)

    f_brand = load_font(78, bold=True)
    f_tag = load_font(33)
    f_sub = load_font(25)

    # Measure the text block so mark + type share one optical centre line.
    def height(txt, font):
        b = d.textbbox((0, 0), txt, font=font)
        return b[3] - b[1]

    GAP_1, GAP_2 = 34, 26
    h_brand = height("Ascend Systems", f_brand)
    block_h = h_brand + GAP_1 + height(TAGLINE, f_tag) + GAP_2 + height(SUBLINE, f_sub)

    m = mark.copy()
    m.thumbnail((300, 300), Image.LANCZOS)
    centre = H // 2 + 4  # nudge down: the top orange rule adds visual weight up top

    mx = 96
    img.paste(m, (mx, centre - m.size[1] // 2), m)

    tx = mx + m.size[0] + 72
    y = centre - block_h // 2
    # textbbox y-offset: draw from the cap line, not the ascent box.
    d.text((tx, y - d.textbbox((0, 0), "Ascend Systems", font=f_brand)[1]),
           "Ascend Systems", font=f_brand, fill=WHITE)
    y += h_brand + GAP_1
    d.text((tx, y - d.textbbox((0, 0), TAGLINE, font=f_tag)[1]),
           TAGLINE, font=f_tag, fill=(226, 232, 240))
    y += height(TAGLINE, f_tag) + GAP_2
    d.text((tx, y - d.textbbox((0, 0), SUBLINE, font=f_sub)[1]),
           SUBLINE, font=f_sub, fill=MUTED)

    path = OUT / "og-image.png"
    img.save(path, "PNG", optimize=True)
    print(f"wrote {path.relative_to(ROOT)}  {img.size[0]}x{img.size[1]}")


def make_favicon(mark):
    # Square charcoal tile with the mark inset — reads better in a tab strip
    # than a bare transparent mark.
    S = 256
    img = Image.new("RGBA", (S, S), CHARCOAL + (255,))
    m = mark.copy()
    pad = 18  # tight — a tab-strip icon needs the glyph to fill its tile
    m.thumbnail((S - pad * 2, S - pad * 2), Image.LANCZOS)
    img.paste(m, ((S - m.size[0]) // 2, (S - m.size[1]) // 2), m)

    path = OUT / "favicon.ico"
    img.save(path, format="ICO",
             sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    print(f"wrote {path.relative_to(ROOT)}  multi-size ICO")

    png = OUT / "apple-touch-icon.png"
    img.convert("RGB").resize((180, 180), Image.LANCZOS).save(png, "PNG", optimize=True)
    print(f"wrote {png.relative_to(ROOT)}  180x180")


if __name__ == "__main__":
    if not MARK.exists():
        raise SystemExit(f"missing source mark: {MARK}")
    make_og(mark_on_dark(keep_cross=True))
    make_favicon(mark_on_dark(keep_cross=False))
