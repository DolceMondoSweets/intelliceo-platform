import Image from "next/image";
import Link from "next/link";

// Source wordmark is 1600x592 (trimmed of the transparent canvas padding
// the supplied asset shipped with) — aspect ratio preserved exactly,
// artwork itself untouched per the brand asset rules.
const LOGO_ASPECT = 1600 / 592;

export function Logo({
  height = 32,
  href = "/",
  priority = false,
  className = "",
}: {
  height?: number;
  href?: string | null;
  priority?: boolean;
  className?: string;
}) {
  const image = (
    <Image
      src="/brand/intelliceo-logo-web.png"
      alt="IntelliCEO"
      width={Math.round(height * LOGO_ASPECT)}
      height={height}
      priority={priority}
      className={`h-auto w-auto ${className}`}
      style={{ height, width: "auto" }}
    />
  );

  if (!href) return image;

  return (
    <Link href={href} aria-label="IntelliCEO home" className="inline-flex items-center">
      {image}
    </Link>
  );
}

// The standalone orbital icon — favicon, mobile nav, social previews,
// product mockups, small brand marks, loading states.
export function LogoIcon({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src="/brand/intelliceo-icon-web.png"
      alt=""
      width={size}
      height={size}
      className={className}
      style={{ height: size, width: size }}
    />
  );
}
