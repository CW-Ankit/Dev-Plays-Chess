import { createApi } from "@convex-dev/better-auth";

import { adapterOptions } from "./auth";
import BetterAuthSchema from "./schema";

export const { create, findOne, findMany, updateOne, updateMany, deleteOne, deleteMany } =
  createApi(BetterAuthSchema, adapterOptions);
