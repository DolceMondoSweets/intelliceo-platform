"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, inputClass } from "@/components/ui";
import { requestPasswordReset, type ForgotPasswordState } from "./actions";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState<ForgotPasswordState, FormData>(
    requestPasswordReset,
    {}
  );

  return (
    <>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Reset your password</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        We'll email you a link to set a new one.
      </p>
      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </div>

        {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}
        {state.message && (
          <p className="text-sm text-emerald-600 dark:text-emerald-400">{state.message}</p>
        )}

        <Button type="submit" disabled={isPending} className="mt-2">
          {isPending ? "Sending…" : "Send reset link"}
        </Button>

        <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/login" className="font-medium text-zinc-900 underline dark:text-zinc-50">
            Back to log in
          </Link>
        </p>
      </form>
    </>
  );
}
