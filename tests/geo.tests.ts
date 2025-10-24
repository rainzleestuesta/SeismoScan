// tests/geo.test.ts
import { kmBetween, bearingFrom } from "../src/lib/geo";
import { describe, it, expect } from "vitest";
describe("geo", () => {
  it("kmBetween positive", () => expect(kmBetween([121,14.6],[121,14.7])).toBeGreaterThan(0));
  it("bearing range", () => expect(bearingFrom([121,14.6],[121.01,14.61])).toBeGreaterThanOrEqual(0));
});
