import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, X, Eye, Check, RotateCcw } from "lucide-react";
import { useCourse } from "../contexts/CourseContext";
import type { Topic } from "../data/roadmap-data";

interface Card {
  topicId: number;
  topicTitle: string;
  subtopic: string;
  description: string;
  practice: string;
}

function buildDeck(topics: Topic[]): Card[] {
  const deck: Card[] = [];
  for (const t of topics) {
    for (const s of t.subtopics) {
      deck.push({
        topicId: t.id,
        topicTitle: t.title,
        subtopic: s,
        description: t.description,
        practice: t.practice,
      });
    }
  }
  return deck;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Flashcards({ onClose }: { onClose: () => void }) {
  const { topics } = useCourse();
  const initial = useMemo(() => shuffle(buildDeck(topics)), [topics]);
  const [deck, setDeck] = useState<Card[]>(initial);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [knownIds, setKnown] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const card = deck[idx];
  const key = card ? `${card.topicId}:${card.subtopic}` : "";
  const isKnown = knownIds.has(key);

  const next = () => {
    setRevealed(false);
    setIdx((i) => (i + 1) % deck.length);
  };

  const markKnown = () => {
    setKnown((prev) => {
      const n = new Set(prev);
      n.add(key);
      return n;
    });
    next();
  };

  const reshuffle = () => {
    setDeck(shuffle(buildDeck(topics)));
    setIdx(0);
    setRevealed(false);
    setKnown(new Set());
  };

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
        className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-card p-6 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-neon-cyan text-glow">
              Flashcards
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">Modo estudo</h2>
          </div>
          <div className="text-right font-mono text-xs text-muted-foreground">
            {idx + 1}/{deck.length}
            <div className="text-neon-green">{knownIds.size} sabia</div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={idx + (revealed ? "-b" : "-f")}
            initial={{ opacity: 0, rotateY: -8 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 8 }}
            transition={{ duration: 0.18 }}
            className={`mt-6 min-h-[200px] rounded-xl border p-5 transition ${
              isKnown ? "border-neon-green/40 bg-neon-green/5" : "border-white/10 bg-background/60"
            }`}
          >
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {String(card.topicId).padStart(2, "0")} · {card.topicTitle}
            </div>
            <div className="mt-3 font-display text-lg font-semibold text-foreground">
              {card.subtopic}
            </div>
            {revealed && (
              <div className="mt-4 space-y-3 border-t border-white/10 pt-3 text-sm">
                <p className="text-muted-foreground">{card.description}</p>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-neon-yellow">
                    Pratique
                  </span>
                  <p className="mt-1 text-foreground">{card.practice}</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={reshuffle}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-neon-purple/40 hover:text-neon-purple"
          >
            <RotateCcw size={12} />
            Reiniciar
          </button>
          <div className="flex flex-wrap items-center gap-2">
            {!revealed ? (
              <button
                onClick={() => setRevealed(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-neon-cyan/40 px-4 py-2 text-sm font-medium text-neon-cyan transition hover:bg-neon-cyan/10"
              >
                <Eye size={14} />
                Revelar
              </button>
            ) : (
              <>
                <button
                  onClick={next}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                  <Shuffle size={14} />
                  Revisar depois
                </button>
                <button
                  onClick={markKnown}
                  className="inline-flex items-center gap-1.5 rounded-full border border-neon-green bg-neon-green/10 px-4 py-2 text-sm font-medium text-neon-green transition hover:bg-neon-green/20"
                >
                  <Check size={14} />
                  Sabia
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
