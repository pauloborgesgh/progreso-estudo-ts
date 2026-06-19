import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search, X, RotateCcw, Upload, Download, Gauge, Layers,
  PlayCircle, FileCode, FileType, CircleDot,
} from "lucide-react";
import { useProgress } from "./hooks/useProgress";
import { useStreak } from "./hooks/useStreak";
import { useCourse } from "./contexts/useCourse";
import { TopicCard } from "./components/TopicCard";
import { TopicDialog } from "./components/TopicDialog";
import { Dashboard } from "./components/Dashboard";
import { DailyTip } from "./components/DailyTip";
import { Flashcards } from "./components/Flashcards";
import { ExerciseView } from "./components/ExerciseView";
import { Pomodoro } from "./components/Pomodoro";
import { LofiPlayer } from "./components/LofiPlayer";
import { courseInfo, type CourseId, type Topic } from "./data/roadmap-data";
import type { LucideIcon } from "lucide-react";

const courseIcons: Record<CourseId, LucideIcon> = {
  js: FileCode,
  ts: FileType,
  angular: CircleDot,
};

function normalize(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

type Filter = "all" | "todo" | "done";

const courses: CourseId[] = ["js", "ts", "angular"];

const courseOrder: Record<CourseId, number> = { js: 0, ts: 1, angular: 2 };

const DAYS_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function StreakCalendar({ dates }: { dates: string[] }) {
  const dateSet = useMemo(() => new Set(dates), [dates]);

  const weeks = useMemo(() => {
    const today = new Date();
    const w: { date: Date; active: boolean }[][] = [];
    const start = new Date(today);
    start.setDate(start.getDate() - 48);
    start.setHours(0, 0, 0, 0);

    let currentWeek: { date: Date; active: boolean }[] = [];
    for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      currentWeek.push({ date: new Date(d), active: dateSet.has(key) });
      if (currentWeek.length === 7) {
        w.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) w.push(currentWeek);
    return w;
  }, [dateSet]);

  return (
    <div className="mt-4 flex items-start gap-3">
      <div className="flex flex-col gap-[3px] pt-5">
        {[0, 2, 4, 6].map((d) => (
          <span key={d} className="h-[10px] text-[8px] leading-[10px] text-muted-foreground/60">
            {DAYS_LABELS[d].slice(0, 1)}
          </span>
        ))}
      </div>
      <div className="flex gap-[3px] overflow-x-auto">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day, di) => (
              <div
                key={di}
                className="size-[10px] rounded-sm"
                style={{
                  backgroundColor: day.active
                    ? "var(--neon-green)"
                    : "rgba(255,255,255,0.06)",
                  opacity: day.active ? 1 : 1,
                }}
                title={`${day.date.toLocaleDateString("pt-BR")}${day.active ? " — estudou" : ""}`}
              />
            ))}
          </div>
        ))}
      </div>
      <span className="self-end pb-0.5 text-[8px] text-muted-foreground/60">
        Últimos 49 dias
      </span>
    </div>
  );
}

function App() {
  const { course, setCourse, topics } = useCourse();
  const progress = useProgress(course);
  const { streak, dates: studyDates, recordStudy } = useStreak(course);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = `Roadmap ${courseInfo[course].label} — Do Básico ao Avançado`;
  }, [course]);

  useEffect(() => {
    if ('ontouchstart' in window) {
      document.body.addEventListener('touchstart', () => {});
    }
  }, []);

  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<Topic | null>(null);
  const [query, setQuery] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [flashOpen, setFlashOpen] = useState(false);
  const [dashOpen, setDashOpen] = useState(false);
  const [exercisingTopic, setExercisingTopic] = useState<Topic | null>(null);
  const [direction, setDirection] = useState(0);
  const prevCourseRef = useRef(courseOrder[course]);

  useEffect(() => {
    setDirection(courseOrder[course] - prevCourseRef.current);
    prevCourseRef.current = courseOrder[course];
  }, [course]);

  const visible = useMemo(() => {
    const q = normalize(query.trim());
    let list = topics;
    if (filter === "done") list = list.filter((t) => progress.isCompleted(t.id));
    else if (filter === "todo") list = list.filter((t) => !progress.isCompleted(t.id));
    if (q) {
      list = list.filter((t) => {
        if (normalize(t.title).includes(q)) return true;
        if (normalize(t.description).includes(q)) return true;
        return t.subtopics.some((s) => normalize(s).includes(q));
      });
    }
    return list;
  }, [filter, query, progress, topics]);

  const nextTopic = useMemo(
    () => topics.find((t) => !progress.isCompleted(t.id)),
    [topics, progress],
  );

  if (!progress.hydrated) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Carregando…</div>
          </div>
        </div>
      </main>
    );
  }

  const handleExport = () => {
    const blob = new Blob([progress.exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `roadmap-${course}-progresso-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const ok = progress.importJson(String(reader.result ?? ""));
      if (!ok) alert("Arquivo inválido.");
    };
    reader.readAsText(file);
  };

  const pct = Math.round((progress.completedCount / topics.length) * 100);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
      <header className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
          <span className="size-1.5 rounded-full bg-neon-yellow shadow-[0_0_10px] shadow-neon-yellow" />
          Aprenda · Pratique · Construa · Domine
        </div>

        {/* Course Toggle */}
        <div className="mt-4 flex justify-center">
          <div className="inline-flex gap-1 rounded-full border border-white/10 bg-background/50 p-1 text-xs">
                {courses.map((c) => {
              const info = courseInfo[c];
              const Icon = courseIcons[c];
              const active = course === c;
              return (
                <button
                  key={c}
                  onClick={() => setCourse(c)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-medium transition ${
                    active
                      ? "bg-white/10 text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon size={14} />
                  {info.label}
                </button>
              );
            })}
          </div>
        </div>

        <h1 className="mt-6 font-display text-4xl font-bold leading-tight sm:text-6xl">
          <span
            className={`inline-block rounded-xl px-3 py-1 font-mono text-3xl text-black shadow-[0_0_40px] sm:text-5xl ${
              course === "angular"
                ? "bg-neon-red shadow-neon-red"
                : course === "ts"
                  ? "bg-neon-blue shadow-neon-blue"
                  : "bg-neon-yellow shadow-neon-yellow"
            }`}
          >
            {course === "angular" ? "NG" : course === "ts" ? "TS" : "JS"}
          </span>{" "}
          <span className="text-foreground">{courseInfo[course].label}</span>
          <br />
          <span className="bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple bg-clip-text text-transparent">
            Roadmap
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
          Do básico ao avançado, em {topics.length} etapas. Marque o que você já estudou e siga
          construindo — seu progresso fica salvo neste navegador.
        </p>
      </header>

      {/* Progress */}
      <section className="mx-auto mt-10 max-w-2xl rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Seu progresso
            </div>
            <div className="mt-1 font-display text-2xl font-semibold">
              {progress.completedCount}{" "}
              <span className="text-muted-foreground">/ {topics.length} tópicos</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {streak > 0 && (
              <div className="font-mono text-[10px] uppercase tracking-widest text-neon-orange">
                🔥 Streak: {streak} {streak === 1 ? "dia" : "dias"}
              </div>
            )}
            <div className="font-mono text-4xl font-bold text-neon-cyan text-glow">{pct}%</div>
          </div>
        </div>
        {studyDates.length > 0 && (
          <StreakCalendar dates={studyDates} />
        )}
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1 rounded-full border border-white/10 bg-background/50 p-1 text-xs">
            {(["all", "todo", "done"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1.5 font-medium transition ${
                  filter === f
                    ? "bg-white/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "all" ? "Todos" : f === "todo" ? "Pendentes" : "Concluídos"}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFlashOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-neon-yellow/40 px-3 py-1.5 text-xs text-neon-yellow transition hover:bg-neon-yellow/10"
              title="Estudar com flashcards"
            >
              <Layers size={12} />
              Flashcards
            </button>
            <button
              onClick={() => setDashOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-neon-green/40 hover:text-neon-green"
              title="Ver painel por tópico"
            >
              <Gauge size={12} />
              {dashOpen ? "Ocultar painel" : "Painel"}
            </button>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-neon-cyan/40 hover:text-neon-cyan"
              title="Baixar progresso e anotações em JSON"
            >
              <Download size={12} />
              Exportar
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-neon-purple/40 hover:text-neon-purple"
              title="Restaurar progresso de um JSON"
            >
              <Upload size={12} />
              Importar
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleImport(f);
                e.target.value = "";
              }}
            />
            <button
              onClick={() => {
                if (confirm(`Tem certeza que deseja resetar todo o progresso em ${courseInfo[course].label}?`))
                  progress.reset();
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-neon-red/40 hover:text-neon-red"
            >
              <RotateCcw size={12} />
              Resetar
            </button>
          </div>
        </div>

        {nextTopic && (
          <button
            onClick={() => setOpen(nextTopic)}
            className="mt-4 flex w-full items-center justify-between gap-3 rounded-xl border border-neon-cyan/30 bg-neon-cyan/5 px-4 py-3 text-left transition hover:bg-neon-cyan/10"
          >
            <span className="flex items-center gap-2.5">
              <PlayCircle className="text-neon-cyan" size={18} />
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-widest text-neon-cyan">
                  Continuar de onde parei
                </span>
                <span className="block text-sm font-medium text-foreground">
                  {String(nextTopic.id).padStart(2, "0")} · {nextTopic.title}
                </span>
              </span>
            </span>
            <span className="font-mono text-xs text-neon-cyan">→</span>
          </button>
        )}
      </section>

      {dashOpen && (
        <Dashboard subDoneFor={progress.subtopicsDone} isCompleted={progress.isCompleted} />
      )}

      <DailyTip />

      {/* Search */}
      <section className="mx-auto mt-6 max-w-2xl">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-card/60 px-4 py-2.5 backdrop-blur focus-within:border-neon-cyan/50">
          <Search size={16} className="text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por tópico ou subtema…"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="rounded-full p-1 text-muted-foreground hover:text-foreground"
              aria-label="Limpar busca"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </section>

      {/* Topic Grid */}
      <AnimatePresence mode="wait">
        <motion.section
          key={course}
          initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          className="mt-10"
        >
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((topic, i) => (
              <motion.li
                key={`${course}-${topic.id}`}
                layout
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
              >
                <TopicCard
                  topic={topic}
                  completed={progress.isCompleted(topic.id)}
                  subDone={progress.subtopicsDone(topic.id).length}
                  onToggle={() => { progress.toggleTopic(topic.id); recordStudy(); }}
                  onOpen={() => setOpen(topic)}
                  onExercise={() => setExercisingTopic(topic)}
                  delay={i * 0.03}
                />
              </motion.li>
            ))}
          </ul>

          {visible.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-muted-foreground">
              {query
                ? `Nada encontrado para "${query}".`
                : "Nenhum tópico para mostrar com este filtro."}
            </div>
          )}
        </motion.section>
      </AnimatePresence>

      <footer className="mt-20 border-t border-white/5 pt-8 text-center text-xs text-muted-foreground">
        Feito para estudar. Inspirado no roadmap{" "}
        <span className="font-mono text-neon-cyan">@__coding_master_</span>.
      </footer>

      <AnimatePresence>
        {open && (
          <TopicDialog
            topic={open}
            onClose={() => setOpen(null)}
            doneIdx={progress.subtopicsDone(open.id)}
            onToggleSub={(i) => { progress.toggleSubtopic(open.id, i); recordStudy(); }}
            completed={progress.isCompleted(open.id)}
            onToggleTopic={() => { progress.toggleTopic(open.id); recordStudy(); }}
            getNote={(i) => progress.getNote(open.id, i)}
            setNote={(i, t) => progress.setNote(open.id, i, t)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {flashOpen && <Flashcards onClose={() => setFlashOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {exercisingTopic && (
          <ExerciseView
            topic={exercisingTopic}
            onClose={() => setExercisingTopic(null)}
            doneIdx={progress.subtopicsDone(exercisingTopic.id)}
            onToggleSub={(i) => { progress.toggleSubtopic(exercisingTopic.id, i); recordStudy(); }}
          />
        )}
      </AnimatePresence>

      <Pomodoro />
      <LofiPlayer />
    </main>
  );
}

export default App;
