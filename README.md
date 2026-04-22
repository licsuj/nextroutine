# NextRoutine — nextroutine.com

Build your morning routine and beat phone addiction. Science-backed habit programs, weekly newsletter, and AI-powered routine builder.

## 🗂 Project Structure

```
nextroutine/
├── index.html              # Homepage
├── morning-routine.html    # Morning Routine hub page
├── screen-time.html        # Screen Time Reset hub page
├── newsletter.html         # Newsletter landing page
├── pricing.html            # Pricing page
├── privacy.html            # Privacy Policy (GDPR)
├── terms.html              # Terms of Service
├── 404.html                # Custom 404 page
├── blog/
│   └── index.html          # Blog index with category filter
├── css/
│   └── style.css           # Complete design system
├── js/
│   └── main.js             # All interactions & animations
├── assets/                 # Images, icons (add your own)
├── site.webmanifest        # PWA manifest
├── robots.txt              # SEO: allow all + sitemap reference
├── sitemap.xml             # All pages with priorities
├── vercel.json             # Hosting config (clean URLs, headers, 404)
└── README.md               # This file
```

## 🚀 Deployment (Vercel — Recommended)

### Option 1: GitHub → Vercel (recommended)

1. Create a new GitHub repository
2. Push this entire folder to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial NextRoutine deploy"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/nextroutine.git
   git push -u origin main
   ```
3. Go to [vercel.com](https://vercel.com) → New Project → Import your GitHub repo
4. Framework preset: **Other** (no build step needed)
5. Click Deploy — done in ~30 seconds

### Option 2: Drag & Drop (fastest)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Drag the entire `nextroutine/` folder onto the Vercel upload area
3. Done

### Option 3: Vercel CLI

```bash
npm install -g vercel
cd nextroutine/
vercel --prod
```

## 🌐 Custom Domain Setup (Vercel)

1. In Vercel project → Settings → Domains
2. Add `nextroutine.com` and `www.nextroutine.com`
3. Follow Vercel's DNS instructions (usually add A record + CNAME at your registrar)
4. SSL certificate is automatic — no setup needed

## 🔧 Before Launch — Configuration Checklist

### 1. Google Analytics 4
Replace the placeholder in `js/main.js`:
```javascript
// Find this line:
const GA_ID = 'G-XXXXXXXXXX';
// Replace with your actual GA4 Measurement ID:
const GA_ID = 'G-YOUR_ACTUAL_ID';
```

### 2. Email Service Provider (Newsletter)
In `js/main.js`, find the email form handler and replace the mock `setTimeout` with your ESP endpoint:

**ConvertKit example:**
```javascript
await fetch('https://api.convertkit.com/v3/forms/YOUR_FORM_ID/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ api_key: 'YOUR_PUBLIC_API_KEY', email: input.value })
});
```

**Mailchimp example:**
```javascript
// Use Mailchimp's embedded form action URL
await fetch('https://YOUR_LIST.us1.list-manage.com/subscribe/post-json', {
  method: 'POST',
  body: new URLSearchParams({ EMAIL: input.value, u: 'YOUR_U', id: 'YOUR_ID' })
});
```

### 3. Stripe Payment Links
Replace all Stripe placeholder links in `pricing.html` and `index.html`:

```html
<!-- Replace these: -->
href="https://buy.stripe.com/REPLACE_PRO_MONTHLY"
href="https://buy.stripe.com/REPLACE_PRO_ANNUAL"
href="https://buy.stripe.com/REPLACE_PROPLUS_MONTHLY"
href="https://buy.stripe.com/REPLACE_PROPLUS_ANNUAL"

<!-- With your actual Stripe payment links from:
     dashboard.stripe.com → Payment Links → Create link -->
```

### 4. Subscriber Count
Update the social proof number across all pages:
- Search for `12,000+` and replace with your actual count
- In `index.html`, `newsletter.html`, and nav badges

### 5. Social Media Handles
Replace `nextroutine` in footer social links:
```html
href="https://twitter.com/nextroutine"    <!-- Your Twitter/X handle -->
href="https://instagram.com/nextroutine"  <!-- Your Instagram handle -->
```

### 6. OG Images (Social Sharing)
Add real images to `/assets/`:
- `og-home.jpg` (1200×630px) — homepage social card
- `og-morning.jpg` (1200×630px) — morning routine page
- `og-screen-time.jpg` (1200×630px) — screen time page
- `og-newsletter.jpg` (1200×630px) — newsletter page
- `og-pricing.jpg` (1200×630px) — pricing page
- `og-blog.jpg` (1200×630px) — blog index

### 7. PWA Icons (Optional)
Add to `/assets/`:
- `icon-192.png` (192×192px) — app icon
- `icon-512.png` (512×512px) — app icon

### 8. Sitemap — Update Domain
The sitemap already uses `nextroutine.com`. If your domain is different, do a find-and-replace in `sitemap.xml`.

### 9. Legal Pages — Company Details
In `privacy.html` and `terms.html`, add your actual company name and address if operating as a registered business.

## 📧 Email Form Integration

All email forms use the class `.email-form`. The JS handler in `main.js` is pre-wired and ready — just swap the fetch endpoint.

Forms submit on `Enter` key and button click. Success state is handled automatically (form hides, success message shows).

## 🎨 Design System

All design tokens are CSS custom properties in `css/style.css`:

```css
:root {
  --bg:           #0A0A0F;   /* page background */
  --violet:       #7C3AED;   /* primary accent */
  --emerald:      #10B981;   /* secondary accent */
  --amber:        #F59E0B;   /* urgency/warning */
  /* ... full system documented in style.css */
}
```

## 📊 SEO

Each page includes:
- Unique title + meta description (keyword-first)
- Open Graph + Twitter Card tags
- JSON-LD schema markup (WebSite, Article, FAQPage, Product, Blog)
- Canonical URLs + hreflang
- Breadcrumb navigation on inner pages
- Semantic HTML with proper heading hierarchy

Target keyword clusters are naturally embedded throughout all page copy.

## 🔐 Security

`vercel.json` includes production-ready security headers:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security` (HSTS)
- `Content-Security-Policy` (customise as needed)

## 🍪 Cookie Consent (GDPR)

The cookie banner is pre-built and GDPR-compliant:
- Shown to all users on first visit
- Stores preference in `localStorage` (`nr_cookie_consent`)
- Google Analytics only loads after `'accepted'` is stored
- Decline prevents any analytics loading

## ⚡ Performance

- Zero JS frameworks or build tools
- Google Fonts with `preconnect` for fastest load
- All JS deferred (`defer` attribute)
- Static assets cached for 1 year via `vercel.json` headers
- IntersectionObserver for scroll animations (no jank)
- No render-blocking resources

## 📱 Responsive Breakpoints

| Breakpoint | Width |
|------------|-------|
| Mobile     | 320px+ |
| Tablet     | 768px+ |
| Desktop    | 1024px+ |
| Wide       | 1440px+ |

## 🔗 Affiliate Setup

Affiliate links are pre-labelled `"Our Pick"` or `"Recommended"` in affiliate cards. All external links use `rel="nofollow noopener"`.

To add new affiliate products, duplicate any `.affiliate-card` block and update the icon, title, description, and link.

## 📞 Contact

- General: hello@nextroutine.com
- Privacy/GDPR: privacy@nextroutine.com
- Website: nextroutine.com

---

Built with pure HTML5, CSS3, and vanilla JavaScript. Zero dependencies. Deployable anywhere.
