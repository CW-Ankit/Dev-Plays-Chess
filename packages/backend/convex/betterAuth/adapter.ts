import { createApi } from "@convex-dev/better-auth";

import { createAuthOptions } from "./auth";
import BetterAuthSchema from "./schema";

export const {
  create,
  findOne,
  findMany,
  updateOne,
  updateMany,
  deleteOne,
  deleteMany
} = createApi(BetterAuthSchema, createAuthOptions);
