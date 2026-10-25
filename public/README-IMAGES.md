# MyClasses website images — where to put your files

Everything in this `public/` folder is served from the site root.
Example: a file at `public/landing/hero.png` is available at `/landing/hero.png`.

You do NOT need to change any code. The landing page already looks for these
exact filenames and uses them automatically if the file exists. If a file is
missing, the page falls back to a built-in CSS mockup, so nothing ever breaks.

Replace a placeholder simply by saving your image with the SAME name in the
SAME folder (keep the extension — use .png, or change the code reference if you
use .jpg/.webp).

---

## 1. Brand

| Save as | Used for | Recommended size |
|---|---|---|
| `public/favicon.ico` | Browser tab icon | 32×32 or 48×48 |
| `public/logo.png` | Full logo (mark + "MyClasses" text), dark text on transparent | ~320×80, transparent PNG |
| `public/logo-white.png` | White version of the logo, for dark backgrounds (footer, CTA) | ~320×80, transparent PNG |
| `public/logo-mark.png` | Just the icon/mark, no text (app icon, small spaces) | 512×512, transparent PNG |
| `public/og-image.png` | Social share preview (WhatsApp/Facebook/X link card) | 1200×630 |

## 2. Landing page (`public/landing/`)

| Save as | Used for | Recommended size |
|---|---|---|
| `public/landing/hero.png` | Big hero visual on the right of "Smarter Schools, Brighter Futures" (students + dashboard + phone) | ~1200×900, transparent or white bg |
| `public/landing/preview.png` | "Powerful & Easy to Use" platform preview (laptop + phone) | ~1600×900 |
| `public/landing/app-section.png` | "Stay Connected Anytime" mobile app image | ~900×900 |
| `public/landing/dashboard.png` | "Complete Control in One Dashboard" laptop image | ~1200×800 |

## 3. Testimonials (`public/landing/testimonials/`)

Square headshots. Used on the "Loved by Educators" cards.

| Save as | Recommended size |
|---|---|
| `public/landing/testimonials/ravi.jpg` | 160×160 |
| `public/landing/testimonials/neha.jpg` | 160×160 |
| `public/landing/testimonials/amit.jpg` | 160×160 |

## 4. App store badges (optional) (`public/landing/`)

| Save as | Used for |
|---|---|
| `public/landing/google-play.png` | "Get it on Google Play" badge |
| `public/landing/app-store.png` | "Download on the App Store" badge |

---

## After you add images

1. Save the files with the names above.
2. Tell me which ones you added (e.g. "I added hero.png and the 3 testimonial photos").
3. I'll wire any that aren't auto-detected yet (testimonials, app section, dashboard, logos) and rebuild.

## Tips
- Prefer PNG with a transparent background for logos and cut-out images.
- Use JPG for photos (smaller files).
- WebP is fine too — if you use a different extension, just tell me and I'll update the reference.
- Keep hero/preview images under ~500 KB each so the page loads fast (compress at tinypng.com or squoosh.app).
