# Better Auth Infrastructure

Better Auth Infrastructure is a paid service that provides a management dashboard, security protections, and transactional messaging. It is integrated via the `@better-auth/infra` package.

## 1. The Dashboard Plugin (`dash`)
The `dash()` plugin connects the auth instance to the infrastructure API for management and analytics.

- **Setup:** Add `dash({ apiKey: process.env.BETTER_AUTH_API_KEY })` to the `plugins` array.
- **Features:**
  - **User Management:** Search, ban, and delete users via the web dashboard.
  - **Session Monitoring:** View and revoke active sessions.
  - **Analytics:** Track sign-ups, sign-ins, and active users.
  - **Activity Tracking:** Automatically updates `lastActiveAt` on the user record (requires schema update).
- **Client Integration:** Use `dashClient()` in the `authClient` plugins to access audit logs programmatically (e.g., `authClient.dash.getAuditLogs`).

## 2. The Sentinel Plugin (`sentinel`)
The `sentinel()` plugin provides enterprise-grade abuse protection and security checks.

### Security Features
| Feature | Description | Action Options |
| :--- | :--- | :--- |
| **Credential Stuffing** | Tracks failed logins per visitor to block bot attacks. | `log`, `challenge`, `block` |
| **Impossible Travel** | Detects logins from geographically distant locations in short timeframes. | `log`, `challenge`, `block` |
| **Bot Blocking** | Detects and blocks automated bot traffic. | `log`, `challenge`, `block` |
| **Free Trial Abuse** | Prevents multiple account creation per device fingerprint. | `log`, `challenge`, `block` |
| **Compromised Passwords** | Checks passwords against leaked databases (HaveIBeenPwned). | `log`, `challenge`, `block` |
| **Stale Accounts** | Monitors reactivation of dormant accounts. | `log`, `challenge`, `block` |
| **Geo-Blocking** | Allow/Deny lists based on ISO country codes. | `challenge`, `block` |
| **Velocity Limits** | Strict rate limits for sign-ups and password resets. | `log`, `challenge`, `block` |
| **Email Validation** | Blocks disposable emails and validates MX records. | `log`, `challenge`, `block` |

### Proof-of-Work (PoW) Challenges
When an action is set to `challenge`, Sentinel issues a cryptographic challenge.
- **Client-Side:** The `sentinelClient({ autoSolveChallenge: true })` automatically solves the PoW and sends the solution in the `X-PoW-Solution` header.
- **Difficulty:** Configurable via `challengeDifficulty` (higher = more computation).

## 3. Native & Expo Integration
For mobile apps, use `@better-auth/infra/native`:
- **Plugins:** Use `dashClient()` and `sentinelNativeClient()`.
- **Expo Requirements:** Install `expo-constants`, `expo-device`, and `expo-crypto` for richer identity payloads.
- **Storage:** Use `expo-secure-store` for persistent visitor IDs.

## 4. Best Practices
1. **Start with `log`:** Set security actions to "log" first to baseline traffic before switching to "challenge" or "block".
2. **Tune Thresholds:** Monitor false positives in the Security dashboard and adjust thresholds.
3. **Use Challenges:** Favor `challenge` over `block` to allow legitimate users through while stopping bots.
4. **Enable Auto-Solve:** Always enable `autoSolveChallenge` on the client to ensure a seamless user experience.
