import { memo, useMemo } from 'react';
import { Flame, Calendar, TrendingUp } from 'lucide-react';

interface StatisticsPanelProps {
  streak: number;
  weekDays: { date: string; studied: boolean }[];
  daysStudied: number;
  sessionsToday: number;
  totalDias: number;
  diasConcluidos: number;
}

const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const StatisticsPanel = memo(function StatisticsPanel({
  streak,
  weekDays,
  daysStudied,
  sessionsToday,
  totalDias,
  diasConcluidos,
}: StatisticsPanelProps) {
  const overallPercent = useMemo(
    () => Math.round((diasConcluidos / totalDias) * 100),
    [diasConcluidos, totalDias]
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {/* Streak */}
      <div className="bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/20 rounded-2xl p-5 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Sequência</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{streak}</span>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>dias</span>
        </div>
      </div>

      {/* Esta Semana */}
      <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 rounded-2xl p-5 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Esta Semana</span>
        </div>
        <div className="flex items-center gap-1.5">
          {weekDays.map((day) => (
            <div key={day.date} className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                {dayLabels[new Date(day.date).getDay()]}
              </span>
              <div
                className={`w-6 h-6 rounded-md transition-colors ${
                  day.studied
                    ? 'bg-blue-500/60 shadow-sm shadow-blue-500/30'
                    : 'bg-white/5'
                }`}
                title={day.date}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          {daysStudied}/7 dias
        </div>
      </div>

      {/* Sessões Hoje */}
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-2xl p-5 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Foco Hoje</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{sessionsToday}</span>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>pomodoros</span>
        </div>
      </div>

      {/* Progresso Geral */}
      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-5 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Completado</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{overallPercent}%</span>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>({diasConcluidos}/{totalDias})</span>
        </div>
      </div>
    </div>
  );
});

export default StatisticsPanel;
