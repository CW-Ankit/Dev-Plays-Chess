import Link from "next/link";

import { PaymentActions } from "@/components/stack/PaymentActions";
import { StackStatus } from "@/components/stack/StackStatus";
import { Button } from "@/components/ui/Button";

const HomePage = () => {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-16">
      <h1 className="text-4xl font-semibold">Fast Tech Stack</h1>
      <p className="text-zinc-600">
        Monorepo starter with Next.js, Expo, Convex, Better Auth, Tailwind, shadcn/ui, and Dodo Payments.
      </p>

      <StackStatus
        ConvexUrl={process.env.NEXT_PUBLIC_CONVEX_URL}
        ConvexSiteUrl={process.env.NEXT_PUBLIC_CONVEX_SITE_URL}
        DodoProductId={process.env.DODO_DEFAULT_PRODUCT_ID}
      />

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/api/auth/sign-in">Sign In with Better Auth</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/api/stack/status">Open Stack Status API</Link>
        </Button>
      </div>

      <PaymentActions />

      <p className="text-sm text-zinc-500">
        Legacy fallback route remains available at `/api/payments/checkout`, but Better Auth Dodo plugin flow is preferred.
      </p>
    </main>
  );
};

export default HomePage;
