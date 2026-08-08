/**
 * Dedupes in-flight requests and caches successful responses briefly
 * so StrictMode remounts / multiple components don't spam the API.
 */
export function createCachedRequest<TArgs extends unknown[], TResult>(
  keyFn: (...args: TArgs) => string,
  fetcher: (...args: TArgs) => Promise<TResult>,
  ttlMs = 30_000,
) {
  const cache = new Map<string, { expires: number; value: TResult }>();
  const inflight = new Map<string, Promise<TResult>>();

  return async (...args: TArgs): Promise<TResult> => {
    const key = keyFn(...args);
    const hit = cache.get(key);
    if (hit && hit.expires > Date.now()) {
      return hit.value;
    }

    const pending = inflight.get(key);
    if (pending) return pending;

    const request = fetcher(...args)
      .then((value) => {
        cache.set(key, { value, expires: Date.now() + ttlMs });
        return value;
      })
      .finally(() => {
        inflight.delete(key);
      });

    inflight.set(key, request);
    return request;
  };
}
