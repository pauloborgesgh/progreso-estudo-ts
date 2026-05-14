import { useState, useCallback, useRef, useEffect } from 'react';

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;
const STORAGE_KEY = 'ts-pomodoro';
const SESSIONS_KEY = 'ts-pomodoro-sessions';

interface PomodoroState {
  mode: 'focus' | 'break';
  timeLeft: number;
  isRunning: boolean;
}

function loadState(): PomodoroState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { mode: 'focus', timeLeft: FOCUS_TIME, isRunning: false };
}

function loadSessions(): string[] {
  try {
    const saved = localStorage.getItem(SESSIONS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function usePomodoro(onSessionComplete?: () => void) {
  const [state, setState] = useState<PomodoroState>(loadState);
  const [sessions, setSessions] = useState<string[]>(loadSessions);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const saveState = useCallback((newState: PomodoroState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }, []);

  const playNotification = useCallback(() => {
    try {
      const audioCtx = new AudioContext();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = 800;
      gain.gain.value = 0.1;
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.frequency.value = 1000;
        gain2.gain.value = 0.1;
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.3);
      }, 200);
    } catch {}
  }, []);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    setState(prev => {
      if (prev.timeLeft <= 0) return prev;
      const newState = { ...prev, isRunning: true };
      saveState(newState);

      intervalRef.current = setInterval(() => {
        setState(current => {
          if (current.timeLeft <= 1) {
            clearTimer();
            playNotification();

            if (current.mode === 'focus') {
              const today = getToday();
              setSessions(prevSessions => {
                const updated = [...prevSessions, today];
                localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
                return updated;
              });
              onSessionComplete?.();
              const breakState = { mode: 'break' as const, timeLeft: BREAK_TIME, isRunning: false };
              saveState(breakState);
              return breakState;
            } else {
              const focusState = { mode: 'focus' as const, timeLeft: FOCUS_TIME, isRunning: false };
              saveState(focusState);
              return focusState;
            }
          }
          const updated = { ...current, timeLeft: current.timeLeft - 1 };
          saveState(updated);
          return updated;
        });
      }, 1000);

      return newState;
    });
  }, [clearTimer, saveState, playNotification]);

  const pauseTimer = useCallback(() => {
    clearTimer();
    setState(prev => {
      const newState = { ...prev, isRunning: false };
      saveState(newState);
      return newState;
    });
  }, [clearTimer, saveState]);

  const resetTimer = useCallback(() => {
    clearTimer();
    const newState = { mode: 'focus' as const, timeLeft: FOCUS_TIME, isRunning: false };
    setState(newState);
    saveState(newState);
  }, [clearTimer, saveState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  // Notificação de sessão quando aba volta a ter foco
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const sessionsToday = sessions.filter(s => s === getToday()).length;
  const formattedTime = `${String(Math.floor(state.timeLeft / 60)).padStart(2, '0')}:${String(state.timeLeft % 60).padStart(2, '0')}`;

  const progress = state.mode === 'focus'
    ? ((FOCUS_TIME - state.timeLeft) / FOCUS_TIME) * 100
    : ((BREAK_TIME - state.timeLeft) / BREAK_TIME) * 100;

  return {
    mode: state.mode,
    timeLeft: state.timeLeft,
    formattedTime,
    isRunning: state.isRunning,
    sessionsToday,
    progress,
    startTimer,
    pauseTimer,
    resetTimer,
  };
}
