import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ExposureMode = "classic" | "executive" | "experimental";

interface FeatureFlags {
  identityOS: boolean;
  riskEngine: boolean;
  deviceTrust: boolean;
  timeline: boolean;
  explainability: boolean;
}

interface FeatureStore {
  mode: ExposureMode;
  freezeState: boolean;
  features: FeatureFlags;
  setMode: (mode: ExposureMode) => void;
  toggleFreeze: () => void;
  toggleFeature: (feature: keyof FeatureFlags) => void;
  overrideFeatures: (features: FeatureFlags) => void;
}

const DEFAULT_FEATURES: Record<ExposureMode, FeatureFlags> = {
  classic: {
    identityOS: false,
    riskEngine: false,
    deviceTrust: false,
    timeline: false,
    explainability: false,
  },
  executive: {
    identityOS: true,
    riskEngine: true,
    deviceTrust: true,
    timeline: true,
    explainability: true,
  },
  experimental: {
    identityOS: true,
    riskEngine: true,
    deviceTrust: true,
    timeline: true,
    explainability: true,
  },
};

export const useFeatureFlags = create<FeatureStore>()(
  persist(
    (set) => ({
      mode: "classic",
      freezeState: false,
      features: DEFAULT_FEATURES["classic"],
      setMode: (mode) => set({ mode, features: DEFAULT_FEATURES[mode] }),
      toggleFreeze: () => set((state) => ({ freezeState: !state.freezeState })),
      toggleFeature: (feature) =>
        set((state) => ({
          features: { ...state.features, [feature]: !state.features[feature] },
        })),
      overrideFeatures: (features) => set({ features }),
    }),
    {
      name: "e-vara-labs-flags",
    },
  ),
);
