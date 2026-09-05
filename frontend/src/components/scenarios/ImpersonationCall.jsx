import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  PhoneIncoming,
  PhoneOff,
  ShieldCheck,
  BadgeAlert,
  Globe,
  EyeOff,
  Siren,
  PhoneCall,
  Mic,
  AlertTriangle,
} from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";
import { AppChrome, OutcomeCard, Reason, btn } from "@/components/scenarios/shared";
import { cn } from "@/lib/utils";

const SIGNALS = [
  {
    id: "voip-unverified",
    label: "Unverified VoIP caller",
    detail: "Call originates from an internet gateway with a spoofed Indian CLI.",
    weight: 30,
    tone: "danger",
  },
  {
    id: "authority-claim",
    label: "Authority impersonation",
    detail: "Claims to be CBI / Cyber Crime Branch on a first-ever contact.",
    weight: 25,
    tone: "danger",
  },
  {
    id: "secrecy-request",
    label: "Secrecy request detected",
    detail: '"Do not disconnect, do not tell your family" \u2014 classic isolation script.',
    weight: 27,
    tone: "danger",
  },
  {
    id: "no-callback",
    label: "Number absent from official directory",
    detail: "No match in the published helpline registry (1930 / 112).",
    weight: 18,
    tone: "warn",
  },
];

const TRANSCRIPT = [
  "This is Inspector Verma, CBI Cyber Crime Branch.",
  "A parcel in your name contains illegal items.",
  "Do not disconnect this call. Do not tell your family.",
  "Stay on video until the verification deposit is made.",
];

export const ImpersonationCall = () => {
  const { applyRisk, setSignals, logEvent, fireCue, scenario } = useSimulation();
  const [phase, setPhase] = useState("idle"); // idle | ringing | answered | ended | verified
  const [showRiskCard, setShowRiskCard] = useState(false);
  const [lines, setLines] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const timers = useRef([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t) || clearInterval(t));
    timers.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const startCall = () => {
    clearTimers();
    setLines([]);
    setElapsed(0);
    setPhase("ringing");
    setSignals(SIGNALS.slice(0, 2));
    applyRisk(74, { cue: "call", status: "intervening" });
    logEvent("Incoming call screened", "CallScreeningService flagged an unverified VoIP caller", "danger");
    timers.current.push(
      setTimeout(() => {
        setShowRiskCard(true);
        setSignals(SIGNALS.slice(0, 3));
        applyRisk(82, { cue: "danger", status: "intervening" });
        logEvent("Live Call Risk Card shown", "Authority impersonation + secrecy markers", "danger");
      }, 900)
    );
  };

  const answer = () => {
    setPhase("answered");
    setShowRiskCard(true);
    setSignals(SIGNALS);
    applyRisk(95, { cue: "danger", status: "intervening" });
    logEvent("Call answered", "On-device speech markers now scoring the conversation", "danger");
    TRANSCRIPT.forEach((line, i) => {
      timers.current.push(setTimeout(() => setLines((l) => [...l, line]), 700 * (i + 1)));
    });
    timers.current.push(setInterval(() => setElapsed((e) => e + 1), 1000));
  };

  const endAndReport = () => {
    clearTimers();
    setPhase("ended");
    setShowRiskCard(false);
    setSignals([]);
    applyRisk(5, { cue: "safe", status: "blocked" });
    logEvent("Call ended & reported", "Number submitted to 1930 cybercrime reporting", "safe");
  };

  const verifyHelpline = () => {
    clearTimers();
    setPhase("verified");
    setShowRiskCard(false);
    setSignals(SIGNALS.slice(3));
    applyRisk(12, { cue: "safe", status: "blocked" });
    logEvent("Verified via official helpline", "Outbound call to 1930 from the OS dialler", "safe");
  };

  const replay = () => {
    clearTimers();
    setPhase("idle");
    setShowRiskCard(false);
    setLines([]);
    setElapsed(0);
    setSignals([]);
    applyRisk(scenario.baseRisk, { cue: "tap", status: "monitoring" });
    logEvent("Simulation replayed", scenario.label, "info");
  };

  const ringing = phase === "ringing";
  const answered = phase === "answered";

  return (
    <div className="relative min-h-[620px]" data-testid="scenario-call">
      <AppChrome
        icon={PhoneIncoming}
        title="Phone"
        subtitle="Screened by TrustPause"
        accent="red"
        right={
          <span className="shrink-0 rounded-full border border-zinc-800 bg-zinc-950 px-2 py-[2px] font-mono text-[10px] text-zinc-400">
            CallScreening
          </span>
        }
      />

      <div className="space-y-4 p-4">
        {phase === "idle" && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-zinc-800 bg-zinc-950">
              <PhoneIncoming className="h-6 w-6 text-zinc-400" aria-hidden="true" />
            </div>
            <h3
              className="mt-3 text-sm font-semibold text-zinc-100"
              style={{ fontFamily: '"Space Grotesk", ui-sans-serif' }}
            >
              Simulate a &ldquo;digital arrest&rdquo; call
            </h3>
            <p className="mx-auto mt-1 max-w-[300px] text-[11px] leading-relaxed text-zinc-500">
              TrustPause scores the call before your phone even rings, using the platform call
              screening service. No audio is recorded.
            </p>
            <button
              type="button"
              onClick={startCall}
              data-testid="start-call-button"
              className={cn(btn.danger, "mt-4")}
            >
              <Siren className="h-4 w-4" aria-hidden="true" />
              Trigger Incoming Call
            </button>
          </div>
        )}

        {(ringing || answered) && (
          <div
            className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-zinc-950 p-5 text-center"
            data-testid="incoming-call-card"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-red-500/10" />
            <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-full border border-red-500/40 bg-red-500/10">
              {ringing && (
                <span className="tp-pulse absolute inset-0 rounded-full border border-red-500/50" />
              )}
              <BadgeAlert className="h-7 w-7 text-red-400" aria-hidden="true" />
            </div>
            <div className="relative mt-3">
              <div className="text-[10px] uppercase tracking-[0.16em] text-red-300/80">
                {ringing ? "Incoming call \u00b7 screened" : `On call \u00b7 ${elapsed}s`}
              </div>
              <div
                className="mt-1 text-lg font-semibold text-zinc-50"
                style={{ fontFamily: '"Space Grotesk", ui-sans-serif' }}
                data-testid="caller-name"
              >
                &ldquo;CBI Cyber Crime Branch&rdquo;
              </div>
              <div className="font-mono text-[12px] text-zinc-400">+91 92xxx xxx41</div>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-red-500/25 bg-red-500/10 px-2.5 py-1 text-[10px] text-red-300">
                <Globe className="h-3 w-3" aria-hidden="true" />
                Unverified VoIP &middot; not an official number
              </div>
            </div>

            {ringing && (
              <div className="relative mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={endAndReport}
                  data-testid="decline-call-button"
                  className={btn.danger}
                >
                  <PhoneOff className="h-4 w-4" aria-hidden="true" />
                  Decline
                </button>
                <button
                  type="button"
                  onClick={answer}
                  data-testid="answer-call-button"
                  className={btn.ghost}
                >
                  <PhoneCall className="h-4 w-4" aria-hidden="true" />
                  Answer anyway
                </button>
              </div>
            )}

            {answered && (
              <div
                className="relative mt-4 rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 text-left"
                data-testid="call-transcript"
              >
                <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                  <Mic className="h-3 w-3" aria-hidden="true" />
                  On-device speech markers
                </div>
                <ul className="space-y-1.5">
                  {lines.map((l, i) => (
                    <li
                      key={`${i}-${l}`}
                      className="rounded-lg bg-zinc-950/60 px-2.5 py-1.5 text-[11px] leading-snug text-zinc-300"
                    >
                      {l}
                    </li>
                  ))}
                  {lines.length < TRANSCRIPT.length && (
                    <li className="px-2.5 text-[11px] text-zinc-600">listening&hellip;</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        {showRiskCard && (
          <div
            className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.08] p-4"
            data-testid="call-risk-card"
            role="status"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-amber-500/30 bg-amber-500/10">
                <AlertTriangle className="h-4 w-4 text-amber-300" aria-hidden="true" />
              </span>
              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-amber-300/80">
                  Live Call Risk Card
                </div>
                <h3
                  className="text-sm font-semibold text-amber-100"
                  style={{ fontFamily: '"Space Grotesk", ui-sans-serif' }}
                >
                  No Indian agency arrests anyone over a video call.
                </h3>
              </div>
            </div>

            <ul className="mt-3 space-y-1.5 border-t border-amber-500/15 pt-3">
              <Reason>Unverified VoIP caller with a spoofed local number.</Reason>
              <Reason>
                Secrecy request detected &mdash; &ldquo;don&rsquo;t tell your family&rdquo;.
              </Reason>
              <Reason tone="warn">Number is not in the official helpline directory.</Reason>
            </ul>

            <div className="mt-3 flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950/50 px-2.5 py-2">
              <EyeOff className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden="true" />
              <span className="text-[10px] leading-snug text-zinc-500">
                Metadata + on-device classifier only. The call audio never leaves your phone and is
                never stored.
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <button
                type="button"
                onClick={endAndReport}
                data-testid="end-call-report-button"
                className={btn.danger}
              >
                <PhoneOff className="h-4 w-4" aria-hidden="true" />
                End Call &amp; Report
              </button>
              <button
                type="button"
                onClick={verifyHelpline}
                data-testid="verify-helpline-button"
                className={btn.safe}
              >
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Verify via Official Helpline
              </button>
            </div>
          </div>
        )}

        {phase === "ended" && (
          <OutcomeCard
            testId="call-outcome-ended"
            tone="safe"
            icon={PhoneOff}
            title="Call ended and reported"
            body="The number was blocked on-device and an anonymised report was queued for the 1930 cybercrime helpline."
            bullets={[
              "Caller blocklisted for this device",
              "Report queued for 1930 / cybercrime.gov.in",
              "Risk score returned to ambient baseline",
            ]}
            onReplay={replay}
          />
        )}

        {phase === "verified" && (
          <OutcomeCard
            testId="call-outcome-verified"
            tone="safe"
            icon={ShieldCheck}
            title="Verified through the official helpline"
            body="TrustPause dialled 1930 from the system dialler &mdash; a number the caller could not supply or intercept. No case exists against you."
            bullets={[
              "Outbound verification, never inbound trust",
              "Official directory number used (1930)",
              "Impersonation attempt logged",
            ]}
            onReplay={replay}
          />
        )}
      </div>
    </div>
  );
};
