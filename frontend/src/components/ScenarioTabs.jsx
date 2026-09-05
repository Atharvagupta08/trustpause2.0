import React from "react";
import { SCENARIOS } from "@/lib/simData";
import { useSimulation } from "@/context/SimulationContext";
import { cn } from "@/lib/utils";

export const ScenarioTabs = () => {
  const { scenarioId, selectScenario } = useSimulation();

  return (
    <div
      role="tablist"
      aria-label="Attack simulations"
      data-testid="scenario-tabs"
      className="grid grid-cols-2 gap-2 lg:grid-cols-4"
    >
      {SCENARIOS.map((s) => {
        const active = s.id === scenarioId;
        const Icon = s.icon;
        return (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={active}
            data-testid={s.testId}
            data-active={active}
            onClick={() => selectScenario(s.id)}
            className={cn(
              "tp-focus group relative flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left",
              "transition-colors duration-150",
              active
                ? "border-emerald-500/40 bg-zinc-900 text-zinc-50"
                : "border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/70"
            )}
          >
            <div className="flex w-full items-center justify-between gap-2">
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-lg border",
                  active
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border-zinc-800 bg-zinc-950 text-zinc-400"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span
                className={cn(
                  "rounded-full border px-2 py-[1px] text-[10px] font-medium",
                  s.badge === "Critical"
                    ? "border-red-500/25 bg-red-500/10 text-red-300"
                    : "border-amber-500/25 bg-amber-500/10 text-amber-200"
                )}
              >
                {s.badge}
              </span>
            </div>
            <span
              className="text-[13px] font-semibold leading-tight"
              style={{ fontFamily: '"Space Grotesk", ui-sans-serif' }}
            >
              {s.short}
            </span>
            <span className="text-[11px] leading-snug text-zinc-500">{s.vector}</span>
            {active && (
              <span className="absolute inset-x-3 -bottom-[1px] h-[2px] rounded-full bg-emerald-400/80" />
            )}
          </button>
        );
      })}
    </div>
  );
};
