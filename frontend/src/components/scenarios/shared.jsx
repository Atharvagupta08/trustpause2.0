import React from "react";
import { ChevronLeft, MoreVertical, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

/** Fake in-app chrome so each scenario reads like a real mobile app screen. */
export const AppChrome = ({ icon: Icon, title, subtitle, accent = "zinc", right }) => {
  const accents = {
    zinc: "text-zinc-300",
    emerald: "text-emerald-400",
    amber: "text-amber-300",
    red: "text-red-400",
    blue: "text-sky-400",
  };
  return (
    <div className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900/60 px-4 py-3">
      <ChevronLeft className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
      {Icon && (
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-zinc-800 bg-zinc-950">
          <Icon className={cn("h-4 w-4", accents[accent])} aria-hidden="true" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold text-zinc-100">{title}</div>
        {subtitle && <div className="truncate text-[11px] text-zinc-500">{subtitle}</div>}
      </div>
      {right || <MoreVertical className="h-4 w-4 shrink-0 text-zinc-600" aria-hidden="true" />}
    </div>
  );
};

export const Reason = ({ children, tone = "danger" }) => {
  const dot = {
    danger: "bg-red-400",
    warn: "bg-amber-400",
    safe: "bg-emerald-400",
  }[tone];
  return (
    <li className="flex items-start gap-2 text-[12px] leading-relaxed text-zinc-300">
      <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", dot)} />
      <span>{children}</span>
    </li>
  );
};

export const OutcomeCard = ({
  tone = "safe",
  icon: Icon,
  title,
  body,
  bullets = [],
  onReplay,
  testId,
  children,
}) => {
  const tones = {
    safe: {
      wrap: "border-emerald-500/30 bg-emerald-500/[0.07]",
      badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
      title: "text-emerald-100",
    },
    warn: {
      wrap: "border-amber-500/30 bg-amber-500/[0.07]",
      badge: "border-amber-500/30 bg-amber-500/10 text-amber-200",
      title: "text-amber-100",
    },
    danger: {
      wrap: "border-red-500/30 bg-red-500/[0.07]",
      badge: "border-red-500/30 bg-red-500/10 text-red-300",
      title: "text-red-100",
    },
  }[tone];

  return (
    <div className={cn("rounded-2xl border p-4", tones.wrap)} data-testid={testId}>
      <div className="flex items-start gap-3">
        <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl border", tones.badge)}>
          {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
        </span>
        <div className="min-w-0">
          <h3
            className={cn("text-sm font-semibold sm:text-base", tones.title)}
            style={{ fontFamily: '"Space Grotesk", ui-sans-serif' }}
          >
            {title}
          </h3>
          {body && <p className="mt-1 text-[12px] leading-relaxed text-zinc-300">{body}</p>}
        </div>
      </div>
      {bullets.length > 0 && (
        <ul className="mt-3 space-y-1.5 border-t border-white/5 pt-3">
          {bullets.map((b) => (
            <Reason key={b} tone={tone}>
              {b}
            </Reason>
          ))}
        </ul>
      )}
      {children}
      {onReplay && (
        <button
          type="button"
          onClick={onReplay}
          data-testid="replay-scenario-button"
          className="tp-focus mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-xs font-semibold text-zinc-200 transition-colors duration-150 hover:bg-zinc-800"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          Replay this simulation
        </button>
      )}
    </div>
  );
};

export const btn = {
  safe:
    "tp-focus inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-3 py-3 text-[13px] font-semibold text-zinc-950 transition-colors duration-150 hover:bg-emerald-400 active:scale-[0.99]",
  danger:
    "tp-focus inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-3 py-3 text-[13px] font-semibold text-white transition-colors duration-150 hover:bg-red-400 active:scale-[0.99]",
  warn:
    "tp-focus inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-3 py-3 text-[13px] font-semibold text-zinc-950 transition-colors duration-150 hover:bg-amber-300 active:scale-[0.99]",
  ghost:
    "tp-focus inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/70 px-3 py-3 text-[13px] font-semibold text-zinc-200 transition-colors duration-150 hover:bg-zinc-800",
  subtle:
    "tp-focus inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-transparent px-3 py-2.5 text-[12px] font-medium text-zinc-400 transition-colors duration-150 hover:text-zinc-200",
};
