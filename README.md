# nextroutine.com

AI-personalized fitness and daily routine builder. Built with Next.js 15, TypeScript, and CSS Modules.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules + Google Fonts (Instrument Serif + DM Sans)
- **Deployment**: Vercel

---

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel (step by step)

### Option A — Vercel CLI (fastest)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. From the project root
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: nextroutine
# - Directory: ./
# - Override settings? No

# 3. Deploy to production
vercel --prod
```

### Option B — GitHub + Vercel dashboard

```bash
# 1. Initialise git
git init
git add .
git commit -m "feat: initial landing page"

# 2. Create GitHub repo (requires GitHub CLI)
gh repo create nextroutine --public --source=. --remote=origin --push

# Without GitHub CLI:
# - Create repo at github.com/new
# - Then:
git remote add origin https://github.com/YOUR_USERNAME/nextroutine.git
git branch -M main
git push -u origin main
```

Then:
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your `nextroutine` GitHub repo
3. Vercel auto-detects Next.js — click **Deploy**
4. Add your custom domain `nextroutine.com` under **Settings → Domains**

---

## Environment variables

Add these in Vercel dashboard under **Settings → Environment Variables** (or in `.env.local` locally):

```bash
# AI backend (when you wire up the routine generator)
ANTHROPIC_API_KEY=sk-ant-...

# Email provider — Beehiiv
BEEHIIV_API_KEY=...
BEEHIIV_PUBLICATION_ID=...

# Payments — Stripe
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# Analytics (optional)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout + metadata/OG
│   └── page.tsx          # Assembles all sections
├── components/
│   ├── Nav.tsx            # Sticky nav with scroll blur
│   ├── Hero.tsx           # Animated hero + ticker
│   ├── ValueProps.tsx     # Three-column value props
│   ├── HowItWorks.tsx     # Four-step grid
│   ├── Testimonials.tsx   # Dark testimonials section
│   ├── Pricing.tsx        # Free vs Pro cards
│   ├── FAQ.tsx            # Accordion FAQ
│   ├── EmailCapture.tsx   # Newsletter capture form
│   ├── FinalCTA.tsx       # Interactive goal selector + CTA
│   └── Footer.tsx         # Footer with links
└── styles/
    └── globals.css        # Design tokens + base styles
```

---

## Wiring up the AI routine generator

In `FinalCTA.tsx`, replace the mock submit handler with a real API call:

```ts
// src/app/api/generate/route.ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: Request) {
  const { goal, time, equipment, injuries } = await req.json();

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Generate a personalized 7-day routine for someone with:
- Goal: ${goal}
- Daily time available: ${time}
- Equipment: ${equipment || "none"}
- Injuries or limitations: ${injuries || "none"}

Format as a structured weekly plan with daily breakdown, duration, and brief reasoning.`,
      },
    ],
  });

  return Response.json({ routine: message.content[0] });
}
```

Then in `FinalCTA.tsx`:
```ts
const res = await fetch("/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ goal, time }),
});
const { routine } = await res.json();
```

---

## Wiring up the email form

In `EmailCapture.tsx`, replace the mock with a real Beehiiv API call:

```ts
// src/app/api/subscribe/route.ts
export async function POST(req: Request) {
  const { email } = await req.json();

  const res = await fetch(
    `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
      },
      body: JSON.stringify({ email, reactivate_existing: false }),
    }
  );

  if (!res.ok) return Response.json({ error: "Failed" }, { status: 500 });
  return Response.json({ success: true });
}
```

---

## Customisation checklist

- [ ] Replace placeholder testimonials with real user quotes
- [ ] Update subscriber count in `EmailCapture.tsx` (`1,200+`)
- [ ] Wire up Anthropic API for live routine generation
- [ ] Wire up Beehiiv/ConvertKit for email capture
- [ ] Add Stripe for Pro subscription payments
- [ ] Add PostHog or Plausible for analytics
- [ ] Add `/privacy` and `/terms` pages
- [ ] Connect `nextroutine.com` domain in Vercel dashboard
