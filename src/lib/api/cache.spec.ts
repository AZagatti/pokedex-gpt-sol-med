import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { cacheSize, cachedFetch, clearCache } from "./cache";

describe("cachedFetch", () => {
  beforeEach(clearCache);

  it("validates and caches a response by URL", async () => {
    const fetcher = vi.fn(() =>
      Promise.resolve(new Response(JSON.stringify({ value: 42 })))
    );
    const schema = z.object({ value: z.number() });

    await expect(
      cachedFetch(fetcher as typeof fetch, "https://example.test/value", schema)
    ).resolves.toEqual({ value: 42 });
    await expect(
      cachedFetch(fetcher as typeof fetch, "https://example.test/value", schema)
    ).resolves.toEqual({ value: 42 });
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(cacheSize()).toBe(1);
  });

  it("rejects invalid API shapes", async () => {
    const fetcher = vi.fn(() =>
      Promise.resolve(new Response(JSON.stringify({ value: "wrong" })))
    );
    await expect(
      cachedFetch(
        fetcher as typeof fetch,
        "https://example.test/invalid",
        z.object({ value: z.number() })
      )
    ).rejects.toThrow();
  });
});
