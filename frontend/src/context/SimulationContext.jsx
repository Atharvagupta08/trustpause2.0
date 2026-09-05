import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SCENARIOS, riskBand } from "@/lib/simData";
import { cue, setMuted as setLibMuted, primeAudio } from "@/lib/feedback";

const SimulationContext = createContext(null);

let eventSeq = 0;

export function SimulationProvider({ children }) {
  const [viewMode, setViewMode] = useState("desktop");
  const [scenarioId, setScenarioId] = useState("sms");
  const [risk, setRisk] = useState(SCENARIOS[0].baseRisk);
  const [signals, setSignals] = useState([]);
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("monitoring");
  const [muted, setMuted] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [lastCue, setLastCue] = useState(null);
  const cueTimer = useRef(null);

  useEffect(() => {
    setLibMuted(muted);
  }, [muted]);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => () => clearTimeout(cueTimer.current), []);

  const flashCue = useCallback((name) => {
    setLastCue({ name, at: Date.now() });
    clearTimeout(cueTimer.current);
    cueTimer.current = setTimeout(() => setLastCue(null), 900);
  }, []);

  const fireCue = useCallback(
    (name) => {
      cue(name);
      flashCue(name);
    },
    [flashCue]
  );

  const logEvent = useCallback((label, detail, tone = "info") => {
    eventSeq += 1;
    const stamp = new Date();
    setEvents((prev) =>
      [
        {
          id: `ev-${eventSeq}`,
          label,
          detail,
          tone,
          time: stamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        },
        ...prev,
      ].slice(0, 30)
    );
  }, []);

  const applyRisk = useCallback(
    (value, { cue: cueName, status: nextStatus } = {}) => {
      const clamped = Math.max(0, Math.min(100, Math.round(value)));
      setRisk(clamped);
      if (nextStatus) setStatus(nextStatus);
      if (cueName) fireCue(cueName);
    },
    [fireCue]
  );

  const scenario = useMemo(
    () => SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0],
    [scenarioId]
  );

  const selectScenario = useCallback(
    (id) => {
      const next = SCENARIOS.find((s) => s.id === id);
      if (!next || id === scenarioId) return;
      primeAudio();
      setScenarioId(id);
      setRisk(next.baseRisk);
      setSignals([]);
      setStatus("monitoring");
      setResetKey((k) => k + 1);
      fireCue("tap");
      logEvent("Scenario loaded", next.label, "info");
    },
    [scenarioId, fireCue, logEvent]
  );

  const resetSimulation = useCallback(() => {
    setRisk(scenario.baseRisk);
    setSignals([]);
    setStatus("monitoring");
    setEvents([]);
    setResetKey((k) => k + 1);
    fireCue("tap");
  }, [scenario.baseRisk, fireCue]);

  const value = useMemo(
    () => ({
      viewMode,
      setViewMode: (m) => {
        setViewMode(m);
        fireCue("tap");
      },
      scenarioId,
      scenario,
      selectScenario,
      risk,
      band: riskBand(risk),
      applyRisk,
      signals,
      setSignals,
      events,
      logEvent,
      status,
      setStatus,
      muted,
      toggleMuted: () =>
        setMuted((m) => {
          const next = !m;
          setLibMuted(next);
          if (!next) cue("tap");
          return next;
        }),
      resetSimulation,
      resetKey,
      fireCue,
      lastCue,
    }),
    [
      viewMode,
      scenarioId,
      scenario,
      selectScenario,
      risk,
      applyRisk,
      signals,
      events,
      logEvent,
      status,
      muted,
      resetSimulation,
      resetKey,
      fireCue,
      lastCue,
    ]
  );

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error("useSimulation must be used inside SimulationProvider");
  return ctx;
}
