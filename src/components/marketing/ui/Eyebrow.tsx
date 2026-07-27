export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-bold uppercase tracking-[0.12em] leading-none text-brand-gold">
      {children}
    </span>
  );
}
