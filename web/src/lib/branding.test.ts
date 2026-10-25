import { describe, expect, it } from "vitest";
import { resolveWorkingVerbs } from "./branding";
import type { Branding } from "./capabilities";

const BUILTINS = ["Working…", "Cooking…"] as const;

function brandingWith(
  working_verbs: Branding["working_verbs"],
): Branding {
  return {
    app_name: "Acme",
    heading: null,
    logos: { main: null, loading: null, favicon: null },
    powered_by: true,
    working_verbs,
  };
}

describe("resolveWorkingVerbs", () => {
  it("returns builtins when branding is unset", () => {
    expect(resolveWorkingVerbs(null, BUILTINS)).toEqual([...BUILTINS]);
  });

  it("replaces the pool in replace mode", () => {
    const branding = brandingWith({ mode: "replace", verbs: ["Crunching"] });
    expect(resolveWorkingVerbs(branding, BUILTINS)).toEqual(["Crunching"]);
  });

  it("appends to builtins in append mode", () => {
    const branding = brandingWith({ mode: "append", verbs: ["Wiring it up"] });
    expect(resolveWorkingVerbs(branding, BUILTINS)).toEqual([
      "Working…",
      "Cooking…",
      "Wiring it up",
    ]);
  });
});
