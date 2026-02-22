/**
 * Temporary runtime guard: make String.prototype.repeat ignore negative counts
 * instead of throwing. Remove after fixing the real call site.
 */
(() => {
  try {
    const orig = String.prototype.repeat as (this: string, count: number) => string;
    if (!orig || (orig as any).__patchedSafeRepeat) return;
    function safeRepeat(this: string, count: number): string {
      const n = Number.isFinite(count) ? Math.floor(count) : 0;
      return orig.call(this, Math.max(0, n));
    }
    (safeRepeat as any).__patchedSafeRepeat = true;
    // @ts-ignore
    String.prototype.repeat = safeRepeat;
  } catch {}
})();