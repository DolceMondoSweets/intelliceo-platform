"use client";

import { useState, useTransition } from "react";
import { completeOnboarding, type OnboardingInput } from "./actions";
import { Button, inputClass } from "@/components/ui";

const STEPS = ["business", "overview", "products", "priorities", "finance"] as const;

const initialValues: OnboardingInput = {
  businessName: "",
  overview: "",
  products: "",
  priorities: "",
  cash: "",
  burn: "",
  revenueMtd: "",
};

export function OnboardingWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<OnboardingInput>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const step = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;
  const canProceed = step !== "business" || values.businessName.trim().length > 0;

  function update<K extends keyof OnboardingInput>(key: K, value: OnboardingInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function goNext() {
    if (!canProceed) {
      setError("Enter your business name to continue.");
      return;
    }
    setError(null);
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function goBack() {
    setError(null);
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function handleSubmit() {
    if (!canProceed) {
      setError("Enter your business name to continue.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await completeOnboarding(values);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-1.5">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full ${
              i <= stepIndex ? "bg-zinc-900 dark:bg-zinc-50" : "bg-zinc-200 dark:bg-zinc-800"
            }`}
          />
        ))}
      </div>

      {step === "business" && (
        <Field label="What's your business called?">
          <input
            autoFocus
            value={values.businessName}
            onChange={(e) => update("businessName", e.target.value)}
            placeholder="e.g. Sunrise Café"
            className={inputClass}
          />
        </Field>
      )}

      {step === "overview" && (
        <Field
          label="Tell us about your business"
          hint="A sentence or two is plenty — you can add more later."
        >
          <textarea
            autoFocus
            value={values.overview}
            onChange={(e) => update("overview", e.target.value)}
            rows={4}
            placeholder="A neighborhood café serving coffee, pastries, and lunch."
            className={inputClass}
          />
        </Field>
      )}

      {step === "products" && (
        <Field label="What do you sell?" hint="List your main products or services.">
          <textarea
            autoFocus
            value={values.products}
            onChange={(e) => update("products", e.target.value)}
            rows={4}
            placeholder="Espresso drinks, pastries, sandwiches, catering."
            className={inputClass}
          />
        </Field>
      )}

      {step === "priorities" && (
        <Field
          label="What matters most right now?"
          hint="Growth, cash flow, hiring — whatever's top of mind."
        >
          <textarea
            autoFocus
            value={values.priorities}
            onChange={(e) => update("priorities", e.target.value)}
            rows={4}
            placeholder="Improve weekday lunch traffic and hire a second baker."
            className={inputClass}
          />
        </Field>
      )}

      {step === "finance" && (
        <div className="flex flex-col gap-4">
          <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
            Where do things stand financially?
          </p>
          <NumberField
            label="Cash on hand ($)"
            value={values.cash}
            onChange={(v) => update("cash", v)}
          />
          <NumberField
            label="Monthly burn ($)"
            value={values.burn}
            onChange={(v) => update("burn", v)}
          />
          <NumberField
            label="Revenue this month ($)"
            value={values.revenueMtd}
            onChange={(v) => update("revenueMtd", v)}
          />
        </div>
      )}

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="flex gap-3">
        {stepIndex > 0 && (
          <Button type="button" variant="secondary" onClick={goBack} disabled={isPending} className="flex-1">
            Back
          </Button>
        )}
        <Button
          type="button"
          onClick={isLastStep ? handleSubmit : goNext}
          disabled={isPending}
          className="flex-1"
        >
          {isPending ? "Saving…" : isLastStep ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-lg font-medium text-zinc-900 dark:text-zinc-50">{label}</label>
      {hint && <p className="text-sm text-zinc-500 dark:text-zinc-400">{hint}</p>}
      {children}
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</label>
      <input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className={inputClass}
      />
    </div>
  );
}
