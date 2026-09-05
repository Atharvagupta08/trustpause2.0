import React, { useCallback, useEffect, useState } from "react";
import {
  MessageSquareWarning,
  ShieldAlert,
  Building2,
  Link2Off,
  Clock,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";
import { useCountdown } from "@/hooks/useCountdown";
import { StageOverlay, OverlayHeader } from "@/components/StageOverlay";
import { AppChrome, OutcomeCard, Reason, btn } from "@/components/scenarios/shared";

const SIGNALS = [
  {
    id: "lookalike-domain",
    label: "Look-alike domain",
    detail: "hdfc-secure-verify.example is not an HDFC Bank owned domain.",
    weight: 30,
    tone: "danger",
  },
  {
    id: "domain-age",
    label: "Domain registered 2 days ago",
    detail: "No TLS history, hosted on a bulk shared IP.",
    weight: 20,
    tone: "danger",
  },
  {
    id: "urgency-deadline",
    label: "Artificial deadline (10 minutes)",
    detail: "Banks never enforce a countdown for KYC updates.",
    weight: 15,
    tone: "warn",
  },
  {
    id: "unverified-sender",
    label: "Unverified sender header",
    detail: "Sender ID VM-HDFCBK failed DLT template match.",
    weight: 13,
    tone: "warn",
  },
];

export const SmsPhishing = () => {
  const { applyRisk, setSignals, logEvent, fireCue, scenario } = useSimulation();
  const [phase, setPhase] = useState("idle"); // idle | intervention | safe | reported | overridden
  const [shake, setShake] = useState(false);

  const countdown = useCountdown({
    seconds: 10,
    onTick: () => fireCue("tick"),
    onComplete: () => logEvent("Pause completed", "10s reflection window elapsed", "warn"),
  });

  const openIntervention = useCallback(() => {
    setPhase("intervention");
    setShake(true);
    setTimeout(() => setShake(false), 560);
    setSignals(SIGNALS);
    applyRisk(78, { cue: "danger", status: "intervening" });
    logEvent("Link intercepted", "hdfc-secure-verify.example held by TrustPause", "danger");
    countdown.start(10);
  }, [applyRisk, setSignals, logEvent, countdown]);

  const replay = () => {
    setPhase("idle");
    countdown.reset(10);
    setSignals([]);
    applyRisk(scenario.baseRisk, { cue: "tap", status: "monitoring" });
    logEvent("Simulation replayed", scenario.label, "info");
  };

  useEffect(() => () => countdown.reset(10), []); // eslint-disable-line react-hooks/exhaustive-deps

  const ringPct = countdown.progress;
  const R = 40;
  const C = 2 * Math.PI * R;

  return (
    <div className="relative min-h-[620px]" data-testid="scenario-sms">
      <AppChrome
        icon={MessageSquareWarning}
        title="VM-HDFCBK"
        subtitle="SMS &middot; Unverified sender"
        accent="amber"
        right={
          <span className="shrink-0 rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-[2px] text-[10px] text-amber-200">
            Not in contacts
          </span>
        }
      />

      <div className="space-y-3 p-4">
        <div className="text-center text-[10px] uppercase tracking-[0.16em] text-zinc-600">
          Today &middot; 09:38
        </div>

        <div className="max-w-[92%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.06] p-3.5 backdrop-blur">
          <p className="text-[13px] leading-relaxed text-zinc-100">
            Bank account blocked in 10 mins. Update KYC:{" "}
            <button
              type="button"
              onClick={openIntervention}
              data-testid="sms-link"
              className="tp-focus break-all rounded font-mono text-[12px] text-sky-400 underline decoration-sky-400/50 underline-offset-2 transition-colors duration-150 hover:text-sky-300"
            >
              https://hdfc-secure-verify.example
            </button>
          </p>
          <div className="mt-2.5 flex items-center gap-2 border-t border-zinc-800 pt-2.5">
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-950 px-2 py-[2px] text-[10px] text-zinc-400">
              <Clock className="h-2.5 w-2.5" aria-hidden="true" />
              09:38
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-red-500/25 bg-red-500/10 px-2 py-[2px] text-[10px] text-red-300">
              <ShieldAlert className="h-2.5 w-2.5" aria-hidden="true" />
              TrustPause is watching this link
            </span>
          </div>
        </div>

        {phase === "idle" && (
          <div className="rounded-xl border border-dashed border-zinc-800 p-3">
            <p className="text-[11px] leading-relaxed text-zinc-500">
              Tap the link exactly as a rushed user would. TrustPause intercepts it at the OS link
              handler before any page loads.
            </p>
          </div>
        )}

        {phase === "safe" && (
          <OutcomeCard
            testId="sms-outcome-safe"
            tone="safe"
            icon={ShieldCheck}
            title="Official HDFC Bank app opened"
            body="TrustPause routed you to the verified banking app installed on this device. The phishing page was never loaded."
            bullets={[
              "Phishing URL blocked at the link handler",
              "Sender reported to the DLT abuse registry",
              "Risk score returned to ambient baseline",
            ]}
            onReplay={replay}
          />
        )}

        {phase === "reported" && (
          <OutcomeCard
            testId="sms-outcome-reported"
            tone="safe"
            icon={Trash2}
            title="SMS reported and deleted"
            body="The message was removed and the sender ID was submitted to your operator's smishing feed."
            bullets={["Sender ID blocklisted on-device", "Anonymous report queued for the operator"]}
            onReplay={replay}
          />
        )}

        {phase === "overridden" && (
          <OutcomeCard
            testId="sms-outcome-overridden"
            tone="danger"
            icon={AlertTriangle}
            title="Override recorded &mdash; this is what a scam page would do next"
            body="In the real world the page would now ask for your card number, CVV and the OTP that authorises a full-limit debit."
            bullets={[
              "Credential harvesting form (card + CVV + PIN)",
              "OTP relay to a live attacker session",
              "Device binding request for future silent debits",
            ]}
            onReplay={replay}
          />
        )}
      </div>

      <StageOverlay
        open={phase === "intervention"}
        testId="intervention-modal"
        label="TrustPause intervention"
        tone="danger"
        onEscape={() => {}}
        className={shake ? "tp-shake" : undefined}
      >
        <OverlayHeader
          icon={ShieldAlert}
          tone="danger"
          eyebrow="TrustPause intervention"
          title="Hold on. This link is not your bank."
        />

        <div className="mt-4 grid place-items-center">
          <div className="relative grid h-24 w-24 place-items-center rounded-full border border-zinc-800 bg-zinc-950">
            <svg width={96} height={96} className="absolute -rotate-90" aria-hidden="true">
              <circle cx={48} cy={48} r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={6} />
              <circle
                cx={48}
                cy={48}
                r={R}
                fill="none"
                stroke={countdown.done ? "#34d399" : "#f87171"}
                strokeWidth={6}
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * ringPct}
              />
            </svg>
            <span
              className="text-2xl font-semibold tabular-nums text-zinc-50"
              style={{ fontFamily: '"Space Grotesk", ui-sans-serif' }}
              data-testid="intervention-countdown"
              aria-live={countdown.secondsLeft <= 3 ? "assertive" : "polite"}
            >
              {countdown.secondsLeft}
            </span>
          </div>
          <p className="mt-2 text-center text-[11px] text-zinc-500" data-testid="pause-caption">
            {countdown.done
              ? "Pause complete. Decide with a clear head."
              : "A 10 second pause is enough to break the panic loop."}
          </p>
        </div>

        <div className="mt-3" data-testid="countdown-bar-wrap">
          <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-zinc-500">
            <span>Reflection window</span>
            <span className="font-mono tabular-nums text-zinc-400">
              {countdown.secondsLeft}s / 10s
            </span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-zinc-800"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(countdown.progress * 100)}
            data-testid="countdown-bar"
          >
            <div
              className={countdown.done ? "h-full rounded-full bg-emerald-400" : "h-full rounded-full bg-red-400"}
              style={{ width: `${countdown.progress * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3" data-testid="domain-mismatch">
          <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Domain mismatch</div>
          <div className="mt-2 flex items-center gap-2">
            <Link2Off className="h-3.5 w-3.5 shrink-0 text-red-400" aria-hidden="true" />
            <span className="break-all font-mono text-[12px] text-red-300 underline decoration-red-500/60 decoration-wavy underline-offset-2">
              hdfc-secure-verify.example
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" aria-hidden="true" />
            <span className="font-mono text-[12px] text-emerald-300">hdfcbank.com</span>
            <span className="text-[10px] text-zinc-500">&larr; the only official domain</span>
          </div>
          <ul className="mt-3 space-y-1.5 border-t border-zinc-800 pt-2.5">
            <Reason>Brand name used as a subdomain prefix, not as the registered domain.</Reason>
            <Reason>Domain registered 2 days ago with no certificate history.</Reason>
            <Reason tone="warn">&ldquo;Blocked in 10 mins&rdquo; is a manufactured deadline.</Reason>
          </ul>
        </div>

        <div className="mt-4 space-y-2">
          <button
            type="button"
            data-testid="intervention-safe-cta"
            className={btn.safe}
            onClick={() => {
              countdown.reset(10);
              setPhase("safe");
              setSignals(SIGNALS.slice(0, 2));
              applyRisk(8, { cue: "safe", status: "blocked" });
              logEvent("Safe path taken", "Opened official bank app instead", "safe");
            }}
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Open Official Bank App
          </button>

          <button
            type="button"
            data-testid="intervention-report-button"
            className={btn.ghost}
            onClick={() => {
              countdown.reset(10);
              setPhase("reported");
              setSignals([]);
              applyRisk(6, { cue: "safe", status: "blocked" });
              logEvent("SMS reported", "Sender VM-HDFCBK blocklisted", "safe");
            }}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Report &amp; Delete SMS
          </button>

          <button
            type="button"
            disabled={!countdown.done}
            data-testid="intervention-open-anyway"
            className={`${btn.subtle} disabled:cursor-not-allowed disabled:opacity-40`}
            onClick={() => {
              setPhase("overridden");
              applyRisk(92, { cue: "unlock", status: "overridden" });
              logEvent("Override after pause", "User chose to open the flagged link", "danger");
            }}
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            {countdown.done
              ? "Open link anyway (logged)"
              : `Open anyway unlocks in ${countdown.secondsLeft}s`}
          </button>
        </div>
      </StageOverlay>
    </div>
  );
};
