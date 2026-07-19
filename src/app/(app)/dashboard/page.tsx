import { createClient } from "@/lib/supabase/server";
import { getSessionState } from "@/lib/supabase/session";
import { Button } from "@/components/ui";
import { signOut } from "./actions";

export default async function DashboardPage() {
  const { businessId: id } = await getSessionState();
  const businessId = id as string; // guaranteed by (app)/layout.tsx
  const supabase = await createClient();

  const [{ data: business }, { data: kbEntries }, { data: finance }] = await Promise.all([
    supabase.from("businesses").select("name, industry").eq("id", businessId).single(),
    supabase.from("knowledge_base_entries").select("category, content").eq("business_id", businessId),
    supabase.from("finance_data").select("*").eq("business_id", businessId).maybeSingle(),
  ]);

  const kbByCategory = Object.fromEntries(
    (kbEntries ?? []).map((entry) => [entry.category, entry.content])
  );

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 bg-zinc-50 px-6 py-10 dark:bg-black">
      <div>
        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
          Onboarding complete
        </p>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          {business?.name ?? "Your business"}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{business?.industry}</p>
      </div>

      <Section title="Business overview" content={kbByCategory.business_overview} />
      <Section title="Products" content={kbByCategory.products} />
      <Section title="Priorities" content={kbByCategory.priorities} />

      <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Finance snapshot</h2>
        <dl className="mt-2 grid grid-cols-2 gap-3">
          <Stat label="Cash" value={finance?.cash} prefix="$" />
          <Stat label="Monthly burn" value={finance?.burn} prefix="$" />
          <Stat label="Runway" value={finance?.runway} suffix=" mo" />
          <Stat label="Revenue MTD" value={finance?.revenue_mtd} prefix="$" />
        </dl>
      </div>

      <form action={signOut}>
        <Button type="submit" variant="secondary" className="w-full">
          Log out
        </Button>
      </form>
    </div>
  );
}

function Section({ title, content }: { title: string; content?: string | null }) {
  return (
    <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
      <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</h2>
      <p className="mt-1 text-base text-zinc-900 dark:text-zinc-50">
        {content ?? <span className="text-zinc-400 dark:text-zinc-600">Not provided</span>}
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  prefix,
  suffix,
}: {
  label: string;
  value?: number | null;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div>
      <dt className="text-xs text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {prefix}
        {value ?? 0}
        {suffix}
      </dd>
    </div>
  );
}
