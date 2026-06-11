import { describe, it, expect } from "vitest";
import { cn } from "../lib/utils";

describe("utils -> cn()", () => {
  it("should merge tailwind classes properly", () => {
    // Basic concatenation
    expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");

    // Tailwind specific override (text-black overrides text-white)
    expect(cn("text-white", "text-black")).toBe("text-black");

    // Padding override
    expect(cn("p-4", "p-8")).toBe("p-8");
  });

  it("should handle conditional classes using clsx", () => {
    const isError = true;
    const isSuccess = false;

    expect(
      cn("base-class", isError && "bg-red-500", isSuccess && "bg-green-500"),
    ).toBe("base-class bg-red-500");
  });

  it("should handle arrays and objects", () => {
    expect(cn(["px-2", "py-1"], { "opacity-50": true, hidden: false })).toBe(
      "px-2 py-1 opacity-50",
    );
  });

  it("should gracefully ignore null, undefined, and false", () => {
    expect(cn("flex", null, undefined, false, "items-center")).toBe(
      "flex items-center",
    );
  });
});
