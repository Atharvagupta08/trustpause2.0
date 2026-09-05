import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp, Layers, Lock, EyeOff, CheckCircle2 } from "lucide-react";
import { ARCHITECTURE, PRIVACY_POINTS } from "@/lib/simData";
import { useSimulation } from "@/context/SimulationContext";
import { cn } from "@/lib/utils";

export const ArchitectureDrawer = () => {
  const [open, setOpen] = useState(false);
  const { fireCue } = useSimulation();

  return (
    <section
      className="tp-glass mt-6 rounded-2xl"
      data-testid="architecture-section"
    >
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          fireCue("tap");
        }}
        aria-expanded={open}
        aria-controls="architecture-drawer"
        data-testid="architecture-drawer-toggle"
        className="tp-focus flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left transition-colors duration-150 hover:bg-zinc-900/70"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300">
          <Layers className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span
            className="block text-sm font-semibold text-zinc-100"
            style={{ fontFamily: '"Space Grotesk", ui-sans-serif' }}
          >
            How this ships on Android &amp; iOS
          </span>
          <span className="block text-[11px] text-zinc-500">
            Platform-approved hooks only &middot; no 24/7 background screen recording
          </span>
        </span>
        <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-300 sm:inline-flex">
          <EyeOff className="h-3 w-3" aria-hidden="true" />
          Privacy preserving
        </span>
        <ChevronUp
          className={cn(
            "h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200",
            open ? "rotate-0" : "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="architecture-drawer"
            data-testid="architecture-drawer"
            key="drawer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-zinc-800 p-4">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {ARCHITECTURE.map((a) => (
                  <article
                    key={a.id}
                    data-testid={`architecture-card-${a.id}`}
                    className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2 py-[1px] text-[10px] uppercase tracking-wider text-zinc-400">
                        {a.platform}
                      </span>
                      <Lock className="h-3.5 w-3.5 text-zinc-600" aria-hidden="true" />
                    </div>
                    <h3
                      className="text-sm font-semibold text-zinc-100"
                      style={{ fontFamily: '"Space Grotesk", ui-sans-serif' }}
                    >
                      {a.title}
                    </h3>
                    <p className="mt-1 break-words font-mono text-[10px] leading-snug text-emerald-300/80">
                      {a.api}
                    </p>
                    <p className="mt-2 text-[11px] leading-relaxed text-zinc-400">{a.body}</p>
                    <ul className="mt-3 space-y-1">
                      {a.signals.map((s) => (
                        <li key={s} className="flex items-start gap-1.5 text-[11px] text-zinc-500">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>

              <div
                className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4"
                data-testid="privacy-callout"
              >
                <h3
                  className="flex items-center gap-2 text-sm font-semibold text-emerald-200"
                  style={{ fontFamily: '"Space Grotesk", ui-sans-serif' }}
                >
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                  What TrustPause never does
                </h3>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {PRIVACY_POINTS.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-[11px] leading-relaxed text-emerald-100/80">
                      <CheckCircle2 className="mt-[1px] h-3.5 w-3.5 shrink-0 text-emerald-400" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
