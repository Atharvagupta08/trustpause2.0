import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AudioLines,
  Play,
  Pause,
  Zap,
  HeartCrack,
  EyeOff,
  Waves,
  ShieldCheck,
  Ban,
  KeyRound,
  AlertTriangle,
} from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";
import { OutcomeCard, AppChrome, btn } from "@/components/scenarios/shared";
import { playVoiceSample, stopVoiceSample } from "@/lib/feedback";
import { cn } from "@/lib/utils";

const FACTORS = [
  {
    id: "urgency",
    label: "Urgency",
    weight: 15,
    icon: Zap,
    tone: "warn",
    quote: '"I need the money in the next ten minutes."',
    detail: "Compressed decision window, repeated time pressure.",
  },
  {
    id: "fear",
    label: "Fear",
    weight: 20,
    icon: HeartCrack,
    tone: "danger",
    quote: '"I\'ve had an accident, they won\'t treat me without cash."',
    detail: "Threat-to-loved-one framing, distress prosody.",
  },
  {
    id: "secrecy",
    label: "Secrecy",
    weight: 20,
    icon: EyeOff,
    tone: "danger",
    quote: '"Don\'t tell mummy, don\'t call anyone else."',
    detail: "Explicit instruction to isolate the victim.",
  },
  {
    id: "synthetic",
    label: "Synthetic markers",
    weight: 30,
    icon: Waves,
    tone: "danger",
    quote: "Spectral analysis \u00b7 on-device classifier",
    detail: "Flat micro-prosody, absent breath noise, 22.05kHz vocoder artefacts.",
  },
];

const BAR_HEIGHTS = [
  22, 46, 68, 34, 82, 58, 92, 40, 66, 30, 74, 52, 88, 36, 60, 26, 78, 48, 96, 42, 70, 32, 84, 54,
  62, 28, 90, 44, 72, 38, 80, 50, 64, 24, 86, 56, 76, 34, 68, 46,
];

export const DeepfakeVoice = () => {
  const { applyRisk, setSignals, logEvent, fireCue, scenario, muted } = useSimulation();
  const [playing, setPlaying] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle | analysed | verified | blocked
  const timers = useRef([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(
    () => () => {
      clearTimers();
      stopVoiceSample();
    },
    [clearTimers]
  );

  const total = FACTORS.slice(0, revealed).reduce((a, f) => a + f.weight, 0);
  const interventionActive = total >= 70;

  const runAnalysis = () => {
    clearTimers();
    setRevealed(0);
    logEvent("Audio sample analysed", "On-device cognitive + spectral scoring started", "warn");
    FACTORS.forEach((f, i) => {
      timers.current.push(
        setTimeout(() => {
          const running = FACTORS.slice(0, i + 1).reduce((a, x) => a + x.weight, 0);
          setRevealed(i + 1);
          setSignals(
            FACTORS.slice(0, i + 1).map((x) => ({
              id: x.id,
              label: x.label,
              detail: x.detail,
              weight: x.weight,
              tone: x.tone,
            }))
          );
          applyRisk(running, {
            cue: i === FACTORS.length - 1 ? "danger" : "tick",
            status: running >= 70 ? "intervening" : "monitoring",
          });
          if (i === FACTORS.length - 1) {
            setPhase("analysed");
            setPlaying(false);
            stopVoiceSample();
            logEvent("Intervention triggered", "Total cognitive risk 85/100", "danger");
          }
        }, 700 * (i + 1))
      );
    });
  };

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      stopVoiceSample();
      clearTimers();
      logEvent("Playback paused", "Analysis halted", "info");
      return;
    }
    setPlaying(true);
    fireCue("tap");
    playVoiceSample();
    runAnalysis();
    timers.current.push(
      setTimeout(() => {
        setPlaying(false);
        stopVoiceSample();
      }, 3400)
    );
  };

  const replay = () => {
    clearTimers();
    stopVoiceSample();
    setPlaying(false);
    setRevealed(0);
    setPhase("idle");
    setSignals([]);
    applyRisk(scenario.baseRisk, { cue: "tap", status: "monitoring" });
    logEvent("Simulation replayed", scenario.label, "info");
  };

  return (
    <div className="relative min-h-[620px]" data-testid="scenario-deepfake">
      <AppChrome
        icon={AudioLines}
        title="Voice note · +91 88xxx xxx07"
        subtitle="WhatsApp &middot; unknown number"
        accent="amber"
        right={
          <span className="shrink-0 rounded-full border border-zinc-800 bg-zinc-950 px-2 py-[2px] font-mono text-[10px] text-zinc-400">
            0:12
          </span>
        }
      />

      <div className="space-y-4 p-4">
        <div
          className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4"
          data-testid="deepfake-audio-card"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3
                className="text-sm font-semibold text-zinc-100"
                style={{ fontFamily: '"Space Grotesk", ui-sans-serif' }}
              >
                Emergency cash request from cloned voice
              </h3>
              <p className="mt-0.5 text-[11px] text-zinc-500">
                Sounds like your son. Generated from 8 seconds of public video audio.
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-[2px] text-[10px] text-amber-200">
              Sample
            </span>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              data-testid="audio-play-toggle"
              aria-pressed={playing}
              aria-label={playing ? "Pause sample" : "Play sample"}
              className="tp-focus grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-500 text-zinc-950 transition-colors duration-150 hover:bg-emerald-400"
            >
              {playing ? (
                <Pause className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Play className="h-5 w-5" aria-hidden="true" />
              )}
            </button>

            <div
              className={cn(
                "flex h-12 flex-1 items-center gap-[3px] overflow-hidden",
                playing && "tp-wave-playing"
              )}
              data-testid="waveform"
              data-playing={playing}
              aria-hidden="true"
            >
              {BAR_HEIGHTS.map((h, i) => (
                <span
                  key={i}
                  className={cn(
                    "tp-wave-bar w-[3px] shrink-0 rounded-sm",
                    playing ? "bg-emerald-400/80" : "bg-zinc-700"
                  )}
                  style={{ height: `${h}%`, animationDelay: `${(i % 8) * 90}ms` }}
                />
              ))}
            </div>
          </div>

          <p className="mt-2 text-[10px] text-zinc-600" data-testid="audio-hint">
            {muted
              ? "Cues are muted \u2014 enable Cues in the header to hear the synthesised sample."
              : "Synthesised on the fly with WebAudio. No real person's voice is used."}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="flex items-center justify-between gap-2">
            <h3
              className="text-sm font-semibold text-zinc-100"
              style={{ fontFamily: '"Space Grotesk", ui-sans-serif' }}
            >
              Cognitive risk breakdown
            </h3>
            <span
              className={cn(
                "rounded-full border px-2 py-[2px] font-mono text-[11px]",
                interventionActive
                  ? "border-red-500/25 bg-red-500/10 text-red-300"
                  : "border-zinc-800 bg-zinc-950 text-zinc-400"
              )}
              data-testid="cognitive-risk-total"
              aria-live="polite"
            >
              {total}/100
            </span>
          </div>

          <ul className="mt-3 space-y-2.5">
            {FACTORS.map((f, i) => {
              const on = i < revealed;
              const Icon = f.icon;
              return (
                <li
                  key={f.id}
                  data-testid={`risk-factor-${f.id}`}
                  data-detected={on}
                  className={cn(
                    "rounded-xl border p-3",
                    on
                      ? f.tone === "danger"
                        ? "border-red-500/25 bg-red-500/[0.07]"
                        : "border-amber-500/25 bg-amber-500/[0.07]"
                      : "border-zinc-800 bg-zinc-950/40 opacity-60"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        on ? (f.tone === "danger" ? "text-red-400" : "text-amber-300") : "text-zinc-600"
                      )}
                      aria-hidden="true"
                    />
                    <span className="flex-1 text-[12px] font-medium text-zinc-200">{f.label}</span>
                    <span
                      className={cn(
                        "font-mono text-[11px]",
                        on ? (f.tone === "danger" ? "text-red-300" : "text-amber-200") : "text-zinc-600"
                      )}
                    >
                      +{f.weight}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        f.tone === "danger" ? "bg-red-400" : "bg-amber-400"
                      )}
                      style={{
                        width: on ? `${(f.weight / 30) * 100}%` : "0%",
                        transition: "width 420ms cubic-bezier(0.16,1,0.3,1)",
                      }}
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] italic leading-snug text-zinc-500">{f.quote}</p>
                </li>
              );
            })}
          </ul>

          {revealed === 0 && (
            <p className="mt-3 rounded-lg border border-dashed border-zinc-800 p-2.5 text-[11px] text-zinc-500">
              Press play to run the on-device analysis. Signals appear as they are detected.
            </p>
          )}
        </div>

        {interventionActive && phase === "analysed" && (
          <div
            className="rounded-2xl border border-red-500/30 bg-red-500/[0.08] p-4"
            data-testid="deepfake-intervention-banner"
            role="status"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-red-500/30 bg-red-500/10">
                <AlertTriangle className="h-4 w-4 text-red-400" aria-hidden="true" />
              </span>
              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-red-300/80">
                  Intervention active &middot; 85/100
                </div>
                <h3
                  className="text-sm font-semibold text-red-100"
                  style={{ fontFamily: '"Space Grotesk", ui-sans-serif' }}
                >
                  This voice is very likely synthetic.
                </h3>
                <p className="mt-1 text-[12px] leading-relaxed text-zinc-300">
                  Do not send money. Verify on a channel the caller cannot control.
                </p>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setPhase("verified");
                  applyRisk(12, { cue: "safe", status: "blocked" });
                  setSignals(FACTORS.slice(3).map((f) => ({ ...f })));
                  logEvent("Family code word used", "Out-of-band verification succeeded", "safe");
                }}
                data-testid="verify-code-word-button"
                className={btn.safe}
              >
                <KeyRound className="h-4 w-4" aria-hidden="true" />
                Verify with Family Code Word
              </button>
              <button
                type="button"
                onClick={() => {
                  setPhase("blocked");
                  applyRisk(8, { cue: "safe", status: "blocked" });
                  setSignals([]);
                  logEvent("Number blocked & reported", "Voice clone sample attached to report", "safe");
                }}
                data-testid="block-report-button"
                className={btn.ghost}
              >
                <Ban className="h-4 w-4" aria-hidden="true" />
                Block &amp; Report Number
              </button>
            </div>
          </div>
        )}

        {phase === "verified" && (
          <OutcomeCard
            testId="deepfake-outcome-verified"
            tone="safe"
            icon={ShieldCheck}
            title="Code word failed &mdash; caller was not your son"
            body="Your son answered his own saved number and was perfectly safe. The cloned voice could not produce the family code word."
            bullets={[
              "Out-of-band verification on a saved channel",
              "No money left your account",
              "Sample retained on-device for reporting",
            ]}
            onReplay={replay}
          />
        )}

        {phase === "blocked" && (
          <OutcomeCard
            testId="deepfake-outcome-blocked"
            tone="safe"
            icon={Ban}
            title="Number blocked and reported"
            body="The sender was blocked and the synthetic-voice verdict was attached to an anonymised report."
            bullets={["Sender blocklisted on-device", "Classifier verdict shared, audio never uploaded"]}
            onReplay={replay}
          />
        )}
      </div>
    </div>
  );
};
