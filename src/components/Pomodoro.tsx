import { useEffect, useRef, useState, useReducer } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, RotateCcw, Timer, X, Coffee } from "lucide-react";
import { playBeep } from "../lib/audio";

const FOCUS = 25 * 60;
const BREAK = 5 * 60;

type PomodoroState = {
  mode: "focus" | "break";
  left: number;
  running: boolean;
  cycles: number;
};

type Action =
  | { type: "TICK" }
  | { type: "TOGGLE_RUNNING" }
  | { type: "RESET" }
  | { type: "SWITCH_MODE"; mode: "focus" | "break" };

function pomodoroReducer(state: PomodoroState, action: Action): PomodoroState {
  switch (action.type) {
    case "TICK": {
      if (!state.running) return state;
      if (state.left <= 1) {
        const isFocus = state.mode === "focus";
        return {
          mode: isFocus ? "break" : "focus",
          left: isFocus ? BREAK : FOCUS,
          running: false,
          cycles: isFocus ? state.cycles + 1 : state.cycles,
        };
      }
      return { ...state, left: state.left - 1 };
    }
    case "TOGGLE_RUNNING":
      return { ...state, running: !state.running };
    case "RESET":
      return { ...state, running: false, left: state.mode === "focus" ? FOCUS : BREAK };
    case "SWITCH_MODE":
      return { ...state, running: false, mode: action.mode, left: action.mode === "focus" ? FOCUS : BREAK };
  }
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export function Pomodoro() {
  const [open, setOpen] = useState(false);
  const [state, dispatch] = useReducer(pomodoroReducer, {
    mode: "focus",
    left: FOCUS,
    running: false,
    cycles: 0,
  });

  // Timer interval
  useEffect(() => {
    if (!state.running) return;
    const id = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(id);
  }, [state.running]);

  // Side effects when timer completes (beep + notification)
  const prevRunningRef = useRef(state.running);
  const prevLeftRef = useRef(state.left);
  useEffect(() => {
    if (prevRunningRef.current && !state.running && prevLeftRef.current <= 1) {
      playBeep();
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        const wasFocus = state.mode === "focus";
        new Notification(
          wasFocus ? "Pomodoro — Hora da pausa!" : "Pomodoro — Hora de focar!",
          {
            body: wasFocus
              ? "Ciclo de foco concluído. Faça uma pausa de 5 minutos."
              : "Pausa concluída. Volte ao foco!",
          },
        );
      }
    }
    prevRunningRef.current = state.running;
    prevLeftRef.current = state.left;
  });

  useEffect(() => {
    if (!open) return;
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const total = state.mode === "focus" ? FOCUS : BREAK;
  const pct = ((total - state.left) / total) * 100;

  const reset = () => dispatch({ type: "RESET" });
  const switchMode = (m: "focus" | "break") => dispatch({ type: "SWITCH_MODE", mode: m });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-white/10 bg-card/90 px-4 py-2.5 font-mono text-sm text-foreground shadow-lg backdrop-blur transition hover:border-neon-cyan/40 hover:text-neon-cyan ${
          state.running && "border-neon-cyan/60 text-neon-cyan text-glow"
        }`}
        aria-label="Abrir Pomodoro"
      >
        <Timer size={16} />
        {fmt(state.left)}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:items-center sm:justify-center"
          >
            <button
              aria-label="Fechar"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-card p-6 shadow-2xl"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground"
                aria-label="Fechar"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                <Timer size={12} className="text-neon-cyan" />
                Pomodoro · {state.cycles} ciclo{state.cycles === 1 ? "" : "s"}
              </div>

              <div className="mt-2 flex gap-1 rounded-full border border-white/10 bg-background/50 p-1 text-xs">
                <button
                  onClick={() => switchMode("focus")}
                  className={`flex-1 rounded-full px-3 py-1.5 font-medium transition ${
                    state.mode === "focus"
                      ? "bg-neon-cyan/10 text-neon-cyan"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Foco 25′
                </button>
                <button
                  onClick={() => switchMode("break")}
                  className={`flex-1 rounded-full px-3 py-1.5 font-medium transition ${
                    state.mode === "break"
                      ? "bg-neon-green/10 text-neon-green"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Pausa 5′
                </button>
              </div>

              <div
                className={`mt-6 text-center font-mono text-6xl font-bold tabular-nums ${
                  state.mode === "focus" ? "text-neon-cyan text-glow" : "text-neon-green text-glow"
                }`}
              >
                {fmt(state.left)}
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
                <div
                  className={`h-full transition-all ${state.mode === "focus" ? "bg-neon-cyan" : "bg-neon-green"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => dispatch({ type: "TOGGLE_RUNNING" })}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 font-semibold transition ${
                    state.running
                      ? "border-neon-orange/40 text-neon-orange hover:bg-neon-orange/10"
                      : "border-neon-cyan bg-neon-cyan text-background hover:opacity-90"
                  }`}
                >
                  {state.running ? <Pause size={16} /> : <Play size={16} />}
                  {state.running ? "Pausar" : "Iniciar"}
                </button>
                <button
                  onClick={reset}
                  className="flex items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-muted-foreground transition hover:border-white/30 hover:text-foreground"
                  aria-label="Reiniciar"
                >
                  <RotateCcw size={16} />
                </button>
              </div>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                <Coffee size={12} />
                {state.mode === "focus"
                  ? "Foque em um subtema até o timer zerar."
                  : "Levante, respire, beba água."}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
