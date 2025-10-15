type TokenBucket = {
  capacity: number;
  tokens: number;
  refillRatePerSec: number;
  lastRefill: number;
};

const buckets = new Map<string, TokenBucket>();

export function rateLimit(key: string, capacity = 10, refillRatePerSec = 5): boolean {
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { capacity, tokens: capacity, refillRatePerSec, lastRefill: now };
    buckets.set(key, bucket);
  }
  const elapsedSec = (now - bucket.lastRefill) / 1000;
  const refill = Math.floor(elapsedSec * bucket.refillRatePerSec);
  if (refill > 0) {
    bucket.tokens = Math.min(bucket.capacity, bucket.tokens + refill);
    bucket.lastRefill = now;
  }
  if (bucket.tokens <= 0) return false;
  bucket.tokens -= 1;
  return true;
}
