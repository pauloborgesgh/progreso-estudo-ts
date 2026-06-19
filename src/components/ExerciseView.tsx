import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { X, Check, PenLine, Lightbulb } from "lucide-react";
import type { Topic } from "../data/roadmap-data";
import { DynamicIcon } from "./ui/DynamicIcon";

const templates = [
  (s: string) => `Explique o que é ${s.toLowerCase()} com suas palavras.`,
  (s: string) => `Dê um exemplo prático de ${s.toLowerCase()}.`,
  (s: string) => `Escreva um pequeno código demonstrando ${s.toLowerCase()}.`,
  (s: string) => `Por que ${s.toLowerCase()} é importante no contexto deste tópico?`,
];

export function ExerciseView({
  topic,
  onClose,
  doneIdx,
  onToggleSub,
}: {
  topic: Topic;
  onClose: () => void;
  doneIdx: number[];
  onToggleSub: (i: number) => void;
}) {
  const neonColor = `var(--neon-${topic.color})`;

  const questions = useMemo(
    () =>
      topic.subtopics.map((s, i) => ({
        subtopic: s,
        question: templates[i % templates.length](s),
      })),
    [topic.subtopics],
  );

  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const allDone = topic.subtopics.every((_, i) => doneIdx.includes(i));

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 240, damping: 24 }}
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-card p-6 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3">
          <div
            className="flex size-12 items-center justify-center rounded-xl border bg-background/60"
            style={{ borderColor: neonColor, color: neonColor }}
          >
            <DynamicIcon name={topic.icon} size={22} />
          </div>
          <div>
            <div
              className="font-mono text-xs tracking-widest text-glow"
              style={{ color: neonColor }}
            >
              EXERCÍCIO · ETAPA {String(topic.id).padStart(2, "0")}
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">{topic.title}</h2>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-mono text-xs uppercase tracking-widest text-neon-yellow">
            <Lightbulb size={12} className="-mt-0.5 me-1 inline" />
            Aquecimento
          </h4>
          <div className="mt-3 space-y-4">
            {questions.map((q, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-background/40 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {i + 1}. {q.question}
                  </p>
                  <button
                    onClick={() => onToggleSub(i)}
                    aria-label={doneIdx.includes(i) ? "Desmarcar" : "Marcar concluído"}
                    className={`flex size-6 shrink-0 items-center justify-center rounded-md border transition ${
                      doneIdx.includes(i)
                        ? "border-neon-green bg-neon-green text-background"
                        : "border-white/20 text-transparent hover:border-neon-green"
                    }`}
                  >
                    <Check size={12} />
                  </button>
                </div>
                <textarea
                  value={answers[i] ?? ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [i]: e.target.value }))
                  }
                  placeholder="Escreva sua resposta..."
                  className="mt-3 w-full resize-y rounded-lg border border-white/10 bg-background/60 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-current"
                  rows={3}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-neon-cyan/30 bg-neon-cyan/5 p-4">
          <h4 className="font-mono text-xs uppercase tracking-widest text-neon-cyan">
            <PenLine size={12} className="-mt-0.5 me-1 inline" />
            Exercício principal
          </h4>
          <p className="mt-1.5 text-sm text-foreground">{topic.practice}</p>
        </div>

        <div className="mt-6 flex items-center justify-between text-xs">
          <span className="font-mono text-muted-foreground">
            {doneIdx.length}/{topic.subtopics.length} subtemas praticados
          </span>
          {allDone && (
            <span className="font-mono text-neon-green text-glow">✓ Praticado</span>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-white/5"
        >
          <X size={14} />
          Fechar
        </button>
      </motion.div>
    </motion.div>
  );
}
