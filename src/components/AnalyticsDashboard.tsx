import React, { useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Brush,
} from "recharts";

interface Snapshot {
  calculated_at: string; // ISO timestamp
  score: number;
}

/**
 * AnalyticsDashboard – displays a responsive line chart of the user's historical risk scores.
 * Uses Supabase client to fetch `risk_snapshots` for the authenticated user.
 * Includes tooltips and a brush component for zooming/panning.
 */
export const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: snapshots, error } = await supabase
        .from("risk_snapshots")
        .select("calculated_at, score")
        .order("calculated_at", { ascending: true });

      if (error) {
        console.error("Failed to fetch risk snapshots:", error);
        setData([]);
      } else if (snapshots) {
        // Convert timestamps to Date objects for chart formatting
        const formatted = snapshots.map((s) => ({
          calculated_at: new Date(s.calculated_at).toLocaleDateString(),
          score: s.score,
        }));
        setData(formatted);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading risk history…</div>;
  }

  if (!data.length) {
    return <div className="p-4">No risk data available.</div>;
  }

  return (
    <div className="p-4 bg-card rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Risk Score Over Time</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="calculated_at" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
          {/* Brush provides a simple zoom/pan UI */}
          <Brush dataKey="calculated_at" height={30} stroke="#4f46e5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
