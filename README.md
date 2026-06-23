# FORGE — Strength & Conditioning

A modern, responsive, multi-page gym website built with **plain HTML5, CSS3, and vanilla JavaScript** — no frameworks, no build step, no dependencies. Ready to deploy straight to GitHub Pages.

![FORGE](https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200)

## Live Demo

Once deployed, your site will be available at:
`https://<your-github-username>.github.io/<repository-name>/`

---

## Features

- **5 fully built pages**: Home, Membership Plans, Equipment Catalog, Exercise Library, Contact
- **Mobile-first responsive design** — looks great from 320px phones up to large desktops
- **Dark / light mode toggle** with preference saved in `localStorage`
- **Sticky navigation bar** with animated mobile hamburger menu
- **Equipment search** — live filter by name or muscle group
- **Exercise filtering** by muscle group (Chest, Back, Legs, Shoulders, Arms)
- **BMI Calculator** — supports both metric (kg/cm) and imperial (lb/in) units
- **FAQ accordion** sections on Home and Membership pages
- **Contact form** and **membership inquiry form** with client-side validation
- **Scroll-triggered reveal animations** using `IntersectionObserver`
- **Back-to-top button**
- **Google Maps placeholder** (with a commented example of how to drop in a real embed)
- **SEO-friendly**: semantic HTML5, meta descriptions, Open Graph tags, `sitemap.xml`, `robots.txt`
- **Accessibility**: skip-to-content link, visible focus states, `aria-*` attributes, alt text on all images, `prefers-reduced-motion` support
- **Fast loading**: no build tools, no JS frameworks, system-friendly Google Fonts, lazy-loaded images

---

## Folder Structure

```
forge-gym/
├── index.html              # Home page
├── membership.html         # Membership plans + pricing + inquiry form
├── equipment.html          # Searchable equipment catalog (12 items)
├── exercises.html          # Exercise library + muscle filter + BMI calculator
├── contact.html            # Contact form + map placeholder + social links
├── robots.txt              # Search engine crawl rules
├── sitemap.xml             # XML sitemap for SEO
├── .nojekyll                # Tells GitHub Pages to skip Jekyll processing
├── README.md
└── assets/
    ├── css/
    │   └── style.css       # All styles (design tokens, layout, components)
    ├── js/
    │   └── script.js       # All interactivity (vanilla JS, no dependencies)
    └── images/             # (optional) local image assets if you replace the placeholders
```

All five HTML pages share the same `assets/css/style.css` and `assets/js/script.js`, so you only maintain styles and logic in one place.

---

## Design System

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#0a0a0a` | Page background |
| `--color-surface` | `#161616` | Cards, alt sections |
| `--color-ember` | `#ff3d1a` | Primary accent (CTAs, links, highlights) |
| `--color-amber` | `#ffb627` | Secondary accent (stats, badges) |
| Display font | **Oswald** | Headings, nav, buttons |
| Body font | **Inter** | Paragraphs, form fields |
| Mono font | **JetBrains Mono** | Stats, prices, tags, labels |

The signature visual motif is the **"heat bar"** — a small ember-to-amber gradient line used as a section divider throughout the site, echoing the forge/ember theme in the brand name.

All colors, spacing, and fonts are defined as CSS custom properties (variables) at the top of `style.css` under `:root`, so re-theming the whole site means editing a handful of values in one place.

---

## Image Placeholders

This project uses **free, hotlinked Unsplash photos** (`images.unsplash.com`) as placeholders so the site looks complete out of the box. For a production launch you should:

1. Download and optimize your own gym photos (compress with [Squoosh](https://squoosh.app) or similar).
2. Save them into `assets/images/`.
3. Update the `src="..."` attributes in the HTML files to point to your local files, e.g. `assets/images/hero.jpg`.

Using your own images is strongly recommended for production — hotlinked placeholder URLs can change or be rate-limited.

---

## Customizing Content

| What to change | Where |
|---|---|
| Gym name / branding | Search and replace `FORGE` in all `.html` files, and the brand mark color in `style.css` |
| Hero slogan | `index.html` → `.hero-content` |
| Pricing | `membership.html` → `.price-card` blocks |
| Equipment list | `equipment.html` → `.equip-card` blocks (`data-name` / `data-muscles` power the search) |
| Exercises | `exercises.html` → `.exercise-card` blocks inside each `.exercise-category` |
| Contact info / map | `contact.html` and the contact section in `index.html` |
| Colors / fonts | `assets/css/style.css` → `:root` section at the top |

### Adding a real Google Map

Replace the `.map-placeholder` div inside `contact.html` (and optionally `index.html`) with a real embed:

```html
<iframe src="https://www.google.com/maps/embed?pb=YOUR_EMBED_CODE"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        title="Gym location map"></iframe>
```

Get your embed code from Google Maps → Share → Embed a map.

### Connecting the contact/inquiry forms to a real backend

Both forms (`#contact-form` in `contact.html` and `#membership-form` in `membership.html`) currently validate input and show a simulated success message entirely in the browser — **no data is sent anywhere**. To make them functional, open `assets/js/script.js` and replace the success block inside `initContactForm()` / `initMembershipForm()` with a real request, e.g. using [Formspree](https://formspree.io), [Netlify Forms](https://docs.netlify.com/forms/setup/), or your own API endpoint:

```js
fetch('https://your-api-endpoint.com/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, message })
})
  .then(() => showStatus(status, 'Message sent!', 'success'))
  .catch(() => showStatus(status, 'Something went wrong. Try again.', 'error'));
```

---

## Deploying to GitHub Pages

1. **Create a new repository** on GitHub (e.g. `forge-gym`).
2. **Push this project** to the repository:
   ```bash
   cd forge-gym
   git init
   git add .
   git commit -m "Initial commit: FORGE gym website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/forge-gym.git
   git push -u origin main
   ```
3. On GitHub, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, select **Deploy from a branch**.
5. Under **Branch**, select `main` and `/ (root)`, then click **Save**.
6. Wait 1–2 minutes, then refresh the Pages settings tab — your live URL will appear:
   `https://<your-username>.github.io/forge-gym/`

That's it — no build step, no CI config needed, since this is a static site.

### Updating the canonical URLs

Once your site is live, update the placeholder URLs (currently `https://example.com/...`) in:
- The `<link rel="canonical">` tag in each HTML file's `<head>`
- `sitemap.xml`
- `robots.txt`

to your real GitHub Pages URL (or custom domain, if you attach one).

---

## Browser Support

Built with standard, well-supported CSS and JS (Flexbox, Grid, CSS custom properties, `IntersectionObserver`, `localStorage`). Works in all current versions of Chrome, Firefox, Safari, and Edge. Gracefully degrades animations if `prefers-reduced-motion` is set.

## License

Free to use and modify for your own gym or fitness business.
