import Link from "next/link";

import { Button } from "@/components/ui/Button";

const PaymentSuccessPage = () => {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-start justify-center gap-4 px-6 py-16">
      <h1 className="text-3xl font-semibold">Payment Completed</h1>
      <p className="text-zinc-600">
        Dodo Payments redirected successfully. Review subscription and payment state in your Better Auth customer APIs.
      </p>
      <Button asChild>
        <Link href="/">Return to Home</Link>
      </Button>
    </main>
  );
};

export default PaymentSuccessPage;
