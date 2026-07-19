"use client";

import { useActionState } from "react";
import { Button, inputClass } from "@/components/ui";

export type AuthState = { error?: string; message?: string };

export function AuthForm({
  action,
  submitLabel,
  pendingLabel,
  passwordAutoComplete = "current-password",
  footer,
}: {
  action: (prevState: AuthState, formData: FormData) => Promise<AuthState>;
  submitLabel: string;
  pendingLabel: string;
  passwordAutoComplete?: "current-password" | "new-password";
  footer: React.ReactNode;
}) {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(action, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete={passwordAutoComplete}
          className={inputClass}
        />
      </div>

      {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}
      {state.message && (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">{state.message}</p>
      )}

      <Button type="submit" disabled={isPending} className="mt-2">
        {isPending ? pendingLabel : submitLabel}
      </Button>

      {footer}
    </form>
  );
}
