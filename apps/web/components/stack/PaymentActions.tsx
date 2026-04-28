"use client";

import { useState } from "react";

import { authClient } from "@/lib/authClient";

import { Button } from "../ui/Button";

export const PaymentActions = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const StartCheckout = async () => {
    setErrorMessage(null);
    const { data, error } = await authClient.dodopayments.checkoutSession({
      slug: "default-plan"
    });

    if (error) {
      setErrorMessage(error.message ?? "Checkout session failed.");
      return;
    }

    if (data?.url) {
      window.location.href = data.url;
    }
  };

  const OpenPortal = async () => {
    setErrorMessage(null);
    const { data, error } = await authClient.dodopayments.customer.portal();

    if (error) {
      setErrorMessage(error.message ?? "Portal session failed.");
      return;
    }

    if (data?.url) {
      window.location.href = data.url;
    }
  };

  return (
    <section className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-3">
        <Button onClick={StartCheckout} variant="secondary">
          Start Dodo Checkout (Better Auth)
        </Button>
        <Button onClick={OpenPortal} variant="outline">
          Open Customer Portal
        </Button>
      </div>
      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
    </section>
  );
};
