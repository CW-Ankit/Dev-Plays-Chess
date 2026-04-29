import { createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import type { GenericCtx } from "@convex-dev/better-auth/utils";
import { checkout, dodopayments, portal, webhooks } from "@dodopayments/better-auth";
import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import DodoPayments from "dodopayments";

import { components } from "../_generated/api";
import type { DataModel } from "../_generated/dataModel";
import AuthConfig from "../auth.config";
import BetterAuthSchema from "./schema";

const DodoClient = process.env.DODO_PAYMENTS_API_KEY
  ? new DodoPayments({
      bearerToken: process.env.DODO_PAYMENTS_API_KEY,
      environment: process.env.DODO_ENVIRONMENT === "live_mode" ? "live_mode" : "test_mode"
    })
  : null;

const buildDodoPlugins = () => {
  if (!DodoClient || !process.env.DODO_DEFAULT_PRODUCT_ID) {
    return [];
  }

  return [
    dodopayments({
      client: DodoClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: process.env.DODO_DEFAULT_PRODUCT_ID,
              slug: "default-plan"
            }
          ],
          successUrl: "/payments/success",
          authenticatedUsersOnly: true
        }),
        portal(),
        ...(process.env.DODO_PAYMENTS_WEBHOOK_SECRET
          ? [
              webhooks({
                webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_SECRET,
                onPayload: async (payload) => {
                  console.info("Dodo webhook received", payload.event_type);
                }
              })
            ]
          : [])
      ]
    })
  ];
};

export const authComponent = createClient<DataModel, typeof BetterAuthSchema>(
  components.betterAuth,
  {
    local: { schema: BetterAuthSchema },
    verbose: false
  }
);

export const authOptions = {
  appName: "DevPlaysChess",
  baseURL: process.env.SITE_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true
  },
  trustedOrigins: process.env.SITE_URL ? [process.env.SITE_URL] : undefined,
  plugins: [convex({ authConfig: AuthConfig }), ...buildDodoPlugins()]
};

export const createAuthOptions = (ctx: GenericCtx<DataModel>): BetterAuthOptions => ({
  ...authOptions,
  database: authComponent.adapter(ctx)
});

export const options = authOptions;

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(createAuthOptions(ctx));
};
