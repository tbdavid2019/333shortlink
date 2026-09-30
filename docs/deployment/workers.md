# Deployment on Cloudflare Workers

333shortlink runs 100% on Cloudflare Workers with Static Assets.

## 🚀 Quick Setup & Deployment

1. **Clone or Fork**: Clone this repository to your local machine:

   ```bash
   git clone https://github.com/tbdavid2019/333shortlink.git
   cd 333shortlink
   pnpm install
   ```

2. **Create a KV Namespace**:

   ```bash
   npx wrangler kv namespace create KV
   ```

   Copy the 32-character `id` returned by the command.

3. **Configure Local Secrets**:
   Copy the template to your local private config (this file is `.gitignore`d to prevent leaking IDs):

   ```bash
   cp wrangler.local.example.jsonc wrangler.local.jsonc
   ```

   Open `wrangler.local.jsonc` and paste your KV ID into `kv_namespaces[0].id`.

4. **Deploy**:

   ```bash
   pnpm run deploy
   ```

5. **Configure Environment Variables**:
   In the Cloudflare Dashboard (or via `wrangler secret put`):
   - `NUXT_SITE_TOKEN`: Administrator access token (at least 8 characters).
   - `NUXT_CF_ACCOUNT_ID` & `NUXT_CF_API_TOKEN`: (Optional) Required for Analytics Engine dashboard metrics.

6. **First Sign-in & Passkey Setup**:
   Visit `https://<your-worker-subdomain>.workers.dev/dashboard/login`, sign in using your `NUXT_SITE_TOKEN`, and navigate to **Settings → Security** to register your device Passkey (Touch ID, Face ID, or Windows Hello).

---

## 🏢 Multi-Tenant & Multi-Site Deployments

To deploy the same codebase to multiple independent Cloudflare accounts or domains:

1. Create a named config:
   ```bash
   cp wrangler.local.example.jsonc wrangler.<site-name>.local.jsonc
   ```
2. Set the `account_id`, `name`, and `kv_namespaces.id` in that file.
3. Deploy that specific site:
   ```bash
   pnpm run deploy <site-name>
   ```
4. Or deploy to all configured sites at once:
   ```bash
   pnpm run deploy all
   ```
