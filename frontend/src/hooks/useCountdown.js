import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Precise countdown driven by timestamps (immune to interval drift).
 * Returns remaining seconds (float), progress 0..1, running flag and controls.
 */
export function useCountdown({ seconds = 10, onTick, onComplete, autoStart = false } = {}) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const rafRef = useRef(null);
  const endRef = useRef(0);
  const lastWholeRef = useRef(Math.ceil(seconds));
  const onTickRef = useRef(onTick);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onTickRef.current = onTick;
    onCompleteRef.current = onComplete;
  }, [onTick, onComplete]);

  const stopLoop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const loop = useCallback(() => {
    const left = Math.max(0, (endRef.current - Date.now()) / 1000);
    setRemaining(left);
    const whole = Math.ceil(left);
    if (whole !== lastWholeRef.current) {
      lastWholeRef.current = whole;
      if (whole > 0 && onTickRef.current) onTickRef.current(whole);
    }
    if (left <= 0) {
      stopLoop();
      setRunning(false);
      if (onCompleteRef.current) onCompleteRef.current();
      return;
    }
    rafRef.current = requestAnimationFrame(loop);
  }, [stopLoop]);

  const start = useCallback(
    (secs) => {
      const total = typeof secs === "number" ? secs : seconds;
      stopLoop();
      endRef.current = Date.now() + total * 1000;
      lastWholeRef.current = Math.ceil(total) + 1;
      setRemaining(total);
      setRunning(true);
      rafRef.current = requestAnimationFrame(loop);
    },
    [seconds, loop, stopLoop]
  );

  const reset = useCallback(
    (secs) => {
      stopLoop();
      setRunning(false);
      setRemaining(typeof secs === "number" ? secs : seconds);
    },
    [seconds, stopLoop]
  );

  const skip = useCallback(() => {
    stopLoop();
    setRunning(false);
    setRemaining(0);
    if (onCompleteRef.current) onCompleteRef.current();
  }, [stopLoop]);

  useEffect(() => {
    if (autoStart) start(seconds);
    return stopLoop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => stopLoop, [stopLoop]);

  const progress = seconds > 0 ? 1 - remaining / seconds : 1;

  return {
    remaining,
    secondsLeft: Math.ceil(remaining),
    progress: Math.min(1, Math.max(0, progress)),
    running,
    done: remaining <= 0,
    start,
    reset,
    skip,
  };
}
