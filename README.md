# Forrest Jones — Personal Site

Personal site for Forrest Jones: Chief Investment Officer, fractional Chief Financial
Officer, and Reg D capital-formation lead who builds the technology that runs the raise.

**Live:** https://forrest-jones.github.io/Forrest-Jones-Website/

## Stack

Deliberately dependency-free — static HTML, CSS, and vanilla JavaScript, served
directly by GitHub Pages. No build step, no framework, no package manager.

| File | Purpose |
| --- | --- |
| `index.html` | All page content and structured data (JSON-LD) |
| `style.css` | Design system (CSS custom properties) and all layout |
| `app.js` | Nav, scroll spy, reveal animations, booking links, contact form, clipboard |
| `404.html` | Custom not-found page (self-contained; GitHub Pages serves it for any missing path) |
| `robots.txt`, `sitemap.xml` | Crawler directives and the sitemap |
| `img/` | Images and the résumé PDF (keep the folder under ~1 MB; see Images) |
| `.nojekyll` | Tells GitHub Pages to serve files as-is |

## Local development

No tooling required. Serve the folder so relative paths and the clipboard API
behave exactly as they do in production:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Page order

Hero → Now → Capabilities → Experience → Results (case studies) → Testimonials
(hidden by default) → Build (projects) → About → Contact → Footer.

## One-time setup after cloning

Three things point at services that need an account. Each is a one-line change.

### 1. Booking link

Set `BOOKING_URL` near the top of the booking block in `app.js` to your Calendly,
cal.com, or Google appointment link:

```js
var BOOKING_URL = 'https://calendly.com/your-handle/20min';
```

Every "Book a 20-minute call" button then opens that link in a new tab. While it
is empty, the buttons fall back to a pre-filled email.

### 2. Contact form (Formspree)

1. Create a free form at https://formspree.io and copy its endpoint
   (`https://formspree.io/f/abcdwxyz`).
2. In `index.html`, replace `YOUR_FORM_ID` in the `<form id="contact-form">`
   action with your form id.

Submissions then post in the background and show an inline confirmation. Until
the id is set, submitting the form opens the visitor's email app with the
fields already written out, so the form is never a dead end. The hidden
`_gotcha` field is Formspree's honeypot for spam.

### 3. Analytics (GoatCounter)

Sign up at https://www.goatcounter.com and choose the site code
**`forrest-jones`**. The tag at the bottom of `index.html` already points at
`https://forrest-jones.goatcounter.com/count`, so it starts counting the moment
the account exists. GoatCounter sets no cookies and needs no consent banner. To
use a different code, change that one `data-goatcounter` URL.

## Editing content

- **Case studies** are the four `.result-card` articles in the `#results`
  section. Each has Mandate / What I owned / Outcome. Only put figures there that
  the engaging company has credited to you in writing.
- **Testimonials** are in the `#testimonials` section, which ships with the
  `hidden` attribute. Replace the placeholder quotes with verbatim quotes you have
  permission to publish, then delete `hidden` from the `<section>` tag. Add
  `<li><a href="#testimonials">Testimonials</a></li>` to the nav if you want it
  linked.
- **Reg D disclaimer** is the `.footer-disclaimer` paragraph in the footer. Have
  counsel review it before changing the wording.
- **Colors, spacing, and type** are CSS custom properties at the top of
  `style.css` under `:root`.
- **Rotating hero roles** are the `roles` array in `app.js`.
- **Copyright year** is injected at runtime; no annual edit needed.
- **Headline numbers** ($10B+ raised: $9B public markets, $1B private equity
  and venture capital across 40 companies) appear in the meta description, the
  hero stats, the Experience intro, and the About copy. Keep all four in sync
  when they change.

## Images

Keep `img/` small; GitHub Pages has no image pipeline and the whole folder ships
to every visitor.

- Photos and screenshots: JPEG at quality 80–86, no wider than 1200 px.
- Flat artwork with few colors: PNG.
- No video in the repo. If a project needs motion, host the clip elsewhere and
  embed it, or use a poster image as the Blessing Machine card does.

## Custom domain

1. Buy the domain and, at the registrar, add these DNS records:
   - `A` records for the apex (`@`) pointing to `185.199.108.153`,
     `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record for `www` pointing to `forrest-jones.github.io`
2. In the repo settings → Pages → Custom domain, enter the domain and save.
   GitHub adds a `CNAME` file to the repo; commit it. Tick "Enforce HTTPS" once
   the certificate is issued (usually within an hour).
3. Update every absolute URL in one pass (canonical, Open Graph, JSON-LD,
   sitemap, robots, and the 404 page):

   ```bash
   grep -rl 'forrest-jones.github.io/Forrest-Jones-Website' index.html 404.html robots.txt sitemap.xml \
     | xargs sed -i 's#https://forrest-jones.github.io/Forrest-Jones-Website#https://www.yourdomain.com#g'
   ```

Do not add a `CNAME` file before the DNS records exist; Pages will start
redirecting to the new domain immediately and the site will go dark until DNS
resolves.
