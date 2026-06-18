"use client";
import React from "react";

const ThreatMonitorSkeleton = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-lg border border-border/60 bg-secondary/30 p-4 space-y-3"
        >
          <div className="h-4 w-2/3 bg-muted rounded" />
          <div className="h-3 w-1/2 bg-muted rounded" />
          <div className="h-2 w-1/4 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
};

export default ThreatMonitorSkeleton;
