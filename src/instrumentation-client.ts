import * as Sentry from "@sentry/nextjs";

// DSN is blank until it's provided — Sentry.init is a documented safe no-op
// when dsn is undefined, so this activates the moment the env var is set,
// with no code change needed (same pattern as ANTHROPIC_API_KEY).
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
