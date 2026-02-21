// tests/routing.test.ts
import { gmapsDirectionsUrl, nearestByDistance } from "../src/services/routing"
import { describe, it, expect } from "vitest"

describe("routing", () => {
  it("google maps deep link", () => {
    // Note: 121.0 serialises as "121" in JS template literals (trailing zero dropped),
    // so we use 121.01 / 121.02 to avoid that ambiguity.
    const u = gmapsDirectionsUrl(14.6, 121.01, [121.02, 14.61])
    expect(u).toContain("origin=14.6,121.01")
    expect(u).toContain("destination=14.61,121.02")
    expect(u).toContain("travelmode=walking")
  })

  it("nearest by distance trims", () => {
    const list = [
      { name: "A", coords: [121.0, 14.59] as [number, number] },
      { name: "B", coords: [121.03, 14.58] as [number, number] },
    ]
    expect(nearestByDistance([121.0, 14.58], list, 1)).toHaveLength(1)
  })
})
