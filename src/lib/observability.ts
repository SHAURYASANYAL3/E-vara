import * as Sentry from "@sentry/react";
import posthog from "posthog-js";

export const initObservability = () => {
  // PostHog Init
  if (import.meta.env.VITE_POSTHOG_KEY) {
    posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
      api_host: import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com",
      autocapture: true,
      capture_pageview: false, // handled by usePageView hook for accurate SPA routing
      capture_pageleave: true,
      session_recording: {
        maskAllInputs: true,
        maskTextSelector: "[data-mask]",
      },
    });
  }

  // Sentry Init
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      tracesSampleRate: 1.0,
      tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      enableLogs: true,
      environment: import.meta.env.MODE,
      release: `e-vara@${import.meta.env.VITE_APP_VERSION || "0.0.0"}`,
    });
  }
};

// Centralized event tracking
export const trackEvent = (
  eventName: string,
  properties?: Record<string, unknown>,
) => {
  try {
    if (import.meta.env.VITE_POSTHOG_KEY) {
      posthog.capture(eventName, properties);
    }
  } catch (e) {
    console.warn("[Observability] Event capture failed:", e);
  }
};

// Identify user for PostHog
export const identifyUser = (
  userId: string,
  traits?: Record<string, unknown>,
) => {
  try {
    if (import.meta.env.VITE_POSTHOG_KEY) {
      posthog.identify(userId, traits);
    }
    if (import.meta.env.VITE_SENTRY_DSN) {
      Sentry.setUser({ id: userId, ...traits });
    }
  } catch (e) {
    console.warn("[Observability] User identify failed:", e);
  }
};

// Reset tracking on logout
export const resetTracking = () => {
  try {
    posthog.reset();
    Sentry.setUser(null);
  } catch (e) {
    console.warn("[Observability] Tracking reset failed:", e);
  }
};

// Structured logging
export type LogLevel = "info" | "warn" | "error" | "debug";

export const log = (
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
) => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };

  switch (level) {
    case "error":
      console.error(`[E-VARA] ${message}`, context);
      if (import.meta.env.VITE_SENTRY_DSN) {
        Sentry.captureMessage(message, { level: "error", extra: context });
      }
      break;
    case "warn":
      console.warn(`[E-VARA] ${message}`, context);
      break;
    case "info":
      console.info(`[E-VARA] ${message}`, context);
      break;
    case "debug":
      if (!import.meta.env.PROD) {
        console.debug(`[E-VARA] ${message}`, context);
      }
      break;
  }

  // Store in a rotating local log buffer for searchable events
  try {
    const logs = JSON.parse(localStorage.getItem("e_vara_logs") || "[]");
    logs.push(entry);
    // Keep last 500 entries
    if (logs.length > 500) logs.splice(0, logs.length - 500);
    localStorage.setItem("e_vara_logs", JSON.stringify(logs));
  } catch (e) {
    /* storage full, ignore */
  }
};
