import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Press-and-hold gesture hook. Works with mouse, touch and keyboard (Space/Enter).
 * Spread `bind` onto the target button.
 */
export function usePressHold({ duration = 3000, onComplete, onStart, onCancel, disabled = false } = {}) {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const rafRef = useRef(null);
  const startRef = useRef(0);
  const completedRef = useRef(false);
  const cbs = useRef({ onComplete, onStart, onCancel });

  useEffect(() => {
    cbs.current = { onComplete, onStart, onCancel };
  }, [onComplete, onStart, onCancel]);

  const stop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const elapsed = Date.now() - startRef.current;
    const p = Math.min(1, elapsed / duration);
    setProgress(p);
    if (p >= 1) {
      stop();
      setHolding(false);
      completedRef.current = true;
      if (cbs.current.onComplete) cbs.current.onComplete();
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [duration, stop]);

  const begin = useCallback(() => {
    if (disabled || holding || completedRef.current) return;
    completedRef.current = false;
    startRef.current = Date.now();
    setHolding(true);
    setProgress(0);
    if (cbs.current.onStart) cbs.current.onStart();
    stop();
    rafRef.current = requestAnimationFrame(tick);
  }, [disabled, holding, stop, tick]);

  const end = useCallback(() => {
    if (!holding) return;
    stop();
    setHolding(false);
    setProgress(0);
    if (cbs.current.onCancel) cbs.current.onCancel();
  }, [holding, stop]);

  const reset = useCallback(() => {
    stop();
    completedRef.current = false;
    setHolding(false);
    setProgress(0);
  }, [stop]);

  useEffect(() => stop, [stop]);

  const bind = {
    onPointerDown: (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      try {
        e.currentTarget.setPointerCapture?.(e.pointerId);
      } catch (err) {
        /* noop */
      }
      begin();
    },
    onPointerUp: end,
    onPointerCancel: end,
    onPointerLeave: end,
    onKeyDown: (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        begin();
      }
    },
    onKeyUp: (e) => {
      if (e.key === " " || e.key === "Enter") end();
    },
    onContextMenu: (e) => e.preventDefault(),
    style: { touchAction: "none", userSelect: "none", WebkitUserSelect: "none" },
  };

  return { progress, holding, bind, reset, begin, end };
}
