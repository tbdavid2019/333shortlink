# 🔐 Security & Authentication

333shortlink implements modern security practices, combining passwordless biometric authentication with robust API access controls.

---

## 🪪 WebAuthn & Passkeys

Passkeys provide biometric passwordless authentication using platform authenticators:

- **Supported Authenticators**: Touch ID, Face ID, Windows Hello, YubiKeys, and 1Password / Bitwarden / iCloud Keychain.
- **Single-Use Challenge Anti-Replay Protection**: Challenges are issued with a 120-second dynamic TTL and verified through Web Crypto ES256 signatures. Upon verification, challenges are immediately consumed in Cloudflare KV to prevent replay attacks.
- **Domain Bound**: Passkey credentials are bound to the specific domain or subdomain accessed, preventing credential phishing.

### Registering a Passkey

1. Log into your dashboard (`/dashboard/login`) using your initial `NUXT_SITE_TOKEN`.
2. Go to **Settings -> Security**.
3. Enter a device label (e.g., `MacBook Touch ID`).
4. Click **Add Passkey** and follow your operating system's biometric prompt.
5. You can now sign in instantly with a single touch or glance.

---

## 🔑 Site Token (API & MCP Access)

The `NUXT_SITE_TOKEN` environment variable serves two purposes:

1. **Initial Fallback Login**: Access the dashboard before Passkeys are enrolled.
2. **API & MCP Bearer Token**: Authorize programmatic API requests and MCP AI tool calls via `Authorization: Bearer <NUXT_SITE_TOKEN>`.

### Environment Configuration

In `.env`:

```env
NUXT_SITE_TOKEN="your-secure-token-here"
```

In Cloudflare Workers production:

```bash
npx wrangler secret put NUXT_SITE_TOKEN
```
