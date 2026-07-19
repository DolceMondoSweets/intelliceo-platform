import Link from "next/link";
import { AuthForm } from "../auth-form";
import { logIn } from "./actions";

export default function LoginPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Log in</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Welcome back to IntelliCEO.</p>
      <div className="mt-6">
        <AuthForm
          action={logIn}
          submitLabel="Log in"
          pendingLabel="Logging in…"
          passwordAutoComplete="current-password"
          footer={
            <div className="mt-2 flex flex-col items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <Link href="/forgot-password" className="font-medium text-zinc-900 underline dark:text-zinc-50">
                Forgot password?
              </Link>
              <p>
                New here?{" "}
                <Link href="/signup" className="font-medium text-zinc-900 underline dark:text-zinc-50">
                  Create an account
                </Link>
              </p>
            </div>
          }
        />
      </div>
    </>
  );
}
