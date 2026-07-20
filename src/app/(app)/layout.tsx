import { redirect } from "next/navigation";
import { getSessionState } from "@/lib/supabase/session";
import { AppNav } from "@/components/app-nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, businessId } = await getSessionState();
  if (!user) redirect("/login");
  if (!businessId) redirect("/onboarding");

  return (
    <div className="flex flex-1">
      <AppNav />
      <main className="flex flex-1 flex-col md:ml-64">{children}</main>
    </div>
  );
}
