import { redirect } from "next/navigation";
import { getSessionState } from "@/lib/supabase/session";

export default async function Home() {
  const { user, businessId } = await getSessionState();
  if (!user) redirect("/login");
  redirect(businessId ? "/dashboard" : "/onboarding");
}
