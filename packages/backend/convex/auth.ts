import { query } from "./_generated/server";
import { findOne } from "./betterAuth/adapter";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // identity.subject is the user's ID in Better Auth
    return await findOne({
      table: "user",
      filter: {
        id: identity.subject,
      },
    });
  },
});
