# Better Auth Usage & Reference

## Authentication Flows (Client Side)

### Sign Up & Sign In
Use the `authClient` to perform auth actions:
- **Email/Password:** `authClient.signUp.email({ email, password, name })` and `authClient.signIn.email({ email, password })`.
- **Social:** `authClient.signIn.social({ provider: "github", callbackURL: "/dashboard" })`.
- **Sign Out:** `await authClient.signOut()`.

### Session Management
- **Hook:** `const { data: session, isPending, error } = authClient.useSession();`
- **Direct Call:** `const { data: session } = await authClient.getSession();`

## User & Account Management

### Updating User Info
- **General Info:** `await authClient.updateUser({ name: "New Name", image: "..." })`.
- **Changing Email:** Enable `user.changeEmail.enabled: true` in config. Use `authClient.changeEmail({ newEmail: "..." })`.
- **Changing Password:** Use `authClient.changePassword({ newPassword, currentPassword, revokeOtherSessions: true })`.

### Account Deletion
Enable `user.deleteUser.enabled: true`.
- **Method:** `await authClient.deleteUser({ password: "..." })` or rely on fresh session/email verification.

### Account Linking
- **Social Linking:** `await authClient.linkSocial({ provider: "google" })`.
- **Unlinking:** `await authClient.unlinkAccount({ providerId: "google" })`.

## Email Verification & Password Reset

### Email Verification
Enable `emailVerification.sendVerificationEmail` in config.
- **Automatic:** Set `sendOnSignUp: true`.
- **Required:** Set `emailAndPassword.requireEmailVerification: true`.
- **Manual:** `await authClient.sendVerificationEmail({ email })`.

### Password Reset
Implement `emailAndPassword.sendResetPassword` in config. This sends a link that allows the user to reset their password.

## OAuth Details
- **Additional Scopes:** Request more permissions via `authClient.linkSocial({ provider, scopes: [...] })`.
- **Additional Data:** Pass `additionalData` during sign-in/linking to track referrals/sources. Access this in hooks via `getOAuthState()`.
- **Emailless Providers:** Use `mapProfileToUser` to synthesize placeholder emails for providers that don't return one (e.g., `${profile.id}@discord.placeholder.local`).
