import Link from "next/link";
import { AuthForm } from "../auth-form";
import { signUp } from "./actions";

export default function SignupPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Create your account</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Takes about a minute to get set up.
      </p>
      <div className="mt-6">
        <AuthForm
          action={signUp}
          submitLabel="Create account"
          pendingLabel="Creating account…"
          passwordAutoComplete="new-password"
          footer={
            <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-zinc-900 underline dark:text-zinc-50">
                Log in
              </Link>
            </p>
          }
        />
      </div>
    </>
  );
}
