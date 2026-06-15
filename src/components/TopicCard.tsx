import { motion } from "framer-motion";
import { Check, Code2, type LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { Topic } from "../data/roadmap-data";

function getIcon(name: string): LucideIcon {
  const key = name as keyof typeof LucideIcons;
  return (LucideIcons[key] as LucideIcon) ?? Code2;
}

export function TopicCard({
  topic,
  completed,
  subDone,
  onToggle,
  onOpen,
  delay,
}: {
  topic: Topic;
  completed: boolean;
  subDone: number;
  onToggle: () => void;
  onOpen: () => void;
  delay: number;
}) {
  const Icon = getIcon(topic.icon);
  const neonColor = `var(--neon-${topic.color})`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay }}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-card/70 p-5 backdrop-blur transition hover:ring-glow ${completed ? "opacity-60" : ""}`}
      style={{ color: neonColor } as React.CSSProperties}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 items-center justify-center rounded-lg border bg-background/60"
            style={{ borderColor: neonColor, color: neonColor }}
          >
            <Icon className="text-current" size={20} />
          </div>
          <div>
            <div
              className="font-mono text-xs tracking-widest text-glow"
              style={{ color: neonColor }}
            >
              {String(topic.id).padStart(2, "0")}
            </div>
            <h3 className="font-display text-base font-semibold text-foreground sm:text-lg">
              {topic.title}
            </h3>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          aria-label={completed ? "Marcar como pendente" : "Marcar como concluído"}
          className={`flex size-9 shrink-0 items-center justify-center rounded-full border transition ${
            completed
              ? "border-current bg-current text-background"
              : "border-white/15 text-muted-foreground hover:border-current hover:text-current"
          }`}
          style={completed ? { color: neonColor } : {}}
        >
          <Check size={16} />
        </button>
      </div>

      <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
        {topic.subtopics.slice(0, 4).map((s) => (
          <li key={s} className="flex gap-2">
            <span
              className="mt-2 size-1 shrink-0 rounded-full"
              style={{ backgroundColor: neonColor }}
            />
            <span>{s}</span>
          </li>
        ))}
        {topic.subtopics.length > 4 && (
          <li className="pl-3 text-xs text-muted-foreground/70">
            +{topic.subtopics.length - 4} mais…
          </li>
        )}
      </ul>

      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="font-mono text-muted-foreground">
          {subDone}/{topic.subtopics.length} subtemas
        </span>
        <button
          onClick={onOpen}
          className="rounded-full border border-white/10 px-3 py-1 font-medium text-foreground transition hover:border-current hover:text-current"
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = neonColor;
            e.currentTarget.style.color = neonColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "";
            e.currentTarget.style.color = "";
          }}
        >
          Ver detalhes →
        </button>
      </div>
    </motion.article>
  );
}
