import { NextResponse } from "next/server";

const RequiredKeys = {
  NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
  NEXT_PUBLIC_CONVEX_SITE_URL: process.env.NEXT_PUBLIC_CONVEX_SITE_URL,
  DODO_PAYMENTS_API_KEY: process.env.DODO_PAYMENTS_API_KEY,
  DODO_DEFAULT_PRODUCT_ID: process.env.DODO_DEFAULT_PRODUCT_ID
};

export const GET = async () => {
  return NextResponse.json({
    stack: {
      web: "ready",
      auth: "configured-via-convex",
      payments: "configured-via-dodo"
    },
    environment: {
      NEXT_PUBLIC_CONVEX_URL: Boolean(RequiredKeys.NEXT_PUBLIC_CONVEX_URL),
      NEXT_PUBLIC_CONVEX_SITE_URL: Boolean(RequiredKeys.NEXT_PUBLIC_CONVEX_SITE_URL),
      DODO_PAYMENTS_API_KEY: Boolean(RequiredKeys.DODO_PAYMENTS_API_KEY),
      DODO_DEFAULT_PRODUCT_ID: Boolean(RequiredKeys.DODO_DEFAULT_PRODUCT_ID)
    }
  });
};
