import React from "react";
import { Radar, ListTree, ShieldQuestion, Cpu } from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";
import { RiskGauge, RiskBar } from "@/components/RiskGauge";
import { BAND_META } from "@/lib/simData";
import { cn } from "@/lib/utils";

const TONE_DOT = {
  safe: "bg-emerald-400",
  warn: "bg-amber-400",
  danger: "bg-red-400",
  info: "bg-zinc-500",
};

export const TelemetryPanel = ({ className }) => {
  const { risk, band, signals, events, scenario } = useSimulation();
  const meta = BAND_META[band];

  return (
    <aside className={cn("space-y-4", className)} data-testid="telemetry-panel">
      <section className="tp-glass rounded-xl p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2
            className="flex items-center gap-2 text-sm font-semibold text-zinc-100"
            style={{ fontFamily: '"Space Grotesk", ui-sans-serif' }}
          >
            <Radar className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            Risk telemetry
          </h2>
          <span className={cn("rounded-full border px-2 py-[1px] text-[10px]", meta.chip)}>
            {meta.label}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <RiskGauge value={risk} size={92} stroke={8} compact testId="risk-gauge-panel" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="text-xs text-zinc-400">
              Cognitive + technical score for the active session.
            </div>
            <RiskBar value={risk} band={band} />
            <div className="flex items-center gap-2 text-[11px] text-zinc-500">
              <Cpu className="h-3 w-3" aria-hidden="true" />
              <span className="font-mono" data-testid="telemetry-vector">
                {scenario.vector}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="tp-glass rounded-xl p-4">
        <h2
          className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-100"
          style={{ fontFamily: '"Space Grotesk", ui-sans-serif' }}
        >
          <ShieldQuestion className="h-4 w-4 text-amber-300" aria-hidden="true" />
          Detected signals
          <span className="ml-auto text-[11px] font-normal text-zinc-500" data-testid="signal-count">
            {signals.length}
          </span>
        </h2>
        {signals.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-800 p-3 text-xs text-zinc-500">
            No active signals. Interact with the simulation to see live detections.
          </p>
        ) : (
          <ul className="space-y-2" data-testid="signal-list">
            {signals.map((s) => (
              <li
                key={s.id}
                data-testid={`signal-${s.id}`}
                className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-zinc-200">{s.label}</span>
                  <span
                    className={cn(
                      "shrink-0 rounded border px-1.5 py-[1px] font-mono text-[10px]",
                      BAND_META[s.tone || "warn"].chip
                    )}
                  >
                    +{s.weight}
                  </span>
                </div>
                {s.detail && (
                  <p className="mt-1 text-[11px] leading-snug text-zinc-500">{s.detail}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="tp-glass rounded-xl p-4">
        <h2
          className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-100"
          style={{ fontFamily: '"Space Grotesk", ui-sans-serif' }}
        >
          <ListTree className="h-4 w-4 text-zinc-400" aria-hidden="true" />
          Decision timeline
        </h2>
        {events.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-800 p-3 text-xs text-zinc-500">
            Every intervention and user decision is logged here.
          </p>
        ) : (
          <ol
            className="tp-scrollbar max-h-[260px] space-y-2.5 overflow-y-auto pr-1"
            data-testid="event-timeline"
          >
            {events.map((e) => (
              <li key={e.id} className="flex gap-2.5" data-testid="event-item">
                <span
                  className={cn(
                    "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                    TONE_DOT[e.tone] || TONE_DOT.info
                  )}
                />
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-medium text-zinc-200">{e.label}</span>
                    <span className="font-mono text-[10px] text-zinc-600">{e.time}</span>
                  </div>
                  {e.detail && (
                    <p className="text-[11px] leading-snug text-zinc-500">{e.detail}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </aside>
  );
};
