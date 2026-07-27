import { Check, Minus } from "lucide-react";
import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { sectionHeadline } from "@/components/marketing/ui/typography";
import { differentiationColumns, differentiationRows } from "@/content/homepage";

function Cell({ value }: { value: boolean | "partial" }) {
  if (value === true) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-mkt-success-bg text-mkt-success">
        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
      </span>
    );
  }
  if (value === "partial") {
    return <span className="text-xs font-medium text-mkt-text-muted">Partial</span>;
  }
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center text-mkt-text-muted/60">
      <Minus className="h-3.5 w-3.5" strokeWidth={2} />
    </span>
  );
}

// Section 10 (Differentiation) — table structure/tone as originally
// specified; row list is drafted except for the one corrected row
// ("Remembers your business and past conversations"), which replaces an
// open-ended "long-term business memory" claim with the accurate scope.
export function Differentiation() {
  return (
    <section className="bg-mkt-bg-secondary py-[5.5rem] md:py-40">
      <Container>
        <Reveal>
          <ProseWidth>
            <h2 className={`${sectionHeadline} text-mkt-text-primary`}>
              Built for owners, not accountants.
            </h2>
          </ProseWidth>
        </Reveal>

        {/* Desktop table */}
        <div className="mt-10 hidden overflow-hidden rounded-mkt-lg border border-mkt-border-light bg-mkt-surface-white md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-mkt-border-light">
                <th className="p-5 text-sm font-medium text-mkt-text-muted"></th>
                {differentiationColumns.map((col, i) => (
                  <th
                    key={col}
                    className={`p-5 text-center text-sm font-semibold ${
                      i === 0 ? "text-brand-teal" : "text-mkt-text-muted"
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {differentiationRows.map((row) => (
                <tr key={row.label} className="border-b border-mkt-border-light last:border-0">
                  <td className="p-5 text-sm font-medium text-mkt-text-primary">{row.label}</td>
                  <td className="p-5 text-center">
                    <Cell value={row.intelliceo} />
                  </td>
                  <td className="p-5 text-center">
                    <Cell value={row.spreadsheets} />
                  </td>
                  <td className="p-5 text-center">
                    <Cell value={row.genericSoftware} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: stacked groups */}
        <div className="mt-10 flex flex-col gap-3 md:hidden">
          {differentiationRows.map((row) => (
            <div
              key={row.label}
              className="rounded-mkt-md border border-mkt-border-light bg-mkt-surface-white p-4"
            >
              <p className="text-sm font-medium text-mkt-text-primary">{row.label}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                {differentiationColumns.map((col, i) => {
                  const value =
                    i === 0 ? row.intelliceo : i === 1 ? row.spreadsheets : row.genericSoftware;
                  return (
                    <div key={col} className="flex flex-col items-center gap-1">
                      <span className="text-[11px] text-mkt-text-muted">{col}</span>
                      <Cell value={value} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
