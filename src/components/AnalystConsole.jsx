import React, { useState, useEffect, useRef } from "react";

export default function AnalystConsole() {
  const [threatData, setThreatData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const workerRef = useRef(null);
  const lastRawDataRef = useRef(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/threat-processor.worker.js", import.meta.url),
    );

    workerRef.current.onmessage = (event) => {
      const { success, data, error: workerError } = event.data;
      setIsLoading(false);

      if (success) {
        setThreatData(data);
        setError(null);
      } else {
        setError(`Worker Processing Error: ${workerError}`);
        fallbackProcessData(lastRawDataRef.current);
      }
    };

    workerRef.current.onerror = (err) => {
      setIsLoading(false);
      setError(`Worker Critical Error: ${err.message}`);
    };

    return () => {
      if (workerRef.current) workerRef.current.terminate();
    };
  }, []);

  const fallbackProcessData = (rawData) => {
    try {
      const parsed =
        typeof rawData === "string" ? JSON.parse(rawData) : rawData;
      setThreatData(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      setError(`Fallback parsing failed: ${e.message}`);
    }
  };

  const handleProcessFeed = (rawFeedPayload) => {
    setIsLoading(true);
    setError(null);
    lastRawDataRef.current = rawFeedPayload;

    if (workerRef.current) {
      workerRef.current.postMessage({ rawData: rawFeedPayload });
    } else {
      fallbackProcessData(rawFeedPayload);
      setIsLoading(false);
    }
  };

  return (
    <div className="analyst-console" style={{ padding: "20px" }}>
      <h2>Analyst Console - Threat Intelligence</h2>

      <button
        onClick={() => handleProcessFeed(mockLargePayload)}
        disabled={isLoading}
      >
        {isLoading ? "Processing Feeds Async..." : "Load Large Threat Feed"}
      </button>

      {isLoading && (
        <div className="spinner" style={{ margin: "10px 0", color: "#007bff" }}>
          Processing threat feeds on background thread...
        </div>
      )}
      {error && (
        <div
          className="error-banner"
          style={{ color: "red", margin: "10px 0" }}
        >
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <ul style={{ marginTop: "20px" }}>
          {threatData.map((threat) => (
            <li key={threat.id} style={{ margin: "5px 0" }}>
              <strong>[{threat.severity.toUpperCase()}]</strong>{" "}
              {threat.indicator} — {threat.type}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const mockLargePayload = JSON.stringify(
  Array.from({ length: 2500 }, (_, i) => ({
    id: `threat-${i}`,
    timestamp: new Date().toISOString(),
    severity: i % 4 === 0 ? "High" : "Low",
    indicator: `10.0.4.${i}`,
    type: "Malicious IP Activity",
  })),
);
