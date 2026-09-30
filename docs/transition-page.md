# 🧭 Transition Page & Tracking Integrations

The Transition Page is an intermediate landing screen shown to visitors before redirecting to the final target URL. It can be used for:

- Security warnings (e.g., "You are now leaving this site")
- Countdown timers and branded interstitial messaging
- Advertising or promotional copy
- Client-side tracking with Google Analytics 4, Meta Pixel, and LINE LIFF authentication

---

## ⚙️ Transition Page Modes

Access settings at `Dashboard -> Settings -> Transition Page`.

### Global Modes

- **Disabled**: Transition page is disabled by default across all links. Only links explicitly set to `on` will display it.
- **Default**: Does not force transition page globally. Links with `inherit` will redirect immediately.
- **Force All Links**: Every shortlink will display the transition page, overriding individual link settings.

### Per-Link Modes

Configurable in `Dashboard -> Links -> Edit Link`:

- `inherit`: Follows the global transition mode.
- `on`: Always display the transition page for this link.
- `off`: Never display the transition page (unless global mode is set to `Force All Links`).

---

## 🎨 Custom Content

Custom HTML or Markdown can be supplied at two levels:

1. **Individual Link HTML**: Set in the link editor.
2. **Global Transition Page Content**: Set in `Settings -> Transition Page`.
3. **Default System Fallback**: Standard clean countdown screen with a "Continue Now" button.

---

## 📊 Tracking Integrations

Transition pages support client-side tracking and analytics beacons:

- **Google Analytics 4 (GA4)**: Enter your `Measurement ID` (e.g., `G-XXXXXXXXXX`). Events fired:
  - `transition_view`: Visitor views the transition screen.
  - `redirect_auto`: Automatic redirect after countdown expires.
  - `redirect_now`: Visitor clicks "Redirect Now".
- **Meta Pixel**: Enter your `Pixel ID` (e.g., `123456789012345`). Fires custom `ShortlinkRedirect` event.
- **LINE LIFF ID & Channel ID**:
  - Integrate LINE Login / LIFF before redirection.
  - Requires `openid` and optional `profile` scopes in the LINE Developers Console.
  - Verified securely server-side via `https://api.line.me/oauth2/v2.1/verify`.
