# Contact Form -> Telegram Setup (Hardened)

This setup keeps Telegram credentials server-side and adds anti-spam controls.

## 1) Telegram

1. Create bot via `@BotFather`.
2. Save bot token.
3. Send one message to your bot.
4. Get chat ID from:
`https://api.telegram.org/bot<BOT_TOKEN>/getUpdates`

## 2) Cloudflare Turnstile

1. In Cloudflare dashboard, create a Turnstile site.
2. Add your domains:
- `localhost`
- your production domain (for GitHub Pages)
3. Copy:
- Site key
- Secret key

## 3) Deploy Worker Relay

Worker source:
`/Users/duggempudi_admin/Downloads/THEAVINASHREDDY.github.io/worker/telegram-contact-worker.js`

Set Worker secrets:

1. `TELEGRAM_BOT_TOKEN`
2. `TELEGRAM_CHAT_ID`
3. `TURNSTILE_SECRET_KEY`

Set Worker environment variable:

1. `ALLOWED_ORIGINS`
Value example:
`http://localhost:5173,https://theavinashreddy.github.io`

Optional but recommended rate limit storage:

1. Create a KV namespace
2. Bind it to Worker as `CONTACT_RATE_LIMIT_KV`

Worker limits in code:

1. `5 requests per 10 minutes` per IP
2. Honeypot and minimum dwell-time checks
3. Turnstile verification required

## 4) Frontend env

In `/Users/duggempudi_admin/Downloads/THEAVINASHREDDY.github.io/.env.local`:

1. `VITE_CONTACT_WEBHOOK_URL=https://<worker-subdomain>.workers.dev`
2. `VITE_TURNSTILE_SITE_KEY=<turnstile-site-key>`

## 5) Local test

1. `npm run dev`
2. Open contact form
3. Complete captcha
4. Submit a message
5. Confirm message arrives in Telegram

## 6) Security checklist

1. Do not store Telegram token in frontend env.
2. Keep Worker secrets as Secret type, not plaintext.
3. Restrict `ALLOWED_ORIGINS` to your real domains.
4. Rotate bot token if it was shared publicly.
