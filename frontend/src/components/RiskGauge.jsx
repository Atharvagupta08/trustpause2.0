import React, { useEffect, useRef, useState } from "react";
import { BAND_META, riskBand } from "@/lib/simData";
import { cn } from "@/lib/utils";

export function useAnimatedNumber(target, duration = 520) {
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);
  const startRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return undefined;
    startRef.current = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = from + (target - from) * eased;
      setDisplay(v);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        fromRef.current = target;
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      fromRef.current = display;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return display;
}

export const RiskGauge = ({ value = 0, size = 56, stroke = 6, compact = false, testId = "risk-gauge" }) => {
  const animated = useAnimatedNumber(value);
  const band = riskBand(value);
  const meta = BAND_META[band];
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.max(0, Math.min(100, animated)) / 100);

  return (
    <div className="flex items-center gap-3" data-testid={testId} data-band={band}>
      <div className="relative grid place-items-center" style={{ width: size, height: size }}>
        {band === "danger" && (
          <span
            className="tp-pulse absolute inset-0 rounded-full border border-red-500/50"
            aria-hidden="true"
          />
        )}
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          <defs>
            <linearGradient id={`${testId}-grad`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={meta.stroke} stopOpacity="0.55" />
              <stop offset="100%" stopColor={meta.stroke} stopOpacity="1" />
            </linearGradient>
            <filter id={`${testId}-glow`} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="2.6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.09)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={`url(#${testId}-grad)`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            filter={`url(#${testId}-glow)`}
            style={{ transition: "stroke 240ms ease" }}
          />
        </svg>
        <span
          className={cn(
            "absolute font-semibold tabular-nums",
            size > 90 ? "text-3xl" : size > 70 ? "text-xl" : "text-[13px]",
            meta.text
          )}
          style={{ fontFamily: '"Space Grotesk", ui-sans-serif' }}
          data-testid={`${testId}-value`}
          aria-live="polite"
          aria-label={`Risk score ${Math.round(value)} out of 100`}
        >
          {Math.round(animated)}
        </span>
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">Live risk</div>
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-semibold tabular-nums text-zinc-100"
              style={{ fontFamily: '"Space Grotesk", ui-sans-serif' }}
            >
              {Math.round(value)}
              <span className="text-zinc-500">/100</span>
            </span>
            <span
              className={cn(
                "rounded-full border px-2 py-[1px] text-[10px] font-medium",
                meta.chip
              )}
              data-testid={`${testId}-band`}
            >
              {meta.label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export const RiskBar = ({ value, max = 100, band = "warn", className }) => {
  const meta = BAND_META[band] || BAND_META.warn;
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-zinc-800", className)}>
      <div
        className={cn("h-full rounded-full", meta.bar)}
        style={{ width: `${pct}%`, transition: "width 420ms cubic-bezier(0.16,1,0.3,1)" }}
      />
    </div>
  );
};
