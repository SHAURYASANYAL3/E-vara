import React from "react";
import { useFeatureFlags, ExposureMode } from "@/hooks/useFeatureFlags";
import { ShieldCheck, Snowflake, Settings } from "lucide-react";

const Labs = () => {
  const { mode, freezeState, features, setMode, toggleFreeze, toggleFeature } =
    useFeatureFlags();

  return (
    <div className="min-h-screen bg-black text-gray-200 p-8 font-mono">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
          <Settings className="text-cyan-500" />
          <h1 className="text-2xl font-light tracking-widest uppercase">
            E-VARA / Labs / Feature Override
          </h1>
        </div>

        {/* Global Demo Freeze */}
        <div className="p-6 border border-gray-800 bg-gray-900/50 rounded-xl flex items-center justify-between">
          <div>
            <h3 className="text-lg flex items-center gap-2">
              <Snowflake
                className={freezeState ? "text-blue-400" : "text-gray-600"}
              />
              Demo Freeze
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Locks all scores and UI state. Prevents live demo catastrophes.
            </p>
          </div>
          <button
            onClick={toggleFreeze}
            className={`px-4 py-2 rounded font-medium ${freezeState ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
          >
            {freezeState ? "FROZEN" : "ACTIVE"}
          </button>
        </div>

        {/* Exposure Modes */}
        <div className="space-y-4">
          <h2 className="text-sm uppercase tracking-wider text-gray-500">
            Exposure Modes
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {(["classic", "executive", "experimental"] as ExposureMode[]).map(
              (m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`p-4 rounded-lg border text-left transition-colors ${mode === m ? "border-cyan-500 bg-cyan-500/10 text-cyan-400" : "border-gray-800 bg-gray-900/30 text-gray-400 hover:border-gray-600"}`}
                >
                  <div className="font-bold capitalize mb-1">{m}</div>
                  <div className="text-xs opacity-70">
                    {m === "classic"
                      ? "Legacy Threat Scanner"
                      : m === "executive"
                        ? "Identity OS (Stable)"
                        : "Bleeding Edge"}
                  </div>
                </button>
              ),
            )}
          </div>
        </div>

        {/* Granular Feature Flags */}
        <div className="space-y-4">
          <h2 className="text-sm uppercase tracking-wider text-gray-500">
            Granular Capability Flags
          </h2>
          <div className="space-y-2">
            {Object.entries(features).map(([key, isEnabled]) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 border border-gray-800 bg-gray-900/30 rounded-lg"
              >
                <span className="font-medium">{key}</span>
                <button
                  onClick={() => toggleFeature(key as keyof typeof features)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${isEnabled ? "bg-cyan-500" : "bg-gray-700"}`}
                >
                  <span
                    className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isEnabled ? "translate-x-6" : ""}`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {freezeState && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-500 text-sm flex items-center gap-2">
            <ShieldCheck size={16} /> Preview Mode Active. No production writes
            will occur.
          </div>
        )}
      </div>
    </div>
  );
};

export default Labs;
