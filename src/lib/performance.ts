import { log, trackEvent } from "./observability";

// ─── Core Web Vitals Monitoring ───
export const initPerformanceMonitoring = () => {
  if (typeof window === "undefined") return;

  // Track LCP (Largest Contentful Paint)
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    const lcp = lastEntry.startTime;

    trackEvent("web_vital_lcp", {
      value: Math.round(lcp),
      rating: lcp < 2500 ? "good" : lcp < 4000 ? "needs-improvement" : "poor",
    });
    log("info", `[Performance] LCP: ${Math.round(lcp)}ms`, {
      rating: lcp < 2500 ? "good" : "poor",
    });
  });

  try {
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
  } catch (e) {
    /* unsupported browser */
  }

  // Track CLS (Cumulative Layout Shift)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const layoutShift = entry as PerformanceEntry & {
        hadRecentInput: boolean;
        value: number;
      };
      if (!layoutShift.hadRecentInput) {
        clsValue += layoutShift.value;
      }
    }
  });

  try {
    clsObserver.observe({ type: "layout-shift", buffered: true });
  } catch (e) {
    /* unsupported */
  }

  // Report CLS on page hide
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      trackEvent("web_vital_cls", {
        value: Math.round(clsValue * 1000) / 1000,
        rating:
          clsValue < 0.1
            ? "good"
            : clsValue < 0.25
              ? "needs-improvement"
              : "poor",
      });
    }
  });

  // Track INP (Interaction to Next Paint)
  const inpObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const inp = entry.duration;
      trackEvent("web_vital_inp", {
        value: Math.round(inp),
        rating: inp < 200 ? "good" : inp < 500 ? "needs-improvement" : "poor",
      });
    }
  });

  try {
    inpObserver.observe({ type: "event", buffered: true });
  } catch (e) {
    /* unsupported */
  }

  // Track FCP (First Contentful Paint)
  const fcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    if (entries.length > 0) {
      const fcp = entries[0].startTime;
      trackEvent("web_vital_fcp", {
        value: Math.round(fcp),
        rating: fcp < 1800 ? "good" : "poor",
      });
    }
  });

  try {
    fcpObserver.observe({ type: "paint", buffered: true });
  } catch (e) {
    /* unsupported */
  }

  // Track TTFB (Time to First Byte)
  const navEntries = performance.getEntriesByType(
    "navigation",
  ) as PerformanceNavigationTiming[];
  if (navEntries.length > 0) {
    const ttfb = navEntries[0].responseStart;
    trackEvent("web_vital_ttfb", {
      value: Math.round(ttfb),
      rating: ttfb < 800 ? "good" : "poor",
    });
  }

  log("info", "[Performance] Core Web Vitals monitoring initialized");
};

// ─── Lazy Image Loading Helper ───
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// ─── Bundle Budget Check ───
export const checkBundleBudget = () => {
  const resources = performance.getEntriesByType(
    "resource",
  ) as PerformanceResourceTiming[];
  const jsResources = resources.filter((r) => r.name.endsWith(".js"));
  const cssResources = resources.filter((r) => r.name.endsWith(".css"));

  const totalJsSize = jsResources.reduce(
    (acc, r) => acc + (r.transferSize || 0),
    0,
  );
  const totalCssSize = cssResources.reduce(
    (acc, r) => acc + (r.transferSize || 0),
    0,
  );

  const report = {
    jsCount: jsResources.length,
    cssCount: cssResources.length,
    totalJsKB: Math.round(totalJsSize / 1024),
    totalCssKB: Math.round(totalCssSize / 1024),
    totalKB: Math.round((totalJsSize + totalCssSize) / 1024),
  };

  if (report.totalJsKB > 500) {
    log("warn", "[Performance] JS bundle exceeds 500KB budget", report);
  }

  return report;
};
