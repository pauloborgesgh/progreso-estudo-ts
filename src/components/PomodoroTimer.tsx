import { memo } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { usePomodoro } from '../hooks/usePomodoro';
import type { CursoId } from '../types/study';

interface PomodoroTimerProps {
  cursoId: CursoId;
  onSessionComplete?: () => void;
}

const PomodoroTimer = memo(function PomodoroTimer({ cursoId, onSessionComplete }: PomodoroTimerProps) {
  const {
    mode,
    formattedTime,
    isRunning,
    sessionsToday,
    progress,
    startTimer,
    pauseTimer,
    resetTimer,
  } = usePomodoro(cursoId, onSessionComplete);

  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-2" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
      <div className="flex items-center gap-2">
        {mode === 'focus' ? (
          <Brain className="w-4 h-4 text-blue-400" />
        ) : (
          <Coffee className="w-4 h-4 text-amber-400" />
        )}
        <span className={`text-sm font-mono font-bold tabular-nums ${
          mode === 'focus' ? 'text-blue-400' : 'text-amber-400'
        }`}>
          {formattedTime}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {isRunning ? (
          <button
            onClick={pauseTimer}
            className="p-1.5 rounded-lg transition-all" style={{ color: 'var(--text-secondary)' }}
            title="Pausar"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={startTimer}
            className="p-1.5 rounded-lg transition-all" style={{ color: 'var(--text-secondary)' }}
            title="Iniciar"
          >
            <Play className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={resetTimer}
          className="p-1.5 rounded-lg transition-all" style={{ color: 'var(--text-muted)' }}
          title="Resetar"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-1.5 pl-2" style={{ borderLeftColor: 'var(--border-color)' }}>
        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              mode === 'focus'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
                : 'bg-gradient-to-r from-amber-500 to-orange-400'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-slate-500 font-medium min-w-[1.5rem] text-right">
          {sessionsToday}
        </span>
      </div>
    </div>
  );
});

export default PomodoroTimer;
