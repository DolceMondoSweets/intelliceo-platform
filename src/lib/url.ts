import "server-only";
import { headers } from "next/headers";

// Builds an absolute base URL from the incoming request's Host header —
// works locally and once deployed without needing a hardcoded site-URL env
// var. Stripe's success_url/cancel_url/return_url all require absolute URLs.
export async function getBaseUrl(): Promise<string> {
  const host = (await headers()).get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}
