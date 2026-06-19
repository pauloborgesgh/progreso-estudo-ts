import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Play, Pause, Volume2, X } from "lucide-react";
import { playTrack, stopTrack, setVolume } from "../lib/audio";

type Track = { id: string; label: string; icon: string };

const TRACKS: Track[] = [
  { id: "white", label: "Ruído Branco", icon: "〰️" },
  { id: "pink", label: "Ruído Rosa (Chuva)", icon: "🌧️" },
  { id: "brown", label: "Ruído Marrom (Foco)", icon: "🌊" },
  { id: "binaural", label: "Batidas Binaurais α", icon: "🧠" },
  { id: "music", label: "Música Lofi", icon: "🎵" },
];

const YT_VIDEO_ID = "m5QHYUt5Gd0";

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (v: number) => void;
  destroy: () => void;
};

type YTPlayerConstructor = new (
  element: HTMLElement | string,
  opts: {
    height?: string | number;
    width?: string | number;
    videoId?: string;
    playerVars?: Record<string, string | number>;
    events?: {
      onReady?: () => void;
      onStateChange?: (e: { data: number }) => void;
    };
  }
) => YTPlayer;

declare global {
  interface Window {
    YT: {
      Player: YTPlayerConstructor;
      PlayerState: { PLAYING: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function LofiPlayer() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [volume, setVolumeState] = useState(0.4);
  const [ytApiReady, setYtApiReady] = useState(() => typeof window !== "undefined" && !!window.YT);
  const playerRef = useRef<YTPlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ytScriptLoaded = useRef(false);

  useEffect(() => {
    if (ytScriptLoaded.current) return;
    if (window.YT) return;
    ytScriptLoaded.current = true;

    window.onYouTubeIframeAPIReady = () => {
      setYtApiReady(true);
    };

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (activeId !== "music" || !ytApiReady) {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      return;
    }

    if (playerRef.current) {
      playerRef.current.playVideo();
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const player = new window.YT.Player(el, {
      height: 100,
      width: "100%",
      videoId: YT_VIDEO_ID,
      playerVars: {
        autoplay: 1,
        controls: 1,
        rel: 1,
        modestbranding: 1,
        playsinline: 1,
      },
      events: {
        onReady: () => {
          player.setVolume(volume * 100);
          player.playVideo();
        },
      },
    });
    playerRef.current = player;
  }, [activeId, ytApiReady, volume]);

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  const toggleTrack = useCallback(
    (id: string) => {
      if (activeId === id) {
        if (id === "music") {
          playerRef.current?.pauseVideo();
        } else {
          stopTrack();
        }
        setActiveId(null);
        return;
      }

      if (activeId === "music") {
        playerRef.current?.pauseVideo();
      } else if (activeId) {
        stopTrack();
      }

      if (id === "music") {
        setActiveId(id);
      } else {
        playTrack(id);
        setVolume(volume);
        setActiveId(id);
      }
    },
    [activeId, volume]
  );

  const handleVolume = useCallback(
    (v: number) => {
      setVolumeState(v);
      if (activeId === "music") {
        playerRef.current?.setVolume(v * 100);
      } else {
        setVolume(v);
      }
    },
    [activeId]
  );

  const isMusic = activeId === "music";

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 left-4 z-40 inline-flex items-center gap-2 rounded-full border border-neon-purple/40 bg-background/80 px-3 py-2 text-xs text-neon-purple shadow-lg backdrop-blur transition hover:bg-neon-purple/10"
        title="Sons para foco"
      >
        {activeId ? <Pause size={14} /> : <Music size={14} />}
        {activeId
          ? TRACKS.find((t) => t.id === activeId)?.label ?? "Sons"
          : "Sons"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-16 left-4 z-40 w-72 rounded-2xl border border-white/10 bg-card/95 p-4 shadow-2xl backdrop-blur"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-neon-purple">
                <Volume2 size={12} />
                Trilha de estudo
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-muted-foreground hover:text-foreground"
                aria-label="Fechar"
              >
                <X size={14} />
              </button>
            </div>

            <ul className="space-y-1.5">
              {TRACKS.map((t) => {
                const active = activeId === t.id;
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => toggleTrack(t.id)}
                      className={
                        "flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs transition " +
                        (active
                          ? "border-neon-purple/50 bg-neon-purple/10 text-neon-purple"
                          : "border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground")
                      }
                    >
                      <span>
                        <span className="mr-1.5">{t.icon}</span>
                        {t.label}
                      </span>
                      {active ? <Pause size={12} /> : <Play size={12} />}
                    </button>
                  </li>
                );
              })}
            </ul>

            {isMusic && (
              <div className="mt-3 overflow-hidden rounded-lg">
                <div ref={containerRef} className="w-full" />
                {!ytApiReady && (
                  <p className="py-2 text-center text-[10px] text-muted-foreground">
                    Carregando player...
                  </p>
                )}
              </div>
            )}

            {activeId && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <Volume2 size={10} />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) =>
                      handleVolume(Number(e.target.value))
                    }
                    className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-neon-purple [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neon-purple"
                    aria-label="Volume"
                  />
                </div>
                <p className="text-[10px] leading-relaxed text-muted-foreground">
                  {isMusic
                    ? "Lofi hip hop para estudar. Requer internet."
                    : "Sons gerados em tempo real. Funciona offline."}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
