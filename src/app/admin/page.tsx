import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionState } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";

const INACTIVITY_THRESHOLD_DAYS = 7;

function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const diffMs = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export default async function AdminPage() {
  const { user, isPlatformAdmin } = await getSessionState();
  if (!user) redirect("/login");
  if (!isPlatformAdmin) redirect("/dashboard");

  const supabase = await createClient();

  const [{ data: businesses }, { data: profiles }, { data: decisions }, { data: briefs }, { data: posCreds }] =
    await Promise.all([
      supabase
        .from("businesses")
        .select("id, name, industry, subscription_tier, created_at")
        .order("created_at", { ascending: false }),
      supabase.from("profiles").select("business_id, last_login_at"),
      supabase.from("decisions").select("business_id, status"),
      supabase.from("brief_history").select("business_id, brief_date"),
      supabase.from("pos_credentials").select("business_id, last_synced_at"),
    ]);

  const lastLoginByBusiness = new Map<string, string>();
  for (const p of profiles ?? []) {
    if (!p.business_id || !p.last_login_at) continue;
    const current = lastLoginByBusiness.get(p.business_id);
    if (!current || p.last_login_at > current) lastLoginByBusiness.set(p.business_id, p.last_login_at);
  }

  const openDecisionsByBusiness = new Map<string, number>();
  for (const d of decisions ?? []) {
    if (!d.business_id || d.status !== "Open") continue;
    openDecisionsByBusiness.set(d.business_id, (openDecisionsByBusiness.get(d.business_id) ?? 0) + 1);
  }

  const lastBriefByBusiness = new Map<string, string>();
  for (const b of briefs ?? []) {
    if (!b.business_id) continue;
    const current = lastBriefByBusiness.get(b.business_id);
    if (!current || b.brief_date > current) lastBriefByBusiness.set(b.business_id, b.brief_date);
  }

  const lastSyncByBusiness = new Map<string, string>();
  for (const s of posCreds ?? []) {
    if (!s.business_id || !s.last_synced_at) continue;
    lastSyncByBusiness.set(s.business_id, s.last_synced_at);
  }

  const rows = (businesses ?? []).map((b) => {
    const lastLogin = lastLoginByBusiness.get(b.id) ?? null;
    const daysInactive = daysSince(lastLogin);
    return {
      id: b.id,
      name: b.name,
      tier: b.subscription_tier ?? "starter",
      signupDate: b.created_at,
      lastLogin,
      daysInactive,
      isInactive: daysInactive === null || daysInactive >= INACTIVITY_THRESHOLD_DAYS,
      lastBrief: lastBriefByBusiness.get(b.id) ?? null,
      lastPosSync: lastSyncByBusiness.get(b.id) ?? null,
      openDecisions: openDecisionsByBusiness.get(b.id) ?? 0,
    };
  });

  const recentSignups = rows.slice(0, 5);
  const inactiveBusinesses = rows.filter((r) => r.isInactive);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 bg-zinc-50 px-6 py-10 dark:bg-black">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Platform Admin</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {rows.length} business{rows.length === 1 ? "" : "es"} on the platform.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-zinc-600 underline dark:text-zinc-400"
        >
          Back to Dashboard
        </Link>
      </div>

      {inactiveBusinesses.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            ⚠️ No activity in {INACTIVITY_THRESHOLD_DAYS}+ days
          </h2>
          {inactiveBusinesses.map((b) => (
            <div
              key={b.id}
              className="rounded-lg border-l-4 border-amber-400 bg-amber-50 px-4 py-2 text-sm text-zinc-800 dark:bg-amber-950/30 dark:text-zinc-200"
            >
              <span className="font-medium">{b.name}</span> —{" "}
              {b.lastLogin
                ? `last login ${b.daysInactive} day${b.daysInactive === 1 ? "" : "s"} ago`
                : "never logged in since onboarding"}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Recent signups</h2>
        {recentSignups.length === 0 ? (
          <p className="text-sm text-zinc-400 dark:text-zinc-600">No businesses yet.</p>
        ) : (
          recentSignups.map((b) => (
            <div
              key={b.id}
              className="rounded-lg bg-zinc-100 px-4 py-2 text-sm text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            >
              <span className="font-medium">{b.name}</span> — signed up{" "}
              {b.signupDate ? new Date(b.signupDate).toLocaleDateString() : "unknown"}
            </div>
          ))
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">Signup Date</th>
              <th className="px-4 py-3">Tier</th>
              <th className="px-4 py-3">Last Login</th>
              <th className="px-4 py-3">Last Brief</th>
              <th className="px-4 py-3">Last POS Sync</th>
              <th className="px-4 py-3">Open Decisions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-zinc-400 dark:text-zinc-600">
                  No businesses yet.
                </td>
              </tr>
            )}
            {rows.map((b) => (
              <tr
                key={b.id}
                className={`border-b border-zinc-100 last:border-0 dark:border-zinc-900 ${
                  b.isInactive ? "bg-amber-50/50 dark:bg-amber-950/10" : ""
                }`}
              >
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">{b.name}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {b.signupDate ? new Date(b.signupDate).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{b.tier}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {b.lastLogin ? new Date(b.lastLogin).toLocaleDateString() : "Never"}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {b.lastBrief ? new Date(b.lastBrief).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {b.lastPosSync ? new Date(b.lastPosSync).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{b.openDecisions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
