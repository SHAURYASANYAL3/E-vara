import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initObservability } from "./lib/observability";
import { initSecurity } from "./lib/security";
import { initPerformanceMonitoring } from "./lib/performance";

// Bootstrap: Observability → Security → Render → Performance
initObservability();
initSecurity();

createRoot(document.getElementById("root")!).render(<App />);

// Initialize performance monitoring after first paint
requestIdleCallback(() => {
  initPerformanceMonitoring();
});

// Register Service Worker for true offline fallback support
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("[Service Worker] Registration failed:", err);
    });
  });
}
