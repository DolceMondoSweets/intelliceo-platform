"use client";

import { useRef, useState, useTransition } from "react";
import { Button, inputClass } from "@/components/ui";
import {
  updateBusinessName,
  updateKnowledgeBase,
  updateFinanceSnapshot,
  uploadBusinessLogo,
  signOut,
} from "./actions";

export function SettingsClient({
  businessName: initialBusinessName,
  logoUrl,
  overview: initialOverview,
  products: initialProducts,
  priorities: initialPriorities,
  cash: initialCash,
  burn: initialBurn,
  monthlyCogs: initialMonthlyCogs,
  monthlyLaborCost: initialMonthlyLaborCost,
  isPlatformAdmin,
}: {
  businessName: string;
  logoUrl: string | null;
  overview: string;
  products: string;
  priorities: string;
  cash: number;
  burn: number;
  monthlyCogs: number | null;
  monthlyLaborCost: number | null;
  isPlatformAdmin: boolean;
}) {
  const [businessName, setBusinessName] = useState(initialBusinessName);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSaved, setNameSaved] = useState(false);
  const [isSavingName, startNameTransition] = useTransition();

  function handleSaveName() {
    setNameError(null);
    setNameSaved(false);
    startNameTransition(async () => {
      const result = await updateBusinessName(businessName);
      if (result.error) setNameError(result.error);
      else setNameSaved(true);
    });
  }

  const [logoPreview, setLogoPreview] = useState<string | null>(logoUrl);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [logoSaved, setLogoSaved] = useState(false);
  const [isSavingLogo, startLogoTransition] = useTransition();
  const logoInputRef = useRef<HTMLInputElement>(null);

  function handleLogoChange() {
    const file = logoInputRef.current?.files?.[0];
    if (!file) return;

    setLogoError(null);
    setLogoSaved(false);
    const objectUrl = URL.createObjectURL(file);
    setLogoPreview(objectUrl);

    startLogoTransition(async () => {
      const formData = new FormData();
      formData.set("logo", file);
      const result = await uploadBusinessLogo(formData);
      if (result.error) setLogoError(result.error);
      else setLogoSaved(true);
    });
  }

  const [overview, setOverview] = useState(initialOverview);
  const [products, setProducts] = useState(initialProducts);
  const [priorities, setPriorities] = useState(initialPriorities);
  const [kbError, setKbError] = useState<string | null>(null);
  const [kbSaved, setKbSaved] = useState(false);
  const [isSavingKb, startKbTransition] = useTransition();

  function handleSaveKb() {
    setKbError(null);
    setKbSaved(false);
    startKbTransition(async () => {
      const result = await updateKnowledgeBase({ overview, products, priorities });
      if (result.error) setKbError(result.error);
      else setKbSaved(true);
    });
  }

  const [cash, setCash] = useState(String(initialCash));
  const [burn, setBurn] = useState(String(initialBurn));
  const [monthlyCogs, setMonthlyCogs] = useState(
    initialMonthlyCogs !== null ? String(initialMonthlyCogs) : ""
  );
  const [monthlyLaborCost, setMonthlyLaborCost] = useState(
    initialMonthlyLaborCost !== null ? String(initialMonthlyLaborCost) : ""
  );
  const [financeError, setFinanceError] = useState<string | null>(null);
  const [financeSaved, setFinanceSaved] = useState(false);
  const [isSavingFinance, startFinanceTransition] = useTransition();

  function handleSaveFinance() {
    setFinanceError(null);
    setFinanceSaved(false);
    startFinanceTransition(async () => {
      const result = await updateFinanceSnapshot({ cash, burn, monthlyCogs, monthlyLaborCost });
      if (result.error) setFinanceError(result.error);
      else setFinanceSaved(true);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Business name</h2>
        <input
          value={businessName}
          onChange={(e) => {
            setBusinessName(e.target.value);
            setNameSaved(false);
          }}
          className={inputClass}
        />
        {nameError && <p className="text-sm text-red-600 dark:text-red-400">{nameError}</p>}
        <Button type="button" onClick={handleSaveName} disabled={isSavingName} className="self-start">
          {isSavingName ? "Saving…" : nameSaved ? "Saved ✓" : "Save Business Name"}
        </Button>

        <div className="mt-2 flex items-center gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-900">
          {logoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoPreview}
              alt="Business logo"
              className="h-12 w-12 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 text-xs text-zinc-400 dark:bg-zinc-900 dark:text-zinc-600">
              No logo
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleLogoChange}
              className="text-sm text-zinc-600 file:mr-3 file:rounded-full file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white dark:text-zinc-400 dark:file:bg-zinc-50 dark:file:text-zinc-900"
            />
            <p className="text-xs text-zinc-400 dark:text-zinc-600">
              PNG, JPEG, or WebP, up to 2MB.
              {isSavingLogo && " Uploading…"}
              {!isSavingLogo && logoSaved && " Saved ✓"}
            </p>
            {logoError && <p className="text-sm text-red-600 dark:text-red-400">{logoError}</p>}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Business info</h2>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Business overview
          </label>
          <textarea
            value={overview}
            onChange={(e) => {
              setOverview(e.target.value);
              setKbSaved(false);
            }}
            rows={3}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Products</label>
          <textarea
            value={products}
            onChange={(e) => {
              setProducts(e.target.value);
              setKbSaved(false);
            }}
            rows={3}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Priorities</label>
          <textarea
            value={priorities}
            onChange={(e) => {
              setPriorities(e.target.value);
              setKbSaved(false);
            }}
            rows={3}
            className={inputClass}
          />
        </div>
        {kbError && <p className="text-sm text-red-600 dark:text-red-400">{kbError}</p>}
        <Button type="button" onClick={handleSaveKb} disabled={isSavingKb} className="self-start">
          {isSavingKb ? "Saving…" : kbSaved ? "Saved ✓" : "Save Business Info"}
        </Button>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Starting finance snapshot
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Correct your initial numbers here. Ongoing revenue updates happen via Square
          Integration or the Dashboard.
        </p>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Cash on hand ($)
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={cash}
            onChange={(e) => {
              setCash(e.target.value);
              setFinanceSaved(false);
            }}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Monthly burn ($)
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={burn}
            onChange={(e) => {
              setBurn(e.target.value);
              setFinanceSaved(false);
            }}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Ingredient/supply cost this month ($)
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={monthlyCogs}
            onChange={(e) => {
              setMonthlyCogs(e.target.value);
              setFinanceSaved(false);
            }}
            placeholder="Not yet tracked"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Labor cost this month ($)
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={monthlyLaborCost}
            onChange={(e) => {
              setMonthlyLaborCost(e.target.value);
              setFinanceSaved(false);
            }}
            placeholder="Not yet tracked"
            className={inputClass}
          />
        </div>
        {financeError && <p className="text-sm text-red-600 dark:text-red-400">{financeError}</p>}
        <Button
          type="button"
          onClick={handleSaveFinance}
          disabled={isSavingFinance}
          className="self-start"
        >
          {isSavingFinance ? "Saving…" : financeSaved ? "Saved ✓" : "Save Finance Snapshot"}
        </Button>
      </section>

      {isPlatformAdmin && (
        <section className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Diagnostics</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Throws a real error from a click handler, to confirm Sentry is receiving events.
          </p>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              throw new Error("test");
            }}
            className="self-start"
          >
            Trigger Test Error
          </Button>
        </section>
      )}

      <form action={signOut} className="mt-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <Button type="submit" variant="secondary" className="w-full">
          Log out
        </Button>
      </form>
    </div>
  );
}
