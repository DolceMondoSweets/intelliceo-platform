import { redirect } from "next/navigation";
import { getSessionState } from "@/lib/supabase/session";
import { classifySubscription } from "@/lib/subscription";
import { createClient } from "@/lib/supabase/server";
import { getBusinessBrand } from "@/lib/business-brand";
import { AppNav } from "@/components/app-nav";
import { AskBar } from "@/components/ask-bar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, businessId, subscriptionStatus } = await getSessionState();
  if (!user) redirect("/login");
  if (!businessId) redirect("/onboarding");

  const subscriptionState = classifySubscription(subscriptionStatus);
  if (subscriptionState === "never_started") redirect("/onboarding/plan");
  if (subscriptionState === "inactive") redirect("/reactivate");

  const supabase = await createClient();
  const brand = await getBusinessBrand(supabase, businessId);

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <AppNav businessName={brand.name} logoUrl={brand.logoUrl} />
      <main className="flex flex-1 flex-col md:ml-64">
        <AskBar />
        {children}
      </main>
    </div>
  );
}
