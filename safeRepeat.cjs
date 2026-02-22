/* Preload guard for Node/Next startup */
(() => {
  try {
    const orig = String.prototype.repeat;
    if (!orig || orig.__patchedSafeRepeat) return;
    function safeRepeat(count) {
      const n = Number.isFinite(count) ? Math.floor(count) : 0;
      return orig.call(this, Math.max(0, n));
    }
    Object.defineProperty(safeRepeat, "__patchedSafeRepeat", { value: true });
    String.prototype.repeat = safeRepeat;
  } catch {}
})();
