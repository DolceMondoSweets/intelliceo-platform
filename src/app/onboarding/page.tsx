import { redirect } from "next/navigation";
import { getSessionState } from "@/lib/supabase/session";
import { OnboardingWizard } from "./onboarding-wizard";

export default async function OnboardingPage() {
  const { user, businessId } = await getSessionState();
  if (!user) redirect("/login");
  if (businessId) redirect("/dashboard");

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-10 dark:bg-black">
      <div className="w-full max-w-md">
        <OnboardingWizard />
      </div>
    </div>
  );
}
