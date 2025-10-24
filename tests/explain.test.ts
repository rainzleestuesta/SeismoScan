// tests/explain.test.ts
import { initialExplanation, mockAssess, replyFor } from "../src/services/hazard";
import { describe, it, expect } from "vitest";
describe("explain", () => {
  const a = mockAssess(14.6,121.0);
  it("initial explanation contains lines", () => {
    expect(initialExplanation(a)).toContain("Site Hazard Index");
  });
  it("safety reply mentions Drop", () => {
    expect(replyFor("how to be safe?", a).toLowerCase()).toContain("drop");
  });
});
