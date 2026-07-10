import type { ZodType } from "zod";

const responseCache = new Map<string, unknown>();

export async function cachedFetch<T>(
  fetcher: typeof fetch,
  url: string,
  schema: ZodType<T>
): Promise<T> {
  const cached = responseCache.get(url);
  if (cached !== undefined) return cached as T;

  const response = await fetcher(url);
  if (!response.ok)
    throw new Error(`PokéAPI request failed (${response.status})`);
  const parsed = schema.parse(await response.json());
  responseCache.set(url, parsed);
  return parsed;
}

export function clearCache(): void {
  responseCache.clear();
}

export function cacheSize(): number {
  return responseCache.size;
}
