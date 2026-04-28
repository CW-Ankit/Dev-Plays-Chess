import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { dodopaymentsClient } from "@dodopayments/better-auth";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [convexClient(), dodopaymentsClient()]
});
