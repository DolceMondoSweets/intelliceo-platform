"use client";

import { useActionState } from "react";
import { Button, inputClass } from "@/components/ui";
import { updatePassword, type ResetPasswordState } from "./actions";

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState<ResetPasswordState, FormData>(
    updatePassword,
    {}
  );

  return (
    <>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Set a new password</h1>
      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            New password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className={inputClass}
          />
        </div>

        {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}

        <Button type="submit" disabled={isPending} className="mt-2">
          {isPending ? "Saving…" : "Update password"}
        </Button>
      </form>
    </>
  );
}
