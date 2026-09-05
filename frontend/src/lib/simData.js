import {
  MessageSquareWarning,
  IndianRupee,
  PhoneIncoming,
  AudioLines,
} from "lucide-react";

export const SCENARIOS = [
  {
    id: "sms",
    testId: "scenario-tab-kyc-phishing",
    label: "KYC Phishing SMS",
    short: "KYC SMS",
    icon: MessageSquareWarning,
    vector: "Link Handling Hook",
    baseRisk: 24,
    badge: "High",
    blurb: "Look-alike bank domain delivered over SMS with a 10 minute deadline.",
  },
  {
    id: "upi",
    testId: "scenario-tab-upi-transfer",
    label: "Urgent Money Transfer (UPI)",
    short: "UPI Transfer",
    icon: IndianRupee,
    vector: "Accessibility Event Hook",
    baseRisk: 32,
    badge: "Critical",
    blurb: "First-time payee, high value, coached-in-the-moment transfer.",
  },
  {
    id: "call",
    testId: "scenario-tab-digital-arrest",
    label: "Digital Arrest / Impersonation Call",
    short: "Digital Arrest",
    icon: PhoneIncoming,
    vector: "CallScreening API",
    baseRisk: 38,
    badge: "Critical",
    blurb: "Unverified VoIP caller impersonating law enforcement.",
  },
  {
    id: "deepfake",
    testId: "scenario-tab-deepfake-voice",
    label: "Deepfake Voice Emergency",
    short: "Deepfake Voice",
    icon: AudioLines,
    vector: "On-device Audio Classifier",
    baseRisk: 28,
    badge: "High",
    blurb: "Cloned family voice asking for emergency cash, secrecy enforced.",
  },
];

export function riskBand(v) {
  if (v >= 70) return "danger";
  if (v >= 35) return "warn";
  return "safe";
}

export const BAND_META = {
  safe: {
    label: "Safe",
    text: "text-emerald-300",
    chip: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
    stroke: "#34d399",
    bar: "bg-emerald-400",
    glow: "shadow-[0_0_24px_-6px_rgba(52,211,153,0.55)]",
  },
  warn: {
    label: "Elevated",
    text: "text-amber-300",
    chip: "border-amber-500/25 bg-amber-500/10 text-amber-200",
    stroke: "#fbbf24",
    bar: "bg-amber-400",
    glow: "shadow-[0_0_24px_-6px_rgba(251,191,36,0.55)]",
  },
  danger: {
    label: "Intervention",
    text: "text-red-300",
    chip: "border-red-500/25 bg-red-500/10 text-red-300",
    stroke: "#f87171",
    bar: "bg-red-400",
    glow: "shadow-[0_0_28px_-6px_rgba(248,113,113,0.6)]",
  },
};

export const ARCHITECTURE = [
  {
    id: "call-screening",
    platform: "Android",
    title: "CallScreeningService",
    api: "android.telecom.CallScreeningService",
    body:
      "System hands each incoming call to TrustPause before it rings. We score number reputation, VoIP/CLI-spoof markers and prior reports, then attach a risk banner or silence the call. No audio is recorded.",
    signals: ["Caller reputation", "VoIP / spoof markers", "First-contact authority claim"],
  },
  {
    id: "accessibility",
    platform: "Android",
    title: "Accessibility Event Hooks",
    api: "AccessibilityService (TYPE_VIEW_TEXT_CHANGED, scoped packages)",
    body:
      "Scoped to payment and messaging packages only. TrustPause reads the structured event (amount field, payee VPA, first-time flag) to raise an Action Lock. Events are processed in memory on-device and discarded.",
    signals: ["Amount + payee fields", "First-time payee", "Coached-entry timing"],
  },
  {
    id: "link-handling",
    platform: "Android + iOS",
    title: "Link Handling / Safari Extension",
    api: "Intent filters + ASWebAuthentication / SFSafariViewController",
    body:
      "TrustPause registers as a link handler (Android intent filter) or a Safari Web Extension (iOS) so a tapped URL passes through a domain-mismatch check and the 10 second pause before any page loads.",
    signals: ["Homoglyph / look-alike domain", "Domain age + TLS age", "Brand keyword mismatch"],
  },
  {
    id: "ios-hooks",
    platform: "iOS",
    title: "Call Directory + Live Voicemail",
    api: "CallKit CallDirectoryExtension, SMS & Call Reporting Extension",
    body:
      "On iOS we ship a Call Directory extension for labelling/blocking, an SMS filter extension for smishing, and Screen Time API for the intervention surface. Apple never grants background screen capture, and we never ask for it.",
    signals: ["Number labelling", "SMS filter verdicts", "On-device classification"],
  },
];

export const PRIVACY_POINTS = [
  "No 24/7 background screen recording, ever.",
  "No call audio capture — only metadata and on-device classifier verdicts.",
  "Accessibility scope limited to an allow-list of payment/messaging packages.",
  "Risk scoring runs on-device; only anonymised reports leave the phone, with consent.",
];
