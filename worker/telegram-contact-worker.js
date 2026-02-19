const RATE_LIMIT_WINDOW_SECONDS = 600;
const RATE_LIMIT_MAX = 5;
const MIN_DWELL_MS = 3000;

const localRateState = new Map();

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(request, env) });
    }

    if (request.method !== 'POST') {
      return json(request, env, { ok: false, error: 'Method not allowed' }, 405);
    }

    const originValidation = validateOrigin(request, env);
    if (!originValidation.ok) {
      return json(request, env, { ok: false, error: originValidation.error }, 403);
    }

    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID || !env.TURNSTILE_SECRET_KEY) {
      return json(request, env, { ok: false, error: 'Missing worker secrets' }, 500);
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rate = await checkRateLimit(env, ip);
    if (!rate.ok) {
      return json(request, env, { ok: false, error: 'Too many requests. Try again later.' }, 429);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json(request, env, { ok: false, error: 'Invalid JSON' }, 400);
    }

    const name = clean(payload.name);
    const email = clean(payload.email);
    const message = clean(payload.message);
    const source = clean(payload.source || 'portfolio-contact-form');
    const turnstileToken = clean(payload.turnstileToken || '');
    const honeypot = clean(payload.website || '');
    const dwellMs = Number(payload.dwellMs || 0);

    if (honeypot) {
      return json(request, env, { ok: false, error: 'Spam detected' }, 400);
    }

    if (!Number.isFinite(dwellMs) || dwellMs < MIN_DWELL_MS) {
      return json(request, env, { ok: false, error: 'Form submitted too quickly' }, 400);
    }

    if (!name || !email || !message) {
      return json(request, env, { ok: false, error: 'Missing required fields' }, 400);
    }

    if (!turnstileToken) {
      return json(request, env, { ok: false, error: 'Captcha token missing' }, 400);
    }

    const turnstileOk = await verifyTurnstile(env, turnstileToken, ip);
    if (!turnstileOk) {
      return json(request, env, { ok: false, error: 'Captcha verification failed' }, 401);
    }

    const telegramText = [
      'New portfolio transmission',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Source: ${source}`,
      '',
      'Message:',
      message
    ].join('\n');

    const telegramUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;

    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: telegramText
      })
    });

    if (!telegramResponse.ok) {
      const details = await telegramResponse.text();
      return json(request, env, { ok: false, error: 'Telegram API error', details }, 502);
    }

    return json(request, env, { ok: true }, 200);
  }
};

function clean(value) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, 4000);
}

function parseAllowedOrigins(env) {
  const raw = env.ALLOWED_ORIGINS || '';
  return raw
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}

function validateOrigin(request, env) {
  const allowed = parseAllowedOrigins(env);
  if (allowed.length === 0) {
    return { ok: true };
  }

  const origin = request.headers.get('Origin') || '';
  if (!origin || !allowed.includes(origin)) {
    return { ok: false, error: 'Origin not allowed' };
  }

  return { ok: true };
}

function corsHeaders(request, env) {
  const allowed = parseAllowedOrigins(env);
  const origin = request.headers.get('Origin') || '';
  const resolvedOrigin = allowed.length === 0 ? '*' : allowed.includes(origin) ? origin : 'null';

  return {
    'Access-Control-Allow-Origin': resolvedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin'
  };
}

function json(request, env, data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(request, env)
    }
  });
}

async function verifyTurnstile(env, token, ip) {
  const body = new URLSearchParams();
  body.set('secret', env.TURNSTILE_SECRET_KEY);
  body.set('response', token);
  if (ip && ip !== 'unknown') {
    body.set('remoteip', ip);
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });

  if (!response.ok) {
    return false;
  }

  const result = await response.json();
  return Boolean(result.success);
}

async function checkRateLimit(env, ip) {
  if (!ip) {
    return { ok: true };
  }

  if (env.CONTACT_RATE_LIMIT_KV) {
    return checkRateLimitKv(env, ip);
  }

  return checkRateLimitMemory(ip);
}

async function checkRateLimitKv(env, ip) {
  const now = Date.now();
  const windowBucket = Math.floor(now / (RATE_LIMIT_WINDOW_SECONDS * 1000));
  const key = `rl:${ip}:${windowBucket}`;

  const current = Number((await env.CONTACT_RATE_LIMIT_KV.get(key)) || '0');
  if (current >= RATE_LIMIT_MAX) {
    return { ok: false };
  }

  await env.CONTACT_RATE_LIMIT_KV.put(key, String(current + 1), {
    expirationTtl: RATE_LIMIT_WINDOW_SECONDS + 60
  });

  return { ok: true };
}

function checkRateLimitMemory(ip) {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_SECONDS * 1000;
  const timestamps = localRateState.get(ip) || [];
  const active = timestamps.filter((ts) => ts > cutoff);

  if (active.length >= RATE_LIMIT_MAX) {
    localRateState.set(ip, active);
    return { ok: false };
  }

  active.push(now);
  localRateState.set(ip, active);
  return { ok: true };
}
