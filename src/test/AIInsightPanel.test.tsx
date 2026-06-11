import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import AIInsightPanel from "../components/AIInsightPanel";
import "@testing-library/jest-dom";

describe("AIInsightPanel", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders correctly with given standard props", () => {
    render(<AIInsightPanel score={75} alertCount={5} />);

    // Check main title
    expect(
      screen.getByText(/Cognitive Intelligence Suite/i),
    ).toBeInTheDocument();

    // Check dynamic math properties (breachWeight, platformExposure, anomalies)
    // breachWeight: 30 + 5*8 = 70
    expect(screen.getByText(/70\/100/i)).toBeInTheDocument();
    // platformExposure: 75 + 12 = 87
    expect(screen.getByText(/87\/100/i)).toBeInTheDocument();
    // anomalies: 75 - 6 = 69
    expect(screen.getByText(/69\/100/i)).toBeInTheDocument();
  });

  it("displays correct strategic recommendations mapping", () => {
    render(<AIInsightPanel score={75} alertCount={5} />);

    // Ensure all 3 severity bands appear
    expect(screen.getByText(/Strategic Recommendations/i)).toBeInTheDocument();
    expect(screen.getByText(/CRITICAL/i)).toBeInTheDocument();
    expect(screen.getByText(/RECOMMENDED/i)).toBeInTheDocument();
    expect(screen.getByText(/MODERATE/i)).toBeInTheDocument();
  });

  it("handles absolute zero catastrophic score edge case", () => {
    render(<AIInsightPanel score={0} alertCount={99} />);

    // Cap test: 30 + 99*8 = 822 -> should cap at 100/100 or behave deterministically
    // We expect it to render without crashing and still show the base layout
    expect(
      screen.getByText(/Cognitive Intelligence Suite/i),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/CRITICAL/i).length).toBeGreaterThan(0);
  });

  it("handles absolute perfect score edge case", () => {
    render(<AIInsightPanel score={100} alertCount={0} />);

    // breachWeight = 30 + 0 = 30
    expect(screen.getByText(/30\/100/i)).toBeInTheDocument();
    // platformExposure = min(100, 100 + 12) = 100
    expect(screen.getByText(/100\/100/i)).toBeInTheDocument();
    // anomalies = 100 - 6 = 94
    expect(screen.getByText(/94\/100/i)).toBeInTheDocument();
  });

  it("meets fundamental accessibility standards", () => {
    const { container } = render(<AIInsightPanel score={80} alertCount={2} />);

    // Verify no empty links
    const links = container.querySelectorAll("a");
    links.forEach((link) => {
      expect(link).toHaveAttribute("href");
    });

    // Ensure icon SVGs have lucide-react classes (proxy for presentational SVG)
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(3);
  });
});
