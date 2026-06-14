import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL =
  process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

const ThreatFeed = () => {
  const [alerts, setAlerts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");

  useEffect(() => {
    // Configure client with robust auto-reconnect properties
    const socket = io(SOCKET_SERVER_URL, {
      transports: ["websocket", "polling"], // Fallback polling included
      reconnection: true, // Enables auto-reconnection
      reconnectionAttempts: Infinity, // Infinite retry attempts
      reconnectionDelay: 1000, // Start retrying after 1 second
      reconnectionDelayMax: 5000, // Maximum delay cap between attempts
      timeout: 20000, // Connection timeout before failing
    });

    socket.on("connect", () => {
      setConnectionStatus("Connected");
    });

    // Listen for the custom threat event
    socket.on("threat-alert", (newAlert) => {
      setAlerts((prevAlerts) => [newAlert, ...prevAlerts]);
    });

    socket.on("disconnect", (reason) => {
      setConnectionStatus("Disconnected. Reconnecting...");
      console.warn(`Socket disconnected: ${reason}`);
    });

    socket.on("reconnect_attempt", () => {
      setConnectionStatus("Attempting to reconnect...");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="threat-feed">
      <h3>Real-time Threat Alerts</h3>
      <div className="status">Status: {connectionStatus}</div>
      <div className="alerts-list">
        {alerts.map((alert, idx) => (
          <div key={alert.id || idx} className="alert-item">
            <h4>{alert.title}</h4>
            <p>{alert.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreatFeed;
