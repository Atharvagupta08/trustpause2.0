import React, { useState } from "react";
import {
  IndianRupee,
  Lock,
  PhoneCall,
  XCircle,
  ShieldCheck,
  AlertTriangle,
  UserRoundX,
  Fingerprint,
} from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";
import { usePressHold } from "@/hooks/usePressHold";
import { StageOverlay, OverlayHeader } from "@/components/StageOverlay";
import { AppChrome, OutcomeCard, Reason, btn } from "@/components/scenarios/shared";

const SIGNALS = [
  {
    id: "first-time-payee",
    label: "First-time payee",
    detail: "rahul.kmr9284@okaxis has never received money from this device.",
    weight: 25,
    tone: "danger",
  },
  {
    id: "high-value",
    label: "6x your usual transfer size",
    detail: "\u20b918,000 vs a 90-day median of \u20b92,900.",
    weight: 20,
    tone: "danger",
  },
  {
    id: "secrecy-note",
    label: "Secrecy language in the note",
    detail: '"don\'t tell anyone" detected in the payment remark.',
    weight: 23,
    tone: "danger",
  },
  {
    id: "coached-entry",
    label: "Coached entry pattern",
    detail: "Amount pasted while an active call from an unknown number is in progress.",
    weight: 20,
    tone: "warn",
  },
];

export const UpiTransfer = () => {
  const { applyRisk, setSignals, logEvent, fireCue, scenario } = useSimulation();
  const [phase, setPhase] = useState("idle"); // idle | lock | overridden | verify | cancelled

  const hold = usePressHold({
    duration: 3000,
    onStart: () => {
      fireCue("hold");
      logEvent("Override hold started", "3 second deliberate-action gate", "warn");
    },
    onCancel: () => logEvent("Override released early", "Action Lock still engaged", "warn"),
    onComplete: () => {
      setPhase("overridden");
      applyRisk(96, { cue: "unlock", status: "overridden" });
      logEvent("Payment overridden", "\u20b918,000 sent to an unverified payee", "danger");
    },
  });

  const payNow = () => {
    setPhase("lock");
    hold.reset();
    setSignals(SIGNALS);
    applyRisk(88, { cue: "danger", status: "intervening" });
    logEvent("Action Lock engaged", "High-risk UPI transfer intercepted", "danger");
  };

  const replay = () => {
    setPhase("idle");
    hold.reset();
    setSignals([]);
    applyRisk(scenario.baseRisk, { cue: "tap", status: "monitoring" });
    logEvent("Simulation replayed", scenario.label, "info");
  };

  const holdPct = Math.round(hold.progress * 100);
  const secsLeft = Math.max(0, 3 - hold.progress * 3);

  return (
    <div className="relative min-h-[620px]" data-testid="scenario-upi">
      <AppChrome
        icon={IndianRupee}
        title="UPI Payment"
        subtitle="Axis Bank &middot; XXXX 4471"
        accent="emerald"
        right={
          <span className="shrink-0 rounded-full border border-zinc-800 bg-zinc-950 px-2 py-[2px] font-mono text-[10px] text-zinc-400">
            UPI 2.0
          </span>
        }
      />

      <div className="space-y-4 p-4">
        <div className="tp-glass rounded-2xl p-4 text-center">
          <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Paying</div>
          <div
            className="mt-1 flex items-center justify-center gap-1 text-3xl font-semibold text-zinc-50 sm:text-4xl"
            style={{ fontFamily: '"Space Grotesk", ui-sans-serif' }}
            data-testid="upi-amount"
          >
            <IndianRupee className="h-6 w-6 text-zinc-400" aria-hidden="true" />
            18,000
          </div>
          <div className="mt-3 space-y-1 border-t border-zinc-800 pt-3 text-left">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-zinc-500">To</span>
              <span className="break-all font-mono text-[12px] text-zinc-200" data-testid="upi-payee">
                rahul.kmr9284@okaxis
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-zinc-500">Name on record</span>
              <span className="inline-flex items-center gap-1 text-[12px] text-amber-200">
                <UserRoundX className="h-3 w-3" aria-hidden="true" />
                Not in your contacts
              </span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="shrink-0 text-[11px] text-zinc-500">Note</span>
              <span className="text-right text-[12px] italic text-zinc-300">
                &ldquo;Family emergency &ndash; don&rsquo;t tell anyone&rdquo;
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 p-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
          <p className="text-[11px] leading-snug text-amber-100">
            TrustPause is reading only the payment fields via a scoped accessibility event &mdash; no
            screen recording.
          </p>
        </div>

        {phase === "idle" && (
          <button type="button" onClick={payNow} data-testid="pay-now-button" className={btn.safe}>
            <Fingerprint className="h-4 w-4" aria-hidden="true" />
            Pay Now
          </button>
        )}

        {phase === "verify" && (
          <OutcomeCard
            testId="upi-outcome-verify"
            tone="safe"
            icon={PhoneCall}
            title="Calling Rahul on his saved number"
            body="TrustPause dialled the number already saved in your contacts &mdash; not the one supplied in the message. Rahul confirmed he never asked for money."
            bullets={[
              "Payment paused, not sent",
              "Saved-contact channel used for verification",
              "Impersonation attempt logged for reporting",
            ]}
            onReplay={replay}
          />
        )}

        {phase === "cancelled" && (
          <OutcomeCard
            testId="upi-outcome-cancelled"
            tone="safe"
            icon={ShieldCheck}
            title="Payment cancelled &mdash; ₹18,000 stayed in your account"
            body="The transfer was abandoned inside the Action Lock. Nothing left your bank."
            bullets={["Payee flagged as suspicious on-device", "Risk score returned to baseline"]}
            onReplay={replay}
          />
        )}

        {phase === "overridden" && (
          <OutcomeCard
            testId="upi-outcome-overridden"
            tone="danger"
            icon={AlertTriangle}
            title="₹18,000 sent &mdash; override recorded"
            body="You held the override for the full 3 seconds, so the payment went through. TrustPause never blocks you outright; it only makes the risky choice a deliberate one."
            bullets={[
              "Deliberate-action gate satisfied (3.0s hold)",
              "Payee retained on the suspicious list",
              "Dispute pack prepared for your bank",
            ]}
            onReplay={replay}
          />
        )}
      </div>

      <StageOverlay
        open={phase === "lock"}
        testId="action-lock-overlay"
        label="TrustPause action lock"
        tone="danger"
        onEscape={() => {}}
      >
        <OverlayHeader
          icon={Lock}
          tone="danger"
          eyebrow="Action Lock engaged"
          title="This transfer looks coached, not chosen."
        />

        <ul className="mt-4 space-y-1.5 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
          <Reason>First-time payee receiving ₹18,000 &mdash; 6x your usual transfer.</Reason>
          <Reason>Secrecy language detected: &ldquo;don&rsquo;t tell anyone&rdquo;.</Reason>
          <Reason tone="warn">Amount entered while an unknown caller is on the line.</Reason>
        </ul>

        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={() => {
              setPhase("verify");
              setSignals(SIGNALS.slice(0, 1));
              applyRisk(14, { cue: "safe", status: "blocked" });
              logEvent("Verification call placed", "Dialled the saved contact, not the message number", "safe");
            }}
            data-testid="call-saved-contact-button"
            className={btn.safe}
          >
            <PhoneCall className="h-4 w-4" aria-hidden="true" />
            Call Saved Contact
          </button>

          <button
            type="button"
            onClick={() => {
              setPhase("cancelled");
              setSignals([]);
              applyRisk(6, { cue: "safe", status: "blocked" });
              logEvent("Payment cancelled", "\u20b918,000 retained", "safe");
            }}
            data-testid="cancel-payment-button"
            className={btn.ghost}
          >
            <XCircle className="h-4 w-4" aria-hidden="true" />
            Cancel Payment
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-red-500/25 bg-red-500/[0.06] p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase tracking-[0.16em] text-red-300/80">
              Deliberate override
            </span>
            <span
              className="font-mono text-[11px] text-red-300"
              data-testid="hold-progress-value"
              aria-live="polite"
            >
              {holdPct}%
            </span>
          </div>

          <button
            type="button"
            {...hold.bind}
            data-testid="hold-to-confirm-button"
            aria-label="Press and hold for 3 seconds to confirm override"
            className="tp-focus relative w-full select-none overflow-hidden rounded-xl bg-red-500 px-3 py-3.5 text-[13px] font-semibold text-white transition-colors duration-150 hover:bg-red-400 active:scale-[0.99]"
          >
            <span
              className="absolute inset-y-0 left-0 bg-red-900/60"
              style={{ width: `${holdPct}%` }}
              aria-hidden="true"
            />
            <span className="relative z-10 inline-flex items-center gap-2">
              <Lock className="h-4 w-4" aria-hidden="true" />
              {hold.holding
                ? `Keep holding\u2026 ${secsLeft.toFixed(1)}s`
                : "Hold to Confirm Override"}
            </span>
          </button>

          <div
            className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-800"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={holdPct}
            data-testid="hold-progress"
          >
            <div
              className="h-full rounded-full bg-red-400"
              style={{ width: `${holdPct}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] leading-snug text-zinc-500">
            Press and hold for 3 full seconds. Releasing early cancels the override &mdash; impulse
            alone cannot move your money.
          </p>
        </div>
      </StageOverlay>
    </div>
  );
};
