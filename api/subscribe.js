// api/subscribe.js
// Vercel serverless function that handles newsletter and Pro waitlist signups.
// Calls Beehiiv API server-side so the API key never reaches the browser.

export default async function handler(req, res) {
  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse + validate input
  const { email, type, stage } = req.body || {};

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email' });
  }
  if (type !== 'newsletter' && type !== 'waitlist') {
    return res.status(400).json({ error: 'Invalid form type' });
  }

  // Validate stage if newsletter form
  const validStages = ['exploring', 'got-the-news', '9-month-journey', 'first-weeks', 'months-after'];
  if (type === 'newsletter') {
    if (!stage || !validStages.includes(stage)) {
      return res.status(400).json({ error: 'Please select your stage' });
    }
  }

  // Read env vars
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    console.error('Missing Beehiiv env vars');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Build Beehiiv subscription request
  const tags = type === 'newsletter' ? ['newsletter'] : ['pro-waitlist'];

  const customFields = type === 'newsletter' ? [{ name: 'stage', value: stage }] : [];

  const beehiivPayload = {
    email: email.toLowerCase().trim(),
    reactivate_existing: false,
    send_welcome_email: true,
    utm_source: 'nextroutine.com',
    utm_medium: type === 'newsletter' ? 'newsletter-form' : 'waitlist-form',
    custom_fields: customFields,
  };

  try {
    // Step 1: Subscribe to publication
    const subRes = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(beehiivPayload),
      }
    );

    if (!subRes.ok) {
      const errorBody = await safeJson(subRes);
      console.error('Beehiiv subscribe failed:', subRes.status, errorBody);
      // Map common Beehiiv errors to user-friendly messages
      if (subRes.status === 409 || (errorBody?.errors && JSON.stringify(errorBody.errors).includes('already'))) {
        // Already subscribed — treat as success from the user's perspective
        return res.status(200).json({ ok: true, alreadySubscribed: true });
      }
      return res.status(502).json({ error: 'Subscription service unavailable. Please try again.' });
    }

    const subData = await subRes.json();
    const subscriptionId = subData?.data?.id;

    // Step 2: Apply tags (Beehiiv tags are applied via a separate endpoint)
    if (subscriptionId && tags.length > 0) {
      try {
        await fetch(
          `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions/${subscriptionId}/tags`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tags }),
          }
        );
      } catch (tagErr) {
        // Tag failure is not fatal — subscriber is created
        console.error('Tag application failed:', tagErr);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Subscribe handler error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
