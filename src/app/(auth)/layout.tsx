import { Logo } from "@/components/marketing/brand/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-12 dark:bg-black">
      <div className="w-full max-w-sm">
        <Logo height={32} className="mb-8" />
        {children}
      </div>
    </div>
  );
}
