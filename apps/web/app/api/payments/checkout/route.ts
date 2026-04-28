import DodoPayments from "dodopayments";
import { NextResponse } from "next/server";

const DodoClient = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  environment: process.env.DODO_ENVIRONMENT === "live_mode" ? "live_mode" : "test_mode"
});

export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url);
  const productId = searchParams.get("productId") ?? process.env.DODO_DEFAULT_PRODUCT_ID;

  if (!productId) {
    return NextResponse.json(
      { error: "Missing productId query parameter and DODO_DEFAULT_PRODUCT_ID." },
      { status: 400 }
    );
  }

  try {
    const checkoutSession = await DodoClient.checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      return_url: `${origin}/payments/return`
    });

    return NextResponse.redirect(checkoutSession.url);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
};
