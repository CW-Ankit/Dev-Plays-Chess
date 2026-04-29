import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    body: v.string(),
    createdAt: v.number()
  }).index("by_createdAt", ["createdAt"]),
  user: defineTable({
    name: v.string(),
    email: v.string(),
    emailVerified: v.boolean(),
    image: v.optional(v.string()),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  }).index("by_email", ["email"]),
  session: defineTable({
    expiresAt: v.float64(),
    token: v.string(),
    createdAt: v.float64(),
    updatedAt: v.float64(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    userId: v.string(),
  }).index("by_token", ["token"]),
  account: defineTable({
    accountId: v.string(),
    providerId: v.string(),
    userId: v.string(),
    accessToken: v.optional(v.string()),
    refreshToken: v.optional(v.string()),
    idToken: v.optional(v.string()),
    accessTokenExpiresAt: v.optional(v.float64()),
    refreshTokenExpiresAt: v.optional(v.float64()),
    scope: v.optional(v.string()),
    password: v.optional(v.string()),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  }).index("by_accountId", ["accountId"]),
  verification: defineTable({
    identifier: v.string(),
    value: v.string(),
    expiresAt: v.float64(),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  }).index("by_identifier", ["identifier"]),
});
