/**
 * Dedupes in-flight requests and caches successful responses briefly
 * so StrictMode remounts / multiple components don't spam the API.
 */
type CacheEntry<T> = { expires: number; value: T };

export function createCachedRequest<TArgs extends unknown[], TResult>(
  keyFn: (...args: TArgs) => string,
  fetcher: (...args: TArgs) => Promise<TResult>,
  ttlMs = 30_000,
) {
  const cache = new Map<string, CacheEntry<TResult>>();
  const inflight = new Map<string, Promise<TResult>>();

  const request = async (...args: TArgs): Promise<TResult> => {
    const key = keyFn(...args);
    const hit = cache.get(key);
    if (hit && hit.expires > Date.now()) {
      return hit.value;
    }

    const pending = inflight.get(key);
    if (pending) return pending;

    const promise = fetcher(...args)
      .then((value) => {
        cache.set(key, { value, expires: Date.now() + ttlMs });
        return value;
      })
      .finally(() => {
        inflight.delete(key);
      });

    inflight.set(key, promise);
    return promise;
  };

  request.invalidate = (...args: TArgs) => {
    cache.delete(keyFn(...args));
  };

  request.invalidateAll = () => {
    cache.clear();
  };

  return request;
}
