import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, RefreshCw, Dumbbell } from "lucide-react";
import { useCourse } from "../contexts/CourseContext";

function dayOfYear(d = new Date()) {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / 86400000);
}

export function DailyTip() {
  const { topics } = useCourse();
  const [seed, setSeed] = useState(0);
  useEffect(() => {
    setSeed(dayOfYear());
  }, []);

  const tip = useMemo(() => {
    const all: { topic: string; sub: string; color: string }[] = [];
    for (const t of topics) for (const s of t.subtopics) all.push({ topic: t.title, sub: s, color: t.color });
    return all[seed % all.length];
  }, [seed, topics]);

  const exercise = useMemo(() => {
    const idx = (seed * 7 + 3) % topics.length;
    const t = topics[idx];
    return { topic: t.title, practice: t.practice };
  }, [seed, topics]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-2"
    >
      <div className="rounded-2xl border border-neon-yellow/30 bg-neon-yellow/5 p-5 backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-neon-yellow/40 bg-background/40 text-neon-yellow">
            <Lightbulb size={18} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <div className="font-mono text-[10px] uppercase tracking-widest text-neon-yellow">
                Dica do dia
              </div>
              <button
                onClick={() => setSeed((s) => s + 1)}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-muted-foreground transition hover:border-neon-yellow/40 hover:text-neon-yellow"
                title="Outra dica"
              >
                <RefreshCw size={10} />
                Outra
              </button>
            </div>
            <div className="mt-1 text-sm font-medium text-foreground">{tip.sub}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">em {tip.topic}</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-neon-pink/30 bg-neon-pink/5 p-5 backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-neon-pink/40 bg-background/40 text-neon-pink">
            <Dumbbell size={18} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <div className="font-mono text-[10px] uppercase tracking-widest text-neon-pink">
                Exercício do dia
              </div>
              <button
                onClick={() => setSeed((s) => s + 1)}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-muted-foreground transition hover:border-neon-pink/40 hover:text-neon-pink"
                title="Outro exercício"
              >
                <RefreshCw size={10} />
                Outro
              </button>
            </div>
            <div className="mt-1 text-sm font-medium text-foreground">{exercise.practice}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">de {exercise.topic}</div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
