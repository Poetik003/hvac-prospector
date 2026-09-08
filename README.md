# ProSpector — final rebuild (Netlify Identity gated)

Single-file production build for `prospectorproai.netlify.app`.

## Files
- `index.html` — the whole app (auth gate + 7 modules + settings)
- `netlify.toml` — headers, CSP, SPA redirect
- `README.md` — this file

## Deploy (from `Poetik003/hvac-prospector`)
1. Replace repo root `index.html` and `netlify.toml` with these two files, commit to `main`.
2. Netlify auto-builds. `hvac-prospector.netlify.app` currently returns 404 — either wire the domain to `prospectorproai` or re-deploy the `hvac-prospector` project pointing at the same repo.

## Netlify Identity setup (the last open thread — finish this)
> **Important context:** Netlify **reversed the Identity deprecation on 19 Feb 2026**. Identity is staying. Do NOT migrate to Auth0. Source: https://answers.netlify.com/t/netlify-identity-is-staying-feb-2026-reversal-what-changed-whos-affected-and-how-to-proceed/162733

1. Open **https://app.netlify.com/projects/prospectorproai/identity** (direct URL — Identity is not in the left nav until it's enabled).
2. Click **Enable Identity**.
3. Go to **Identity → Registration → Registration preferences → Configure** → set to **Invite only** → Save. Docs: https://docs.netlify.com/manage/security/secure-access-to-sites/identity/registration-login/
4. Go to **Identity → Users → Invite users** → invite your admin email. You'll get an email with an `invite_token` link.
5. Click the invite link. It lands on the site; the Identity widget in `index.html` handles the invite token automatically (`handleAuthCallback`), prompts you to set a password, and signs you in.
6. Sign-in works from the gate screen on every subsequent visit.

## What was fixed in this rebuild
- **Netlify Identity gate** wraps the whole app — nothing renders until a valid user session exists.
- **Voice stack warm-up** is now a real precondition: `Start call` refuses to dial until the voice pipeline is primed, which was the root cause of the "Voice Training Error" you kept hitting. On warm-up failure we drop to **Smart Voice fallback** and continue.
- **Personas** (Sarah / Maria / Lisa / Alex) each carry their own voice/model/tone/prompt, editable and persisted per session.
- **Script Test Center** runs scenarios without dialing; scores clarity, objection handling, CTA.
- **Apollo AI** panel with sample results and one-click "Add to leads".
- **API keys** stored in per-user `localStorage` (never committed). For production, move to Netlify Functions with env vars.
- **CSP + hardening** in `netlify.toml`.

## Widget note
This build uses the classic `netlify-identity-widget` CDN script because the app ships as a single HTML file with no bundler. The Feb 2026 docs note that the widget "still works — Netlify has not stopped supporting it" and recommend the newer `@netlify/identity` npm package **only for projects with a build step**. If/when you add Vite or Next, migrate to `@netlify/identity` — the auth logic will translate one-for-one.
