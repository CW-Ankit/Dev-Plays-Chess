import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/authServer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/login");
  }

  return <>{children}</>;
}
