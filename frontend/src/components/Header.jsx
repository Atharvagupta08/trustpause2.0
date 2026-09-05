import React from "react";
import {
  ShieldCheck,
  Monitor,
  Smartphone,
  RotateCcw,
  Volume2,
  VolumeX,
  Activity,
} from "lucide-react";
import { RiskGauge } from "@/components/RiskGauge";
import { useSimulation } from "@/context/SimulationContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATUS_META = {
  monitoring: { label: "Ambient monitoring", cls: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300" },
  intervening: { label: "Intervention active", cls: "border-red-500/25 bg-red-500/10 text-red-300" },
  blocked: { label: "Threat blocked", cls: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300" },
  overridden: { label: "User override logged", cls: "border-amber-500/25 bg-amber-500/10 text-amber-200" },
};

export const Header = () => {
  const { risk, viewMode, setViewMode, muted, toggleMuted, resetSimulation, status, lastCue } =
    useSimulation();
  const st = STATUS_META[status] || STATUS_META.monitoring;

  return (
    <header
      className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60"
      data-testid="app-header"
    >
      <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-emerald-500/30 bg-emerald-500/10">
              <ShieldCheck className="h-5 w-5 text-emerald-400" aria-hidden="true" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <div className="leading-tight">
              <div
                className="text-[17px] font-semibold tracking-tight text-zinc-50 sm:text-lg"
                style={{ fontFamily: '"Space Grotesk", ui-sans-serif' }}
                data-testid="app-title"
              >
                TrustPause <span className="text-emerald-400">2.0</span>
              </div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 sm:text-xs">
                Ambient Human Firewall
              </div>
            </div>
          </div>

          <div className="xl:hidden">
            <RiskGauge value={risk} size={44} stroke={5} compact testId="risk-gauge-mobile" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="hidden xl:block">
            <RiskGauge value={risk} size={56} stroke={6} />
          </div>

          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
              st.cls
            )}
            data-testid="status-chip"
          >
            <Activity className="h-3 w-3" aria-hidden="true" />
            {st.label}
          </span>

          <div
            className="flex items-center rounded-xl border border-zinc-800 bg-zinc-900/70 p-1"
            role="group"
            aria-label="View mode"
            data-testid="view-toggle"
          >
            {[
              { id: "desktop", label: "Desktop Dashboard", short: "Desktop", Icon: Monitor },
              { id: "phone", label: "Phone Frame Simulator", short: "Phone", Icon: Smartphone },
            ].map(({ id, label, short, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setViewMode(id)}
                aria-pressed={viewMode === id}
                title={label}
                data-testid={`view-toggle-${id}`}
                className={cn(
                  "tp-focus inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium",
                  "transition-colors duration-150",
                  viewMode === id
                    ? "bg-zinc-800 text-zinc-50 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]"
                    : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">{short}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={toggleMuted}
            aria-pressed={!muted}
            title={muted ? "Enable sound & haptic cues" : "Mute sound & haptic cues"}
            data-testid="mute-cues-toggle"
            className={cn(
              "tp-focus relative inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-2 text-xs font-medium transition-colors duration-150",
              muted
                ? "border-zinc-800 bg-zinc-900/70 text-zinc-400 hover:text-zinc-200"
                : "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
            )}
          >
            {muted ? (
              <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">Cues</span>
            {lastCue && !muted && (
              <span
                className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400"
                data-testid="cue-indicator"
                aria-hidden="true"
              />
            )}
          </button>

          <Button
            type="button"
            onClick={resetSimulation}
            data-testid="reset-simulation-button"
            className="tp-focus h-9 rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 text-xs font-medium text-zinc-200 hover:bg-zinc-800 hover:text-white"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Reset Simulation
          </Button>
        </div>
      </div>
    </header>
  );
};
