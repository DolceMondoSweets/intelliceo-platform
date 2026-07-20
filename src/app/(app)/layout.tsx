import { redirect } from "next/navigation";
import { getSessionState } from "@/lib/supabase/session";
import { classifySubscription } from "@/lib/subscription";
import { AppNav } from "@/components/app-nav";
import { AskBar } from "@/components/ask-bar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, businessId, subscriptionStatus } = await getSessionState();
  if (!user) redirect("/login");
  if (!businessId) redirect("/onboarding");

  const subscriptionState = classifySubscription(subscriptionStatus);
  if (subscriptionState === "never_started") redirect("/onboarding/plan");
  if (subscriptionState === "inactive") redirect("/reactivate");

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <AppNav />
      <main className="flex flex-1 flex-col md:ml-64">
        <AskBar />
        {children}
      </main>
    </div>
  );
}
