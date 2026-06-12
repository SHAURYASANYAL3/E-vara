import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import DemoHealth from "../pages/DemoHealth";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock hooks
const mockUseAuth = vi.fn();
const mockUseSimulation = vi.fn();
const mockUseQuery = vi.fn();

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("@/providers/SimulationProvider", () => ({
  useSimulation: () => mockUseSimulation(),
}));

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const original = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...original,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useQuery: (...args: any[]) => mockUseQuery(...args),
  };
});

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe("DemoHealth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("renders with N/A when user is unauthenticated", () => {
    mockUseAuth.mockReturnValue({ user: null });
    mockUseSimulation.mockReturnValue({ isSimulationMode: false });
    mockUseQuery.mockReturnValue({ data: undefined });
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);

    render(
      <BrowserRouter>
        <DemoHealth />
      </BrowserRouter>
    );

    // Build Version is static
    expect(screen.getByText("RC-1.0.0")).toBeInTheDocument();

    // Edge Worker Queue and Snapshot Freshness should be N/A
    const naElements = screen.getAllByText("N/A");
    expect(naElements.length).toBe(2);

    // Console Errors should be 0
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders with 0 pending and Stable when in simulation mode", () => {
    mockUseAuth.mockReturnValue({ user: { id: "user-123" } });
    mockUseSimulation.mockReturnValue({ isSimulationMode: true });
    mockUseQuery.mockReturnValue({ data: undefined });
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);

    render(
      <BrowserRouter>
        <DemoHealth />
      </BrowserRouter>
    );

    expect(screen.getByText("0 pending")).toBeInTheDocument();
    expect(screen.getByText("Stable")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders database queue count and stable snapshot status when authenticated", () => {
    mockUseAuth.mockReturnValue({ user: { id: "user-123" } });
    mockUseSimulation.mockReturnValue({ isSimulationMode: false });

    mockUseQuery.mockImplementation(({ queryKey }) => {
      if (queryKey[0] === "demo-health-queue-count") {
        return { data: 5 };
      }
      if (queryKey[0] === "demo-health-latest-snapshot") {
        return { data: { expires_at: new Date(Date.now() + 100000).toISOString() } };
      }
      return { data: null };
    });

    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);

    render(
      <BrowserRouter>
        <DemoHealth />
      </BrowserRouter>
    );

    expect(screen.getByText("5 pending")).toBeInTheDocument();
    expect(screen.getByText("Stable")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders stale snapshot status and counts console errors correctly", () => {
    mockUseAuth.mockReturnValue({ user: { id: "user-123" } });
    mockUseSimulation.mockReturnValue({ isSimulationMode: false });

    mockUseQuery.mockImplementation(({ queryKey }) => {
      if (queryKey[0] === "demo-health-queue-count") {
        return { data: 0 };
      }
      if (queryKey[0] === "demo-health-latest-snapshot") {
        return { data: { expires_at: new Date(Date.now() - 100000).toISOString() } };
      }
      return { data: null };
    });

    const mockLogs = [
      { level: "error", message: "Error 1" },
      { level: "info", message: "Info 1" },
      { level: "error", message: "Error 2" },
    ];
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(JSON.stringify(mockLogs));

    render(
      <BrowserRouter>
        <DemoHealth />
      </BrowserRouter>
    );

    expect(screen.getByText("0 pending")).toBeInTheDocument();
    expect(screen.getByText("Stale")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
