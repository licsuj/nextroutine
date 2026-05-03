// api/subscribe.js
// Vercel serverless function for newsletter and Pro waitlist signups.
// Calls Beehiiv API server-side so the API key never reaches the browser.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

  const validStages = ['exploring', 'got-the-news', '9-month-journey', 'first-weeks', 'months-after'];
  if (type === 'newsletter') {
    if (!stage || !validStages.includes(stage)) {
      return res.status(400).json({ error: 'Please select your stage' });
    }
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    console.error('Missing Beehiiv env vars');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const tagToApply = type === 'newsletter' ? 'newsletter' : 'pro-waitlist';
  const customFields = type === 'newsletter' ? [{ name: 'stage', value: stage }] : [];

  console.log('=== INCOMING REQUEST ===');
  console.log('Email:', normalizedEmail);
  console.log('Type:', type);
  console.log('Tag to apply:', tagToApply);
  console.log('========================');

  try {
    // Step 1: Check if subscriber already exists
    const existing = await findSubscriber(apiKey, publicationId, normalizedEmail);

    console.log('Lookup result:', existing ? 'FOUND' : 'NOT FOUND');

    if (existing) {
      // DIAGNOSTIC — log full subscriber shape to debug tag detection
      console.log('=== EXISTING SUBSCRIBER ===');
      console.log(JSON.stringify(existing, null, 2));
      console.log('===========================');

      // Subscriber exists. Check if they already have the tag we'd apply.
      const existingTags = (existing.tags || []).map(t => typeof t === 'string' ? t : t?.tag).filter(Boolean);
      const hasTag = existingTags.includes(tagToApply);

      console.log('Detected existing tags:', existingTags);
      console.log('Looking for tag:', tagToApply);
      console.log('hasTag:', hasTag);

      if (hasTag) {
        // Already subscribed AND already has this tag — pure duplicate
        return res.status(200).json({ ok: true, alreadySubscribed: true });
      }

      // Subscriber exists but doesn't have THIS form's tag — add the tag
      // (e.g. user signed up for newsletter, now joining waitlist)
      try {
        await applyTag(apiKey, publicationId, existing.id, tagToApply);
      } catch (tagErr) {
        console.error('Tag application failed for existing subscriber:', tagErr);
      }

      // From the user's perspective they're newly added to this list
      return res.status(200).json({ ok: true });
    }

    // Step 2: New subscriber — create
    console.log('Creating new subscriber...');

    const subRes = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          reactivate_existing: false,
          send_welcome_email: true,
          utm_source: 'nextroutine.com',
          utm_medium: type === 'newsletter' ? 'newsletter-form' : 'waitlist-form',
          custom_fields: customFields,
        }),
      }
    );

    const responseBody = await safeJson(subRes);

    console.log('=== NEW SUBSCRIBER CREATE RESPONSE ===');
    console.log('HTTP Status:', subRes.status);
    console.log('Body:', JSON.stringify(responseBody, null, 2));
    console.log('======================================');

    if (!subRes.ok) {
      console.error('Beehiiv subscribe failed:', subRes.status, responseBody);
      return res.status(502).json({ error: 'Subscription service unavailable. Please try again.' });
    }

    const subscriptionId = responseBody?.data?.id;
    console.log('Extracted subscription ID:', subscriptionId);

    // Step 3: Apply tag
    if (subscriptionId) {
      try {
        const tagRes = await applyTag(apiKey, publicationId, subscriptionId, tagToApply);
        console.log('Tag application status:', tagRes.status);
      } catch (tagErr) {
        console.error('Tag application failed for new subscriber:', tagErr);
      }
    } else {
      console.error('No subscription ID extracted — tag will not be applied');
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Subscribe handler error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

// Look up a subscriber by email. Returns subscriber object if found, null otherwise.
async function findSubscriber(apiKey, publicationId, email) {
  try {
    const url = `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions/by_email/${encodeURIComponent(email)}?expand=tags`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    console.log('findSubscriber HTTP status:', response.status);

    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      console.error('Subscriber lookup failed:', response.status);
      return null;
    }

    const body = await response.json();
    console.log('findSubscriber body:', JSON.stringify(body, null, 2));
    return body?.data || null;
  } catch (err) {
    console.error('Subscriber lookup error:', err);
    return null;
  }
}

async function applyTag(apiKey, publicationId, subscriptionId, tag) {
  return fetch(
    `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions/${subscriptionId}/tags`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tags: [tag] }),
    }
  );
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
