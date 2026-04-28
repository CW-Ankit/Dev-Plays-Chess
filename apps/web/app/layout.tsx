import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { getToken } from "@/lib/authServer";

export const metadata: Metadata = {
  title: "Fast Tech Stack",
  description: "Turborepo template with Next.js, Expo, Convex, Better Auth, and Dodo Payments"
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

const RootLayout = async ({ children }: RootLayoutProps) => {
  const token = await getToken();

  return (
    <html lang="en">
      <body>
        <ConvexClientProvider initialToken={token}>{children}</ConvexClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
