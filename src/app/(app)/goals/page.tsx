import { createClient } from "@/lib/supabase/server";
import { getSessionState } from "@/lib/supabase/session";
import { GoalForm } from "./goal-form";
import { GoalCard } from "./goal-card";

export default async function GoalsPage() {
  const { businessId: id } = await getSessionState();
  const businessId = id as string; // guaranteed by (app)/layout.tsx
  const supabase = await createClient();

  const { data: goals } = await supabase
    .from("goals")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  const active = (goals ?? []).filter((g) => (g.status ?? "Active") === "Active");
  const achieved = (goals ?? []).filter((g) => g.status === "Achieved");

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 bg-zinc-50 px-6 py-10 dark:bg-black">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Goals</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          A structured, trackable version of a priority — set a target, a number, and a date, then
          come back and mark it achieved.
        </p>
      </div>

      <GoalForm />

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Active Goals ({active.length})
        </h2>
        {active.length === 0 ? (
          <p className="text-sm text-zinc-400 dark:text-zinc-600">No active goals.</p>
        ) : (
          active.map((g) => <GoalCard key={g.id} goal={g} />)
        )}
      </div>

      {achieved.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Achieved ({achieved.length})
          </h2>
          {achieved.map((g) => (
            <GoalCard key={g.id} goal={g} />
          ))}
        </div>
      )}
    </div>
  );
}
