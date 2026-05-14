import { useState, useMemo, useCallback, useEffect } from 'react';
import { BookOpen, RotateCcw, Calendar } from 'lucide-react';
import { useStudyProgress } from './hooks/useStudyProgress';
import { planoEstudo } from './data/studyPlan';
import WeekCard from './components/WeekCard';
import DayModal from './components/DayModal';
import ProgressBar from './components/ProgressBar';
import PomodoroTimer from './components/PomodoroTimer';
import StatisticsPanel from './components/StatisticsPanel';

function App() {
  const [selectedDay, setSelectedDay] = useState<{ semana: number; dia: number } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const {
    progress,
    toggleDia,
    setObservacao,
    resetProgress,
    isDiaCompleted,
    getProgressoSemana,
    getTotalProgresso,
    getStreak,
    getWeekStats,
    registrarDataEstudo,
  } = useStudyProgress();

  const streak = useMemo(getStreak, [getStreak]);
  const weekStats = useMemo(getWeekStats, [getWeekStats]);

  // Animação de entrada - useLayoutEffect seria mais adequado, mas useEffect serve
  useEffect(() => {
    requestAnimationFrame(() => setIsMounted(true));
  }, []);

  const totalDias = useMemo(() => planoEstudo.length * 5, []);

  const selectedSemana = useMemo(
    () => (selectedDay ? planoEstudo[selectedDay.semana - 1] : null),
    [selectedDay]
  );

  const selectedDiaData = useMemo(
    () => (selectedDay && selectedSemana ? selectedSemana.dias[selectedDay.dia - 1] : null),
    [selectedDay, selectedSemana]
  );

  const handleOpenDay = useCallback((semana: number, dia: number) => {
    setSelectedDay({ semana, dia });
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedDay(null);
  }, []);

  const navigateDay = useCallback((direction: 1 | -1) => {
    setSelectedDay(prev => {
      if (!prev) return null;
      const allDays: { semana: number; dia: number }[] = [];
      for (const s of planoEstudo) {
        for (const d of s.dias) {
          allDays.push({ semana: s.semana, dia: d.dia });
        }
      }
      const currentIndex = allDays.findIndex(
        d => d.semana === prev.semana && d.dia === prev.dia
      );
      const newIndex = currentIndex + direction;
      if (newIndex >= 0 && newIndex < allDays.length) {
        return allDays[newIndex];
      }
      return prev;
    });
  }, []);

  // Navegação por teclado global
  useEffect(() => {
    if (!selectedDay) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateDay(-1);
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateDay(1);
        return;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDay, handleCloseModal, navigateDay]);

  const allDays = useMemo(() => {
    const days: { semana: number; dia: number }[] = [];
    for (const s of planoEstudo) {
      for (const d of s.dias) {
        days.push({ semana: s.semana, dia: d.dia });
      }
    }
    return days;
  }, []);

  const currentDayIndex = useMemo(
    () => (selectedDay ? allDays.findIndex(d => d.semana === selectedDay.semana && d.dia === selectedDay.dia) : -1),
    [selectedDay, allDays]
  );

  const handleReset = useCallback(() => {
    resetProgress();
    setShowResetConfirm(false);
  }, [resetProgress]);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <header className="relative border-b border-white/5 backdrop-blur-xl bg-black/20 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  TypeScript Study Plan
                </h1>
                <p className="text-slate-500 text-sm">6 semanas • 30 dias • 1 hora/dia</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PomodoroTimer onSessionComplete={registrarDataEstudo} />
              {progress.dataInicio && (
                <span className="hidden md:flex items-center gap-2 text-slate-400 text-sm bg-white/5 px-3 py-1.5 rounded-lg">
                  <Calendar className="w-4 h-4" />
                  {new Date(progress.dataInicio).toLocaleDateString('pt-BR')}
                </span>
              )}
              <button
                onClick={() => setShowResetConfirm(true)}
                className="text-slate-500 hover:text-red-400 transition-colors p-2 hover:bg-white/5 rounded-lg"
                title="Resetar progresso"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className={`relative max-w-6xl mx-auto px-4 py-8 transition-all duration-700 ${isMounted ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
        <StatisticsPanel
          streak={streak}
          weekDays={weekStats.weekDays}
          daysStudied={weekStats.daysStudied}
          sessionsToday={0}
          totalDias={totalDias}
          diasConcluidos={progress.diasConcluidos.length}
        />

        {/* Main Progress */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Progresso Geral</h2>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {getTotalProgresso(totalDias)}%
            </span>
          </div>
          <ProgressBar value={getTotalProgresso(totalDias)} color="from-blue-500 via-cyan-400 to-purple-500" />
          <div className="flex justify-between mt-2 text-sm text-slate-500">
            <span>Início</span>
            <span>{Math.round((100 - getTotalProgresso(totalDias)) * 0.3)} dias restantes (estimado)</span>
            <span>Fim</span>
          </div>
        </div>

        {/* Week Cards */}
        <div className="space-y-4">
          {planoEstudo.map((semana, index) => (
            <div
              key={semana.semana}
              className="transition-all duration-500"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <WeekCard
                semana={semana}
                isExpanded={progress.diasConcluidos.some((d) => d.startsWith(`${semana.semana}-`))}
                onOpenDay={handleOpenDay}
                isDiaCompleted={isDiaCompleted}
                progresso={getProgressoSemana(semana.semana, 5)}
              />
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      {selectedDay && selectedSemana && selectedDiaData && (
        <DayModal
          semana={selectedSemana}
          dia={selectedDiaData}
          diaId={`${selectedDay.semana}-${selectedDay.dia}`}
          isCompleted={isDiaCompleted(`${selectedDay.semana}-${selectedDay.dia}`)}
          observacao={progress.observacoes[`${selectedDay.semana}-${selectedDay.dia}`] || ''}
          onClose={handleCloseModal}
          onToggleComplete={() => toggleDia(`${selectedDay.semana}-${selectedDay.dia}`)}
          onSetObservacao={setObservacao}
          onPrevDay={() => navigateDay(-1)}
          onNextDay={() => navigateDay(1)}
          hasPrev={currentDayIndex > 0}
          hasNext={currentDayIndex < allDays.length - 1}
        />
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowResetConfirm(false)} />
          <div className="relative bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-white mb-2">Resetar Progresso?</h3>
            <p className="text-slate-400 mb-6">Esta ação não pode ser desfeita. Todo o seu progresso será perdido.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
              >
                Resetar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;