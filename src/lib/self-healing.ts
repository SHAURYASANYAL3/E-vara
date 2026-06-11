import { log, trackEvent } from "./observability";
import { toast } from "sonner";

// ─── Recovery State Machine ───
type RecoveryPhase =
  | "detect"
  | "contain"
  | "retry"
  | "fallback"
  | "repair"
  | "validate"
  | "recover";

interface RecoveryContext {
  subsystem: string;
  error: unknown;
  phase: RecoveryPhase;
  retryCount: number;
  maxRetries: number;
  startedAt: number;
}

const activeRecoveries = new Map<string, RecoveryContext>();

// ─── Self-Healing Engine ───
export async function selfHeal<T>(
  subsystem: string,
  operation: () => Promise<T>,
  fallback: () => T | Promise<T>,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    cacheKey?: string;
    silentFallback?: boolean;
  } = {},
): Promise<T> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    cacheKey,
    silentFallback = false,
  } = options;

  // DETECT
  const ctx: RecoveryContext = {
    subsystem,
    error: null,
    phase: "detect",
    retryCount: 0,
    maxRetries,
    startedAt: Date.now(),
  };
  activeRecoveries.set(subsystem, ctx);

  // Check cached result first
  if (cacheKey) {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed._healExpiry && parsed._healExpiry > Date.now()) {
          log("debug", `[Self-Heal] Serving cached result for ${subsystem}`);
          activeRecoveries.delete(subsystem);
          return parsed.data as T;
        }
      }
    } catch {
      /* ignore */
    }
  }

  // RETRY loop
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    ctx.phase = attempt === 0 ? "detect" : "retry";
    ctx.retryCount = attempt;

    try {
      const result = await operation();

      // VALIDATE
      ctx.phase = "validate";
      if (result === undefined || result === null) {
        throw new Error(`${subsystem} returned empty result`);
      }

      // RECOVER - cache success
      ctx.phase = "recover";
      if (cacheKey) {
        try {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              data: result,
              _healExpiry: Date.now() + 5 * 60 * 1000, // 5 min cache
            }),
          );
        } catch {
          /* storage full */
        }
      }

      activeRecoveries.delete(subsystem);
      return result;
    } catch (error) {
      ctx.error = error;
      ctx.phase = "contain";
      log(
        "warn",
        `[Self-Heal] ${subsystem} attempt ${attempt + 1}/${maxRetries + 1} failed`,
        {
          error: error instanceof Error ? error.message : String(error),
        },
      );

      if (attempt < maxRetries) {
        const backoff = retryDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, backoff));
      }
    }
  }

  // FALLBACK
  ctx.phase = "fallback";
  log("warn", `[Self-Heal] ${subsystem} exhausted retries, engaging fallback`);
  trackEvent("self_heal_fallback", { subsystem, retryCount: ctx.retryCount });

  if (!silentFallback) {
    toast.info("Reconnecting Intelligence Layer…", {
      description: `${subsystem} is recovering. Simulated data active.`,
      duration: 4000,
    });
  }

  try {
    const fallbackResult = await fallback();

    // REPAIR - cache fallback
    if (cacheKey && fallbackResult != null) {
      try {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: fallbackResult,
            _healExpiry: Date.now() + 2 * 60 * 1000, // 2 min for fallback
          }),
        );
      } catch {
        /* storage full */
      }
    }

    activeRecoveries.delete(subsystem);
    return fallbackResult;
  } catch (fallbackError) {
    log("error", `[Self-Heal] ${subsystem} fallback also failed`, {
      error:
        fallbackError instanceof Error
          ? fallbackError.message
          : String(fallbackError),
    });
    activeRecoveries.delete(subsystem);
    throw fallbackError;
  }
}

// ─── Network Connectivity Monitor ───
let isOnline = navigator.onLine;
const onlineListeners = new Set<(online: boolean) => void>();

window.addEventListener("online", () => {
  isOnline = true;
  log("info", "[Self-Heal] Network restored");
  trackEvent("network_restored");
  toast.success("Connection Restored", {
    description: "Intelligence systems back online.",
  });
  onlineListeners.forEach((fn) => fn(true));
});

window.addEventListener("offline", () => {
  isOnline = false;
  log("warn", "[Self-Heal] Network lost");
  trackEvent("network_lost");
  toast.warning("Reconnecting Intelligence Layer…", {
    description: "Operating in local simulation mode.",
    duration: 8000,
  });
  onlineListeners.forEach((fn) => fn(false));
});

export const getNetworkStatus = () => isOnline;

export const onNetworkChange = (listener: (online: boolean) => void) => {
  onlineListeners.add(listener);
  return () => onlineListeners.delete(listener);
};

// ─── Form Autosave ───
export const autosaveForm = (formId: string, data: Record<string, unknown>) => {
  try {
    localStorage.setItem(
      `e_vara_autosave_${formId}`,
      JSON.stringify({
        data,
        savedAt: Date.now(),
      }),
    );
  } catch {
    /* storage full */
  }
};

export const restoreForm = (formId: string): Record<string, unknown> | null => {
  try {
    const saved = localStorage.getItem(`e_vara_autosave_${formId}`);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    // Only restore if saved within last 30 minutes
    if (parsed.savedAt && Date.now() - parsed.savedAt < 30 * 60 * 1000) {
      return parsed.data;
    }
    localStorage.removeItem(`e_vara_autosave_${formId}`);
    return null;
  } catch {
    return null;
  }
};

// ─── Session Preservation ───
export const preserveSession = () => {
  try {
    const sessionData = {
      path: window.location.pathname,
      timestamp: Date.now(),
      demoAuth: localStorage.getItem("e_vara_demo_auth"),
    };
    sessionStorage.setItem(
      "e_vara_preserved_session",
      JSON.stringify(sessionData),
    );
  } catch {
    /* ignore */
  }
};

export const restoreSession = (): string | null => {
  try {
    const saved = sessionStorage.getItem("e_vara_preserved_session");
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    // Only restore if within last 10 minutes
    if (parsed.timestamp && Date.now() - parsed.timestamp < 10 * 60 * 1000) {
      if (parsed.demoAuth) {
        localStorage.setItem("e_vara_demo_auth", parsed.demoAuth);
      }
      return parsed.path;
    }
    return null;
  } catch {
    return null;
  }
};

// ─── Health Check ───
export const getSystemHealth = () => {
  return {
    online: isOnline,
    activeRecoveries: Array.from(activeRecoveries.entries()).map(
      ([key, ctx]) => ({
        subsystem: key,
        phase: ctx.phase,
        retryCount: ctx.retryCount,
        elapsed: Date.now() - ctx.startedAt,
      }),
    ),
    simulationMode: localStorage.getItem("e_vara_simulation_mode") === "true",
    logEntries: (() => {
      try {
        return JSON.parse(localStorage.getItem("e_vara_logs") || "[]").length;
      } catch {
        return 0;
      }
    })(),
  };
};
