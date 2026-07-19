import { createClient } from "@/lib/supabase/server";
import { getSessionState } from "@/lib/supabase/session";
import { DecisionForm } from "./decision-form";
import { DecisionCard } from "./decision-card";

export default async function DecisionsPage() {
  const { businessId: id } = await getSessionState();
  const businessId = id as string; // guaranteed by (app)/layout.tsx
  const supabase = await createClient();

  const { data: decisions } = await supabase
    .from("decisions")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  const open = (decisions ?? []).filter((d) => (d.status ?? "Open") === "Open");
  const closed = (decisions ?? []).filter((d) => d.status === "Closed");

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 bg-zinc-50 px-6 py-10 dark:bg-black">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Decisions Log</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Executive memory: log the decision, then come back later and close the loop on what
          actually happened.
        </p>
      </div>

      <DecisionForm />

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Open Decisions ({open.length})
        </h2>
        {open.length === 0 ? (
          <p className="text-sm text-zinc-400 dark:text-zinc-600">No open decisions.</p>
        ) : (
          open.map((d) => <DecisionCard key={d.id} decision={d} />)
        )}
      </div>

      {closed.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Closed Decisions ({closed.length})
          </h2>
          {closed.map((d) => (
            <DecisionCard key={d.id} decision={d} />
          ))}
        </div>
      )}
    </div>
  );
}
