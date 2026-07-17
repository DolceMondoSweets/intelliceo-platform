import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { error } = await supabase.from("businesses").select("id").limit(1);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 px-6 font-sans dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">IntelliCEO</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {error
          ? `Supabase connection error: ${error.message}`
          : "Connected to Supabase — schema live, RLS enforced."}
      </p>
    </div>
  );
}
