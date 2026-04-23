# NextRoutine v4

**nextroutine.com** — Daily routines for new dads.  
Static site deployed on Vercel via GitHub. HTML/CSS/JS only — no framework, no build step.

---

## File Structure

```
nextroutine-v4/
├── index.html              ← Homepage (9-section, primary conversion page)
├── new-dad.html            ← New dad niche hub (primary track)
├── morning-routine.html    ← Morning routine hub
├── sleep-better.html       ← Sleep hub
├── screen-time.html        ← Screen time hub
├── newsletter.html         ← Standalone newsletter signup
├── pricing.html            ← Full pricing comparison (Free / Pro / Pro+)
├── quiz.html               ← Standalone quiz (moved off homepage)
├── success.html            ← Post-payment success
├── cancel.html             ← Cancelled checkout recovery
├── 404.html                ← Custom 404
├── privacy.html            ← GDPR Privacy Policy (Malta)
├── terms.html              ← Terms of Service
├── blog/
│   └── index.html          ← Blog index
├── css/style.css           ← Complete design system
├── js/main.js              ← All JS (nav, forms, cookie, pricing toggle, FAQ, etc.)
├── assets/favicon.svg      ← SVG favicon
├── vercel.json             ← Vercel config: clean URLs, headers, redirects
├── robots.txt
├── sitemap.xml
├── site.webmanifest
└── .env.example            ← Environment variable template
```

---

## Before Going Live

### 1. GA4 ID
`js/main.js` → `loadAnalytics()` → replace `G-XXXXXXXXXX`

### 2. ESP (Email)
`js/main.js` → `initEmailForms()` → uncomment and update the `fetch()` call with your ConvertKit or Mailchimp endpoint.

### 3. Stripe Payment Links
`js/main.js` → `STRIPE_LINKS` object → replace all 4 `REPLACE_*` values with real Stripe Payment Link URLs.

### 4. Social Media URLs
`index.html` footer — update Instagram, TikTok, X, YouTube `href` values.

### 5. Vercel Env Vars
Set in Vercel Dashboard → Settings → Environment Variables (see `.env.example`).

### 6. Stripe Webhook
Register `https://nextroutine.com/api/webhook` in Stripe Dashboard → Webhooks. Add `STRIPE_WEBHOOK_SECRET` to Vercel.

---

## Design System

| Token | Value |
|---|---|
| Background base | `#0F1117` |
| Background alt | `#131620` |
| Surface | `#1A1D27` |
| Green primary | `#2D6A4F` |
| Green bright | `#40916C` |
| Gold | `#D4A853` |
| Text primary | `#F0F2F5` |
| Heading font | Plus Jakarta Sans |
| Body font | Inter |

**Rule: Green and gold only. No niche colors. No exceptions.**

---

## Deploy to Vercel

```bash
git init && git add . && git commit -m "v4 launch"
git remote add origin https://github.com/YOUR_USERNAME/nextroutine.git
git push -u origin main
# Then: Vercel Dashboard → Import repo → Deploy
# No build command. Output directory: leave blank (root).
```

© 2025 NextRoutine Ltd
