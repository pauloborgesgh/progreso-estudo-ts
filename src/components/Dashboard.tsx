import { useMemo } from "react";
import { motion } from "framer-motion";
import { useCourse } from "../contexts/CourseContext";
import type { NeonColor } from "../data/roadmap-data";

const barColor: Record<NeonColor, string> = {
  green: "bg-neon-green",
  cyan: "bg-neon-cyan",
  purple: "bg-neon-purple",
  orange: "bg-neon-orange",
  pink: "bg-neon-pink",
  yellow: "bg-neon-yellow",
  blue: "bg-neon-blue",
  red: "bg-neon-red",
  lime: "bg-neon-lime",
  magenta: "bg-neon-magenta",
};

const textColor: Record<NeonColor, string> = {
  green: "text-neon-green",
  cyan: "text-neon-cyan",
  purple: "text-neon-purple",
  orange: "text-neon-orange",
  pink: "text-neon-pink",
  yellow: "text-neon-yellow",
  blue: "text-neon-blue",
  red: "text-neon-red",
  lime: "text-neon-lime",
  magenta: "text-neon-magenta",
};

export function Dashboard({
  subDoneFor,
  isCompleted,
}: {
  subDoneFor: (id: number) => number[];
  isCompleted: (id: number) => boolean;
}) {
  const { topics } = useCourse();
  const rows = useMemo(
    () =>
      topics.map((t) => {
        const done = subDoneFor(t.id).length;
        const total = t.subtopics.length;
        const pct = total === 0 ? 0 : Math.round((done / total) * 100);
        return { t, done, total, pct, completed: isCompleted(t.id) };
      }),
    [subDoneFor, isCompleted, topics],
  );

  const totalSub = rows.reduce((acc, r) => acc + r.total, 0);
  const doneSub = rows.reduce((acc, r) => acc + r.done, 0);

  return (
    <section className="mx-auto mt-6 max-w-2xl rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Painel por tópico
        </h2>
        <span className="font-mono text-xs text-muted-foreground">
          {doneSub}/{totalSub} subtemas
        </span>
      </div>
      <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {rows.map((r) => (
          <li key={r.t.id} className="space-y-1">
            <div className="flex items-baseline justify-between gap-2 text-xs">
              <span
                className={`truncate font-medium ${r.completed ? textColor[r.t.color] : "text-foreground"}`}
                title={r.t.title}
              >
                <span className="font-mono text-muted-foreground">
                  {String(r.t.id).padStart(2, "0")}
                </span>{" "}
                {r.t.title}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {r.done}/{r.total}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className={`h-full ${barColor[r.t.color]}`}
                initial={{ width: 0 }}
                animate={{ width: `${r.pct}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
