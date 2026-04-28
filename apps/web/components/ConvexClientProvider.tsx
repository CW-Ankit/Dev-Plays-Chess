"use client";

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

import { authClient } from "@/lib/authClient";

const ConvexClient = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

type ConvexClientProviderProps = {
  children: ReactNode;
  initialToken?: string | null;
};

export const ConvexClientProvider = ({
  children,
  initialToken
}: ConvexClientProviderProps) => {
  return (
    <ConvexBetterAuthProvider
      client={ConvexClient}
      authClient={authClient}
      initialToken={initialToken}
    >
      {children}
    </ConvexBetterAuthProvider>
  );
};
