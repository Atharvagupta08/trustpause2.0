import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Radio, ShieldHalf } from "lucide-react";
import "@/App.css";
import { SimulationProvider, useSimulation } from "@/context/SimulationContext";
import { Header } from "@/components/Header";
import { ScenarioTabs } from "@/components/ScenarioTabs";
import { TelemetryPanel } from "@/components/TelemetryPanel";
import { ArchitectureDrawer } from "@/components/ArchitectureDrawer";
import { PhoneFrame } from "@/components/PhoneFrame";
import { SmsPhishing } from "@/components/scenarios/SmsPhishing";
import { UpiTransfer } from "@/components/scenarios/UpiTransfer";
import { ImpersonationCall } from "@/components/scenarios/ImpersonationCall";
import { DeepfakeVoice } from "@/components/scenarios/DeepfakeVoice";
import { cn } from "@/lib/utils";

const SCENARIO_COMPONENTS = {
  sms: SmsPhishing,
  upi: UpiTransfer,
  call: ImpersonationCall,
  deepfake: DeepfakeVoice,
};

const Stage = () => {
  const { scenarioId, scenario, viewMode, resetKey } = useSimulation();
  const Active = SCENARIO_COMPONENTS[scenarioId];

  const body = (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${scenarioId}-${resetKey}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <Active />
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div data-testid="scenario-stage" data-view-mode={viewMode} className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2
            className="text-lg font-semibold tracking-tight text-zinc-50 sm:text-xl"
            style={{ fontFamily: '"Space Grotesk", ui-sans-serif' }}
            data-testid="scenario-title"
          >
            {scenario.label}
          </h2>
          <p className="mt-0.5 max-w-[52ch] text-[12px] leading-relaxed text-zinc-500">
            {scenario.blurb}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/70 px-2.5 py-1 text-[10px] text-zinc-400">
          <Radio className="h-3 w-3 text-emerald-400" aria-hidden="true" />
          <span className="font-mono">{scenario.vector}</span>
        </span>
      </div>

      {viewMode === "phone" ? (
        <PhoneFrame>{body}</PhoneFrame>
      ) : (
        <div className="tp-card-shadow overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
          <div className="relative min-h-[620px]">{body}</div>
        </div>
      )}
    </div>
  );
};

const Shell = () => {
  const { viewMode } = useSimulation();

  return (
    <div className="tp-grid-bg min-h-screen bg-zinc-950 text-zinc-100">
      <Header />

      <main className="mx-auto max-w-[1280px] px-4 pb-14 pt-5 sm:px-6 lg:px-8">
        <section className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-emerald-500/25 bg-emerald-500/10">
            <ShieldHalf className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          </span>
          <p className="min-w-0 flex-1 text-[12px] leading-relaxed text-zinc-400">
            <span className="font-medium text-zinc-200">Deliberate friction, not blocking.</span>{" "}
            TrustPause sits between a scammer&rsquo;s script and your reflex &mdash; a 10 second
            pause, a 3 second hold, a verified alternative. Pick a simulation and act like you would
            in real life.
          </p>
        </section>

        <div className="mb-5">
          <ScenarioTabs />
        </div>

        <div
          className={cn(
            "gap-6",
            viewMode === "desktop" ? "lg:grid lg:grid-cols-12" : "lg:grid lg:grid-cols-12"
          )}
        >
          <div className={viewMode === "desktop" ? "lg:col-span-8" : "lg:col-span-7"}>
            <Stage />
          </div>
          <div className={cn("mt-6 lg:mt-0", viewMode === "desktop" ? "lg:col-span-4" : "lg:col-span-5")}>
            <TelemetryPanel />
          </div>
        </div>

        <ArchitectureDrawer />

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800/80 pt-4 text-[11px] text-zinc-600">
          <span>
            TrustPause 2.0 &middot; interactive prototype. All scenarios are simulated on-device.
          </span>
          <span className="font-mono">No real SMS, calls, payments or audio are involved.</span>
        </footer>
      </main>
    </div>
  );
};

function App() {
  return (
    <SimulationProvider>
      <Shell />
    </SimulationProvider>
  );
}

export default App;
