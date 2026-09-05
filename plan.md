# plan.md — TrustPause 2.0 (Frontend-only SPA)

## 1. Objectives
- Build a responsive, modern dark-mode SPA prototype for **TrustPause 2.0: The Ambient Human Firewall**.
- Deliver 4 interactive simulation tabs (SMS phishing, UPI transfer lock, impersonation call, deepfake voice) + a bottom **Architecture Drawer**.
- Provide a **live reactive Risk Gauge** (0–100) that increases during risky actions and drops when user takes safe actions/cancels.
- Ensure all interventions work out-of-the-box: modals, 10s countdown, press-and-hold override, timers, reset, sound/haptics.
- Ship with Tailwind CSS + Lucide icons, and a **Desktop Dashboard ↔ Phone Frame Simulator** view toggle.

## 2. Implementation Steps

### Phase 1 — Core flow POC (isolation)
> (No external integrations; POC is still useful to de-risk timers/gesture/haptics + risk state coupling before full UI.)

**User stories (Phase 1)**
1. As a user, I can click a suspicious link and see a 10-second intervention countdown that completes reliably.
2. As a user, I can attempt a payment and must press-and-hold for 3 seconds to override, with visible progress.
3. As a user, I can cancel any risky flow and instantly see the risk score return to safe.
4. As a user on mobile, I feel a vibration cue when an intervention triggers (if supported).
5. As a user, I can reset the simulation state to try again without refreshing the page.

**Steps**
- Implement minimal React state machine (single page) with:
  - `riskScore` (0–100), `activeScenario`, `interventionState`.
  - Timer utilities (countdown hook) + cleanup to prevent leaks.
  - Press-and-hold hook (pointer events, supports mouse/touch) with progress.
- Add sound/haptics utility:
  - WebAudio simple beep sequences on **intervention trigger / safe action / danger**.
  - `navigator.vibrate()` patterns guarded by feature detection.
- Create a minimal POC screen with 2 buttons:
  - “Trigger Countdown Intervention (10s)”
  - “Trigger Hold-to-Confirm (3s)”
  - plus “Cancel” and “Reset”.
- Validate core behaviours manually: no stuck timers, risk gauge updates, hold-to-confirm works on touch.

Exit criteria (Phase 1)
- Countdown always reaches 0 and closes/advances predictably.
- Hold-to-confirm reaches 100% only when continuously held; cancels on release/leave.
- Reset restores all state (risk score, modals, progress, timers).

---

### Phase 2 — V1 App Development (full SPA build)
**User stories (Phase 2)**
1. As a user, I can switch between Desktop Dashboard and a Phone Frame Simulator to preview mobile UX.
2. As a user, I can navigate between the 4 simulation tabs and each tab loads instantly without errors.
3. As a user, I see a live Risk Gauge in the header reflecting the current scenario and my actions.
4. As a user, I receive clear safe alternatives (official app, verify helpline, call saved contact) during interventions.
5. As a user, I can open the Architecture Drawer to understand platform-safe implementation approaches.

**Build steps (single SPA, minimal file churn)**
- App shell
  - Tailwind dark theme (slate/zinc base) with semantic accents:
    - Safe: emerald, Warning: amber, Danger/Intervention: rose/red.
  - Header: logo + subtitle, risk gauge meter, view toggle, global **Reset Simulation**.
  - Main layout: tabs row + scenario panel.
  - View modes:
    - Desktop: wide dashboard layout.
    - Phone: centered phone frame with constrained width + faux status bar.
- Scenario tab implementations
  1. **KYC Phishing SMS**
     - SMS card with message + clickable phishing link.
     - On click: **Intervention Modal** with animated 10s countdown, domain mismatch explainer, CTA: “Open Official Bank App Instead”.
     - Safe CTA reduces risk and closes modal.
  2. **Urgent Money Transfer (UPI)**
     - Payment UI showing Rs 18,000 to unknown UPI.
     - “Pay Now” triggers **Action Lock** overlay.
     - Requires **press & hold 3s** “Hold to Confirm Override” + progress bar.
     - Safety options: “Call Saved Contact” (safe resolution) + “Cancel Payment” (safe cancel).
  3. **Digital Arrest / Impersonation Call**
     - Incoming call alert UI from “Police/CBI (Unverified)”.
     - Live Call Risk Card: Unverified VoIP, Secrecy request detected.
     - Buttons: “End Call & Report” (safe) and “Verify via Official Helpline” (safe).
  4. **Deepfake Voice Emergency**
     - Audio sample card (play/pause UI; no external audio required—use generated tone + “simulated” waveform).
     - Cognitive Risk breakdown (Urgency/Fear/Secrecy/Synthetic markers) -> Total 85/100.
     - Intervention active visuals.
- Architecture Drawer (bottom)
  - Collapsible info panel explaining Android/iOS approach:
    - CallScreening API, Accessibility event hooks, link handling, no 24/7 screen recording.
- Global polish
  - Consistent modal system, focus trap, ESC to close where appropriate.
  - Risk scoring rules (deterministic mapping per scenario + user actions).
  - Ensure all timers/intervals are cleaned up on tab switch/reset.

**Phase 2 testing (1 full round)**
- Run testing agent for SPA navigation + core interactions:
  - Tab switching, opening/closing modals, countdown completion, hold-to-confirm, reset.
  - Responsive checks for desktop + mobile widths.
  - Skip strict audio playback assertions; only verify no crashes.

Exit criteria (Phase 2)
- All 4 scenarios fully interactive with no console errors.
- Risk gauge updates live and resets correctly.
- Phone frame mode is usable on small screens.

---

### Phase 3 — More features + refactor + hardening
**User stories (Phase 3)**
1. As a user, I get consistent feedback (sound/haptic + visuals) for warning vs danger vs safe actions.
2. As a user, I can replay scenarios repeatedly without state corruption or stuck UI.
3. As a user on touch devices, all press/hold and buttons work reliably without accidental scroll issues.
4. As a user, I can understand “why risky” via short explanations in each intervention.
5. As a user, I experience smooth animations without jank.

**Steps**
- Refactor into small components/hooks:
  - `useCountdown`, `usePressHold`, `useRiskEngine`, `useFeedbackCues`.
- Improve accessibility:
  - ARIA labels, keyboard focus management, reduced motion support.
- Add micro-animations (Tailwind + CSS) for interventions and gauge.
- Expand reset to include “Reset current tab” and “Reset all”.
- Testing agent round #2:
  - Regression sweep across all scenarios + reset paths + responsive.

Exit criteria (Phase 3)
- No flaky interactions; repeated runs stable.
- Accessibility baseline met; motion respects preferences.

## 3. Next Actions
1. Generate design tokens (colors, spacing, typography) and Tailwind config/theme mapping.
2. Implement Phase 1 POC hooks (countdown + press/hold + feedback cues) and validate manually.
3. Build full SPA in one cohesive pass (tabs, header, phone frame mode, architecture drawer).
4. Run testing agent for end-to-end flow; fix issues immediately.
5. Polish responsiveness + accessibility, rerun testing agent.

## 4. Success Criteria
- SPA loads with a polished dark cybersecurity theme, works on mobile + desktop.
- Each simulation tab demonstrates the correct intervention mechanic:
  - SMS link -> 10s pause modal + safe CTA
  - UPI pay -> action lock + 3s hold override + safe options
  - Call -> risk card + safe actions
  - Deepfake -> risk breakdown totaling 85/100
- Live Risk Gauge responds to user actions and resets reliably.
- Reset Simulation always restores a clean state.
- No runtime errors; timers/handlers cleaned up; testing agent passes core UX flows.

---

## STATUS LOG

- **Phase 1 (Core POC) — COMPLETE**: 10s countdown hook, 3s press-and-hold gesture hook, live risk engine and WebAudio/haptic cue layer built and verified in isolation via Playwright (hold cancels on early release, completes at 3.0s, countdown drifts-free).
- **Phase 2 (Full SPA) — COMPLETE**: Header (logo + subtitle + live reactive Risk Gauge + Desktop/Phone toggle + Cues toggle + Reset Simulation), 4 scenario tabs (KYC Phishing SMS, UPI Action Lock, Digital Arrest call, Deepfake Voice), Intervention Modal, Action Lock overlay, Live Call Risk Card, cognitive risk breakdown (85/100), Telemetry panel (signals + decision timeline), Architecture Drawer (CallScreening / Accessibility hooks / Link handling / iOS + privacy callout). Frontend-only, no backend.
- **Testing — COMPLETE**: testing_agent_v3 iteration_1 => 100% frontend pass, 0 bugs (37 test cases incl. responsiveness at 1920/1024/390 and stability re-runs).

- **Phase 3 (Dashboard visual rebuild) — COMPLETE**: cleared stale webpack bundle (user was being served the earlier POC bench), subtitle -> "The Ambient Human Firewall", glowing "Protection: ACTIVE" shield badge with animated LED, gradient + glow SVG risk gauge, glassmorphism (.tp-glass/.tp-glass-strong/.tp-glow-emerald/.tp-led) across header/tabs/stage/telemetry/overlays, tabs renamed (SMS Phishing / UPI Payment Lock / Digital Arrest Call / Deepfake Audio), new linear countdown BAR in the intervention modal, CTA "Open Official Bank App", single-row compact 1440px header. Regression: testing_agent_v3 iteration_2 => 100% pass, 0 bugs.
