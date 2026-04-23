# NextRoutine v3

**nextroutine.com** — The Night-to-Morning Reset  
Static site deployed on Vercel via GitHub. No framework, no build step — pure HTML/CSS/JS.

---

## Stack

| Layer | Technology |
|---|---|
| Hosting | Vercel |
| DNS / Domain | Your registrar → Vercel |
| Payments | Stripe (Payment Links) |
| Email / ESP | ConvertKit or Mailchimp |
| Analytics | Google Analytics 4 |
| Fonts | Google Fonts (Sora + Inter) |

---

## Project Structure

```
nextroutine-v3/
├── index.html              # Homepage (primary conversion page)
├── morning-routine.html    # Orange niche hub
├── sleep-better.html       # Teal niche hub
├── screen-time.html        # Purple niche hub
├── dad-track.html          # Yellow niche hub
├── newsletter.html         # Standalone signup page
├── pricing.html            # Pricing + Stripe links
├── success.html            # Post-payment success
├── cancel.html             # Cancelled checkout recovery
├── 404.html                # Custom 404
├── privacy.html            # GDPR Privacy Policy (Malta / EU)
├── terms.html              # Terms of Service
├── blog/
│   └── index.html          # Blog index (article stubs)
├── css/
│   └── style.css           # Complete design system
├── js/
│   └── main.js             # All JS: quiz, gates, forms, analytics
├── assets/
│   └── favicon.svg         # SVG favicon
├── vercel.json             # Vercel config: clean URLs, headers, redirects
├── robots.txt              # Search engine directives
├── sitemap.xml             # Full sitemap (update domain before push)
├── site.webmanifest        # PWA manifest
├── .env.example            # Environment variable template
└── README.md               # This file
```

---

## Before Going Live — Required Substitutions

### 1. Google Analytics 4
Open `js/main.js`, find `loadAnalytics()`, replace:
```js
const GA_ID = 'G-XXXXXXXXXX';
```
With your real GA4 Measurement ID.

### 2. ESP Form Action (Email Capture)
Open `js/main.js`, find `initEmailForms()`, replace the fetch URL:
```js
// ConvertKit:
fetch('https://api.convertkit.com/v3/forms/YOUR_FORM_ID/subscribe', ...)

// Mailchimp:
fetch('https://YOUR_DC.api.mailchimp.com/3.0/lists/YOUR_LIST_ID/members', ...)
```

### 3. Stripe Payment Links
Search and replace these tokens across `index.html` and `pricing.html`:

| Token | Replace with |
|---|---|
| `REPLACE_PRO_MONTHLY` | Your Stripe Pro monthly payment link URL |
| `REPLACE_PRO_ANNUAL` | Your Stripe Pro annual payment link URL |
| `REPLACE_PROPLUS_MONTHLY` | Your Stripe Pro+ monthly payment link URL |
| `REPLACE_PROPLUS_ANNUAL` | Your Stripe Pro+ annual payment link URL |

Create payment links in Stripe Dashboard → Payment Links.  
Pro: €7.99/mo or €59.99/yr. Pro+: €14.99/mo or €99.99/yr.

### 4. Sitemap Domain
Open `sitemap.xml`, replace all instances of:
```
https://nextroutine.com
```
With your live domain if different (should be correct already).

### 5. Canonical Tags
All pages use `<link rel="canonical" href="https://nextroutine.com/...">`.  
If your domain is confirmed as `nextroutine.com`, no changes needed.

### 6. Social Media URLs
Open `index.html` footer (and other page footers), update:
```html
<!-- Instagram, TikTok, X, YouTube icon links -->
```
Replace `#` href placeholders with your real profile URLs.

### 7. Vercel Webhook Endpoint
In Stripe Dashboard → Webhooks, add:
```
https://nextroutine.com/api/webhook
```
Then set `STRIPE_WEBHOOK_SECRET` in Vercel environment variables.

### 8. Vercel Environment Variables
In Vercel Dashboard → Project → Settings → Environment Variables, add:
- `NEXT_PUBLIC_GA_ID`
- `CONVERTKIT_FORM_ID` / `CONVERTKIT_API_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

See `.env.example` for the full list.

---

## Deploying to Vercel

```bash
# 1. Clone or push this repo to GitHub
git init
git add .
git commit -m "v3 launch"
git remote add origin https://github.com/YOUR_USERNAME/nextroutine.git
git push -u origin main

# 2. In Vercel Dashboard:
#    New Project → Import GitHub repo → Deploy
#    No build command needed (static site)
#    Output directory: leave blank (root)

# 3. Add custom domain: nextroutine.com
#    Follow Vercel DNS instructions
```

---

## Key JS Features

| Feature | Where |
|---|---|
| 3-step quiz with conditional Q2 | `initQuiz()` in main.js |
| Quiz result → localStorage | `nr_quiz_track` key |
| Personalised email CTA from quiz | `personaliseEmailCTAs()` |
| Template content gate | `initContentGate()` |
| Pricing monthly/annual toggle | `initPricingToggle()` |
| Scroll fade-in animations | `initScrollAnimations()` |
| Animated stat counters | `initCounters()` |
| Sticky mobile CTA bar | `initStickyCTA()` |
| Cookie consent → GA4 gating | `initCookieConsent()` + `loadAnalytics()` |
| Blog category filtering | `initBlogFilter()` |

---

## Niche Color System

| Niche | Color | Hex |
|---|---|---|
| Morning Routine | Orange | `#FF6B35` |
| Sleep Better | Teal | `#2EC4B6` |
| Screen Time | Purple | `#7C3AED` |
| Dad / New Parent | Yellow | `#FFD166` |
| Midlife Reset | Deep Navy | `#1E3A5F` |

---

## Income Readiness Checklist

- [ ] GA4 ID replaced in main.js
- [ ] ESP form action URL replaced in main.js
- [ ] All 4 Stripe payment link URLs replaced
- [ ] Social media profile URLs filled in footer
- [ ] Vercel env vars set in dashboard
- [ ] Stripe webhook endpoint registered
- [ ] Custom domain verified on Vercel
- [ ] sitemap.xml submitted to Google Search Console
- [ ] `.env` added to `.gitignore` (never commit real secrets)
- [ ] `.env.example` is the only env file committed

---

© 2025 NextRoutine. Made for people who are done with who they were yesterday.
