import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent, log } from "@/lib/observability";

// ─── Page View Tracking ───
export function usePageView() {
  const location = useLocation();
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    trackEvent("$pageview", {
      path: location.pathname,
      referrer:
        prevPath.current !== location.pathname
          ? prevPath.current
          : document.referrer,
      title: document.title,
      timestamp: new Date().toISOString(),
    });
    prevPath.current = location.pathname;
  }, [location.pathname]);
}

// ─── Scroll Depth Tracking ───
export function useScrollDepth() {
  const maxDepth = useRef(0);
  const location = useLocation();

  useEffect(() => {
    maxDepth.current = 0;

    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const depth = Math.round((window.scrollY / scrollHeight) * 100);

      if (depth > maxDepth.current) {
        maxDepth.current = depth;
        // Track at 25%, 50%, 75%, 100%
        const milestones = [25, 50, 75, 100];
        for (const milestone of milestones) {
          if (depth >= milestone && maxDepth.current - depth < 5) {
            trackEvent("scroll_depth", {
              path: location.pathname,
              depth: milestone,
            });
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);
}

// ─── Feature Usage Tracking ───
export function useFeatureTrack() {
  return useCallback((feature: string, metadata?: Record<string, unknown>) => {
    trackEvent("feature_used", {
      feature,
      path: window.location.pathname,
      ...metadata,
    });
    log("debug", `[Analytics] Feature used: ${feature}`, metadata);
  }, []);
}

// ─── Session Duration Tracking ───
export function useSessionDuration() {
  const sessionStart = useRef<number>(0);

  useEffect(() => {
    sessionStart.current = Date.now();
    const handleBeforeUnload = () => {
      if (sessionStart.current === 0) return;
      const duration = Math.round((Date.now() - sessionStart.current) / 1000);
      trackEvent("session_end", {
        duration_seconds: duration,
        pages_visited: performance.getEntriesByType("navigation").length,
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);
}

// ─── Click Tracking (Delegation) ───
export function useClickTracking() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const trackable = target.closest("[data-track]");
      if (trackable) {
        trackEvent("click", {
          element: trackable.getAttribute("data-track"),
          text: trackable.textContent?.slice(0, 100),
          path: window.location.pathname,
        });
      }
    };

    document.addEventListener("click", handleClick, { passive: true });
    return () => document.removeEventListener("click", handleClick);
  }, []);
}

// ─── Conversion Tracking ───
export const trackConversion = (
  type: string,
  value?: number,
  metadata?: Record<string, unknown>,
) => {
  trackEvent("conversion", {
    type,
    value,
    path: window.location.pathname,
    ...metadata,
  });
  log("info", `[Analytics] Conversion: ${type}`, { value, ...metadata });
};
