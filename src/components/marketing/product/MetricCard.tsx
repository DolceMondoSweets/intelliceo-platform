// Section 24 mockup interface rules: neutral white/off-white surfaces, teal
// for structure, gold reserved for the important number/insight, one
// dominant message per card.
export function MetricCard({
  label,
  value,
  suffix,
  note,
  tone = "neutral",
}: {
  label: string;
  value: string;
  suffix?: string;
  note?: string;
  tone?: "neutral" | "good" | "warning" | "gold";
}) {
  const valueColor =
    tone === "good"
      ? "text-mkt-success"
      : tone === "warning"
        ? "text-mkt-warning"
        : tone === "gold"
          ? "text-brand-gold"
          : "text-mkt-text-primary";

  return (
    <div className="flex flex-col gap-1 rounded-mkt-md border border-mkt-border-light bg-mkt-surface-white p-4">
      <span className="text-xs font-medium text-mkt-text-muted">{label}</span>
      <span className={`text-2xl font-bold tracking-tight ${valueColor}`}>
        {value}
        {suffix && <span className="ml-0.5 text-base font-medium text-mkt-text-muted">{suffix}</span>}
      </span>
      {note && <span className="text-xs text-mkt-text-muted">{note}</span>}
    </div>
  );
}
