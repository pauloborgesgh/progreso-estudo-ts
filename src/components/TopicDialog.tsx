import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { X, Check, StickyNote, BookOpen, Globe2, Video, ExternalLink, Code } from "lucide-react";
import type { Topic } from "../data/roadmap-data";
import { courseInfo } from "../data/roadmap-data";
import { useCourse } from "../contexts/useCourse";
import { Textarea } from "./ui/textarea";
import { DynamicIcon } from "./ui/DynamicIcon";

function SubLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-medium text-muted-foreground transition hover:border-current hover:text-current"
    >
      {icon}
      {label}
    </a>
  );
}

interface GroupCard {
  category: string;
  indexes: number[];
  methods: { index: number; name: string }[];
  allDone: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  string: "neon-green",
  number: "neon-cyan",
  math: "neon-purple",
  geral: "neon-yellow",
};

function parseGroups(subtopics: string[]): GroupCard[] | null {
  const regex = /^([\wÀ-ÿ\s]+?):\s*(.+)$/;
  const groups: GroupCard[] = [];

  for (let i = 0; i < subtopics.length; i++) {
    const match = subtopics[i].match(regex);
    if (match) {
      const [, category, rest] = match;
      const cat = category.trim();
      let group = groups.find((g) => g.category === cat);
      if (!group) {
        group = { category: cat, indexes: [], methods: [], allDone: false };
        groups.push(group);
      }
      group.indexes.push(i);
      for (const method of rest.split(/,\s*/).map((m) => m.trim()).filter(Boolean)) {
        group.methods.push({ index: i, name: method });
      }
    }
  }

  if (groups.length < 2) return null;
  return groups;
}

function GroupedSubtopics({
  groups,
  doneIdx,
  onToggleSub,
  openNote,
  setOpenNote,
  getNote,
  setNote,
  courseName,
}: {
  groups: GroupCard[];
  doneIdx: number[];
  onToggleSub: (i: number) => void;
  openNote: number | null;
  setOpenNote: (i: number | null) => void;
  getNote: (i: number) => string;
  setNote: (i: number, text: string) => void;
  courseName: string;
}) {
  return (
    <div className="mt-6 space-y-4">
      {groups.map((group) => {
        const catLower = group.category.toLowerCase();
        const catColor = CATEGORY_COLORS[catLower] ?? "neon-cyan";
        const catColorVar = `var(--${catColor})`;
        const allDone = group.indexes.every((i) => doneIdx.includes(i));

        return (
          <div
            key={group.category}
            className="overflow-hidden rounded-xl border border-white/10 bg-background/40"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between gap-3 px-4 py-3"
              style={{ borderBottom: `1px solid ${catColorVar}20` }}
            >
              <span
                className="font-mono text-xs font-bold uppercase tracking-widest text-glow"
                style={{ color: catColorVar }}
              >
                <Code size={12} className="-mt-0.5 me-1.5 inline" />
                {group.category}
                <span className="ms-1.5 text-[10px] opacity-60">{group.methods.length} métodos</span>
              </span>
              <button
                onClick={() => {
                  if (allDone) {
                    group.indexes.forEach((i) => { if (doneIdx.includes(i)) onToggleSub(i); });
                  } else {
                    group.indexes.forEach((i) => { if (!doneIdx.includes(i)) onToggleSub(i); });
                  }
                }}
                aria-label={allDone ? "Desmarcar grupo" : "Marcar grupo"}
                className={`flex size-6 shrink-0 items-center justify-center rounded-md border transition ${
                  allDone
                    ? "border-neon-green bg-neon-green text-background"
                    : "border-white/20 text-transparent hover:border-neon-green"
                }`}
              >
                <Check size={14} />
              </button>
            </div>

            {/* Methods grid */}
            <div className="flex flex-wrap gap-2 px-4 py-3">
              {group.methods.map((m) => {
                const done = doneIdx.includes(m.index);
                return (
                  <button
                    key={`${m.index}-${m.name}`}
                    onClick={() => onToggleSub(m.index)}
                    className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[11px] transition ${
                      done
                        ? "border-neon-green/40 bg-neon-green/10 text-neon-green"
                        : "border-white/10 text-muted-foreground hover:border-current hover:text-current"
                    }`}
                    style={done ? {} : { color: catColorVar } as React.CSSProperties}
                  >
                    {done && <Check size={10} />}
                    {m.name}
                  </button>
                );
              })}
            </div>

            {/* Notes & links */}
            <div className="border-t border-white/5 px-4 py-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <SubLink
                    href={`https://developer.mozilla.org/pt-BR/search?q=${encodeURIComponent(group.category + " " + courseName)}`}
                    icon={<BookOpen size={10} />}
                    label="MDN"
                  />
                  <SubLink
                    href={`https://www.google.com/search?q=${encodeURIComponent(group.category + " " + courseName)}`}
                    icon={<Globe2 size={10} />}
                    label="Google"
                  />
                  <SubLink
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(group.category + " " + courseName)}`}
                    icon={<Video size={10} />}
                    label="YouTube"
                  />
                </div>
                {group.indexes.length === 1 && (
                  <button
                    onClick={() => setOpenNote(openNote === group.indexes[0] ? null : group.indexes[0])}
                    aria-label="Anotação"
                    className={`rounded-md border p-1 transition ${
                      getNote(group.indexes[0])
                        ? "border-neon-green text-neon-green"
                        : "border-white/10 text-muted-foreground hover:border-current hover:text-current"
                    }`}
                  >
                    <StickyNote size={12} />
                  </button>
                )}
              </div>
              {group.indexes.length === 1 && (openNote === group.indexes[0] || getNote(group.indexes[0])) && (
                <div className="mt-2">
                  <Textarea
                    value={getNote(group.indexes[0])}
                    onChange={(e) => setNote(group.indexes[0], e.target.value)}
                    placeholder="Suas anotações sobre este grupo…"
                    className="min-h-[70px] resize-y border-white/10 bg-background/60 text-sm focus-visible:ring-current/40"
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FlatSubtopics({
  subtopics,
  doneIdx,
  onToggleSub,
  openNote,
  setOpenNote,
  getNote,
  setNote,
  courseName,
}: {
  subtopics: string[];
  doneIdx: number[];
  onToggleSub: (i: number) => void;
  openNote: number | null;
  setOpenNote: (i: number | null) => void;
  getNote: (i: number) => string;
  setNote: (i: number, text: string) => void;
  courseName: string;
}) {
  return (
    <ul className="mt-2 space-y-1.5">
      {subtopics.map((s, i) => {
        const done = doneIdx.includes(i);
        const note = getNote(i);
        const isOpen = openNote === i || note.length > 0;
        return (
          <li key={s} className="rounded-lg transition hover:bg-white/5">
            <div className="flex w-full items-start gap-2 p-2 text-left text-sm">
              <button
                onClick={() => onToggleSub(i)}
                aria-label={done ? "Desmarcar subtema" : "Marcar subtema"}
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition ${
                  done
                    ? "border-neon-green bg-neon-green text-background"
                    : "border-white/20 text-transparent hover:border-neon-green"
                }`}
              >
                <Check size={12} />
              </button>
              <button
                onClick={() => onToggleSub(i)}
                className={`flex-1 text-left ${done ? "text-muted-foreground" : ""}`}
              >
                {s}
              </button>
              <button
                onClick={() => setOpenNote(isOpen ? null : i)}
                aria-label="Anotação"
                title={note ? "Editar anotação" : "Adicionar anotação"}
                className={`shrink-0 rounded-md border p-1 transition ${
                  note
                    ? "border-neon-green text-neon-green"
                    : "border-white/10 text-muted-foreground hover:border-current hover:text-current"
                }`}
              >
                <StickyNote size={12} />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 px-2 pb-2 pl-9">
              <SubLink
                href={`https://developer.mozilla.org/pt-BR/search?q=${encodeURIComponent(s + " " + courseName)}`}
                icon={<BookOpen size={10} />}
                label="MDN"
              />
              <SubLink
                href={`https://www.google.com/search?q=${encodeURIComponent(s + " " + courseName)}`}
                icon={<Globe2 size={10} />}
                label="Google"
              />
              <SubLink
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(s + " " + courseName)}`}
                icon={<Video size={10} />}
                label="YouTube"
              />
            </div>
            {isOpen && (
              <div className="px-2 pb-2 pl-9">
                <Textarea
                  value={note}
                  onChange={(e) => setNote(i, e.target.value)}
                  placeholder="Suas anotações sobre este subtema…"
                  className="min-h-[70px] resize-y border-white/10 bg-background/60 text-sm focus-visible:ring-current/40"
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function TopicDialog({
  topic,
  onClose,
  doneIdx,
  onToggleSub,
  completed,
  onToggleTopic,
  getNote,
  setNote,
}: {
  topic: Topic;
  onClose: () => void;
  doneIdx: number[];
  onToggleSub: (i: number) => void;
  completed: boolean;
  onToggleTopic: () => void;
  getNote: (i: number) => string;
  setNote: (i: number, text: string) => void;
}) {
  const [openNote, setOpenNote] = useState<number | null>(null);
  const { course } = useCourse();
  const courseName = courseInfo[course].label;
  const colorVar = `var(--neon-${topic.color})`;

  const groups = useMemo(() => parseGroups(topic.subtopics), [topic.subtopics]);
  const isGrouped = groups !== null;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

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
        className="relative max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-card p-6 shadow-2xl"
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
            style={{ borderColor: colorVar, color: colorVar }}
          >
            <DynamicIcon name={topic.icon} size={22} />
          </div>
          <div>
            <div
              className="font-mono text-xs tracking-widest text-glow"
              style={{ color: colorVar }}
            >
              ETAPA {String(topic.id).padStart(2, "0")}
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">{topic.title}</h2>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">{topic.description}</p>

        {isGrouped ? (
          <GroupedSubtopics
            groups={groups!}
            doneIdx={doneIdx}
            onToggleSub={onToggleSub}
            openNote={openNote}
            setOpenNote={setOpenNote}
            getNote={getNote}
            setNote={setNote}
            courseName={courseName}
          />
        ) : (
          <div className="mt-6">
            <h4 className="font-mono text-xs uppercase tracking-widest" style={{ color: colorVar }}>
              Subtemas
            </h4>
            <FlatSubtopics
              subtopics={topic.subtopics}
              doneIdx={doneIdx}
              onToggleSub={onToggleSub}
              openNote={openNote}
              setOpenNote={setOpenNote}
              getNote={getNote}
              setNote={setNote}
              courseName={courseName}
            />
          </div>
        )}

        <div className="mt-6 rounded-xl border border-white/10 bg-background/60 p-4">
          <h4 className="font-mono text-xs uppercase tracking-widest" style={{ color: colorVar }}>
            O que praticar
          </h4>
          <p className="mt-1.5 text-sm text-foreground">{topic.practice}</p>
        </div>

        {topic.links.length > 0 && (
          <div className="mt-6">
            <h4 className="font-mono text-xs uppercase tracking-widest" style={{ color: colorVar }}>
              Para estudar
            </h4>
            <ul className="mt-2 space-y-1.5">
              {topic.links.map((l) => (
                <li key={l.url}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-foreground underline-offset-4 hover:text-current hover:underline"
                  >
                    <ExternalLink size={12} />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={onToggleTopic}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
            completed
              ? "border-white/15 text-muted-foreground hover:text-foreground"
              : "text-background hover:opacity-90"
          }`}
          style={completed ? {} : { borderColor: colorVar, backgroundColor: colorVar }}
        >
          <Check size={16} />
          {completed ? "Marcar como pendente" : "Marcar etapa como concluída"}
        </button>
      </motion.div>
    </motion.div>
  );
}
