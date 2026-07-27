// Section 7 (Grid and Page Width): 1280px max-width container, 12-column
// grid available to children via Tailwind's grid utilities directly.
export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1280px] px-5 sm:px-6 md:px-12 lg:px-16 ${className}`}>
      {children}
    </div>
  );
}

// Section headline copy shouldn't span the full container width — Section 7
// recommends 680px for normal content, 820px for editorial introductions.
// Full class strings kept literal (not interpolated) so Tailwind's static
// scanner can actually see and generate them.
export function ProseWidth({
  children,
  large = false,
  className = "",
}: {
  children: React.ReactNode;
  large?: boolean;
  className?: string;
}) {
  return (
    <div className={`${large ? "max-w-[820px]" : "max-w-[680px]"} ${className}`}>{children}</div>
  );
}
