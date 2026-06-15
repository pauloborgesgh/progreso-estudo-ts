import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, RotateCcw, Timer, X, Coffee } from "lucide-react";
import { playBeep } from "../lib/audio";

const FOCUS = 25 * 60;
const BREAK = 5 * 60;

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export function Pomodoro() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [left, setLeft] = useState(FOCUS);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const intRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intRef.current = setInterval(() => {
      setLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => {
      if (intRef.current) clearInterval(intRef.current);
    };
  }, [running]);

  useEffect(() => {
    if (left === 0 && running) {
      setRunning(false);
      if (mode === "focus") {
        setCycles((c) => c + 1);
        setMode("break");
        setLeft(BREAK);
      } else {
        setMode("focus");
        setLeft(FOCUS);
      }
      playBeep();
    }
  }, [left, running, mode]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const total = mode === "focus" ? FOCUS : BREAK;
  const pct = ((total - left) / total) * 100;

  const reset = () => {
    setRunning(false);
    setLeft(mode === "focus" ? FOCUS : BREAK);
  };

  const switchMode = (m: "focus" | "break") => {
    setMode(m);
    setRunning(false);
    setLeft(m === "focus" ? FOCUS : BREAK);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-white/10 bg-card/90 px-4 py-2.5 font-mono text-sm text-foreground shadow-lg backdrop-blur transition hover:border-neon-cyan/40 hover:text-neon-cyan ${
          running && "border-neon-cyan/60 text-neon-cyan text-glow"
        }`}
        aria-label="Abrir Pomodoro"
      >
        <Timer size={16} />
        {fmt(left)}
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
                Pomodoro · {cycles} ciclo{cycles === 1 ? "" : "s"}
              </div>

              <div className="mt-2 flex gap-1 rounded-full border border-white/10 bg-background/50 p-1 text-xs">
                <button
                  onClick={() => switchMode("focus")}
                  className={`flex-1 rounded-full px-3 py-1.5 font-medium transition ${
                    mode === "focus"
                      ? "bg-neon-cyan/10 text-neon-cyan"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Foco 25′
                </button>
                <button
                  onClick={() => switchMode("break")}
                  className={`flex-1 rounded-full px-3 py-1.5 font-medium transition ${
                    mode === "break"
                      ? "bg-neon-green/10 text-neon-green"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Pausa 5′
                </button>
              </div>

              <div
                className={`mt-6 text-center font-mono text-6xl font-bold tabular-nums ${
                  mode === "focus" ? "text-neon-cyan text-glow" : "text-neon-green text-glow"
                }`}
              >
                {fmt(left)}
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
                <div
                  className={`h-full transition-all ${mode === "focus" ? "bg-neon-cyan" : "bg-neon-green"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => setRunning((r) => !r)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 font-semibold transition ${
                    running
                      ? "border-neon-orange/40 text-neon-orange hover:bg-neon-orange/10"
                      : "border-neon-cyan bg-neon-cyan text-background hover:opacity-90"
                  }`}
                >
                  {running ? <Pause size={16} /> : <Play size={16} />}
                  {running ? "Pausar" : "Iniciar"}
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
                {mode === "focus"
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
