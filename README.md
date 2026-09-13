# Forrest Jones — Personal Site

Personal site and portfolio for Forrest Jones: AI systems and fintech engineer.

**Live:** https://forrest-jones.github.io/Forrest-Jones-Website/

## Stack

Deliberately dependency-free — static HTML, CSS, and vanilla JavaScript, served
directly by GitHub Pages. No build step, no framework, no package manager.

| File | Purpose |
| --- | --- |
| `index.html` | All page content and structured data (JSON-LD) |
| `style.css` | Design system (CSS custom properties) and all layout |
| `app.js` | Nav, scroll spy, scroll progress, reveal animations, lazy video, clipboard |
| `img/` | Images, résumé PDFs, and the project video |
| `.nojekyll` | Tells GitHub Pages to serve files as-is |

## Local development

No tooling required. Open `index.html` directly, or serve it so relative paths
and the clipboard API behave exactly as they do in production:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Editing content

- **Sections** live in `index.html` in page order: hero, Now, Services, Projects,
  About, Contact, Footer.
- **Colors, spacing, and type** are CSS custom properties at the top of
  `style.css` under `:root` — change the palette there, not in the rules below.
- **Rotating hero roles** are the `roles` array in `app.js`.
- **Copyright year** is injected at runtime; no annual edit needed.

## Notes

- The project video (`img/pexels-…mp4`, ~27 MB) is lazy-loaded via
  `IntersectionObserver` and only fetched when it scrolls into view, so it never
  blocks first paint. Re-encoding it smaller is the next easy performance win.
- Motion respects `prefers-reduced-motion`.
- The site is dark-themed by design and paints its own background explicitly.
