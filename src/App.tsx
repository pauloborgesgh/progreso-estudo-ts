import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { BookOpen, RotateCcw, Calendar, Download, Upload, Sun, Moon } from 'lucide-react';
import { useStudyProgress } from './hooks/useStudyProgress';
import { useTheme } from './hooks/useTheme';
import { tsStudyPlan, jsStudyPlan } from './data/index';
import type { CursoId } from './types/study';
import { cursos } from './types/study';
import WeekCard from './components/WeekCard';
import DayModal from './components/DayModal';
import ProgressBar from './components/ProgressBar';
import PomodoroTimer from './components/PomodoroTimer';
import StatisticsPanel from './components/StatisticsPanel';
import StatsDashboard from './components/StatsDashboard';

function App() {
  const [cursoAtivo, setCursoAtivo] = useState<CursoId>('ts');
  const [selectedDay, setSelectedDay] = useState<{ semana: number; dia: number } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const planoEstudo = cursoAtivo === 'ts' ? tsStudyPlan : jsStudyPlan;

  const {
    progress,
    toggleDia,
    setObservacao,
    setObservacaoTopico,
    setCodigoUsuario,
    resetProgress,
    isDiaCompleted,
    getProgressoSemana,
    getTotalProgresso,
    getStreak,
    getWeekStats,
    registrarDataEstudo,
    exportProgress,
    importProgress,
  } = useStudyProgress(cursoAtivo);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const success = importProgress(content);
        if (success) {
          alert('Progresso importado com sucesso!');
        } else {
          alert('Erro: arquivo inválido.');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [importProgress]);

  const streak = useMemo(getStreak, [getStreak]);
  const weekStats = useMemo(getWeekStats, [getWeekStats]);

  // Animação de entrada - useLayoutEffect seria mais adequado, mas useEffect serve
  useEffect(() => {
    requestAnimationFrame(() => setIsMounted(true));
  }, []);

  const totalDias = useMemo(() => planoEstudo.length * 5, [planoEstudo]);

  const progressoPorSemana = useMemo(
    () => planoEstudo.map(s => getProgressoSemana(s.semana, 5)),
    [planoEstudo, getProgressoSemana]
  );

  const selectedSemana = useMemo(
    () => (selectedDay ? planoEstudo[selectedDay.semana - 1] : null),
    [selectedDay, planoEstudo]
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
  }, [planoEstudo]);

  // Navegação por teclado global
  useEffect(() => {
    if (!selectedDay) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return;
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

  // Atalhos globais: h=home, s=stats, 1=TS, 2=JS
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return;
      if (selectedDay) return;
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      if (e.key === 'h') window.scrollTo({ top: 0, behavior: 'smooth' });
      if (e.key === 's') {
        document.querySelector('[data-stats]')?.scrollIntoView({ behavior: 'smooth' });
      }
      if (e.key === '1') setCursoAtivo('ts');
      if (e.key === '2') setCursoAtivo('js');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDay]);

  const allDays = useMemo(() => {
    const days: { semana: number; dia: number }[] = [];
    for (const s of planoEstudo) {
      for (const d of s.dias) {
        days.push({ semana: s.semana, dia: d.dia });
      }
    }
    return days;
  }, [planoEstudo]);

  const currentDayIndex = useMemo(
    () => (selectedDay ? allDays.findIndex(d => d.semana === selectedDay.semana && d.dia === selectedDay.dia) : -1),
    [selectedDay, allDays]
  );

  const handleReset = useCallback(() => {
    resetProgress();
    setShowResetConfirm(false);
  }, [resetProgress]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <header className="relative border-b backdrop-blur-xl sticky top-0 z-10" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex rounded-xl p-0.5 flex-shrink-0" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <button
                  onClick={() => setCursoAtivo('ts')}
                  className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    cursoAtivo === 'ts'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md'
                      : ''
                  }`}
                  style={cursoAtivo !== 'ts' ? { color: 'var(--text-secondary)' } : {}}
                  aria-label="Curso TypeScript"
                >
                  TS
                </button>
                <button
                  onClick={() => setCursoAtivo('js')}
                  className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    cursoAtivo === 'js'
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-md'
                      : ''
                  }`}
                  style={cursoAtivo !== 'js' ? { color: 'var(--text-secondary)' } : {}}
                  aria-label="Curso JavaScript"
                >
                  JS
                </button>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight truncate" style={{ color: 'var(--text-primary)' }}>
                  {cursoAtivo === 'ts' ? 'TypeScript' : 'JavaScript'} Study Plan
                </h1>
                <p className="text-xs sm:text-sm truncate" style={{ color: 'var(--text-muted)' }}>
                  {cursos.find(c => c.id === cursoAtivo)!.semanas} semanas • {cursos.find(c => c.id === cursoAtivo)!.totalDias} dias • 1 hora/dia
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-all"
                style={{ color: 'var(--text-secondary)' }}
                aria-label={`Modo ${theme === 'dark' ? 'claro' : 'escuro'}`}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <PomodoroTimer cursoId={cursoAtivo} onSessionComplete={registrarDataEstudo} />
              {progress.dataInicio && (
                <span className="hidden md:flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg" style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-card)' }}>
                  <Calendar className="w-4 h-4" />
                  {new Date(progress.dataInicio).toLocaleDateString('pt-BR')}
                </span>
              )}
              <button
                onClick={() => setShowResetConfirm(true)}
                className="transition-colors p-2 rounded-lg"
                style={{ color: 'var(--text-muted)' }}
                aria-label="Resetar progresso"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className={`relative max-w-6xl mx-auto px-4 py-8 transition-all duration-700 ${isMounted ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
        <div data-stats>
          <StatisticsPanel
            streak={streak}
            weekDays={weekStats.weekDays}
            daysStudied={weekStats.daysStudied}
            sessionsToday={0}
            totalDias={totalDias}
            diasConcluidos={progress.diasConcluidos.length}
          />
          <StatsDashboard
            datasEstudo={progress.datasEstudo}
            progressoPorSemana={progressoPorSemana}
            planoEstudo={planoEstudo}
            diasConcluidos={progress.diasConcluidos.length}
            totalDias={totalDias}
          />
        </div>

        {/* Main Progress */}
        <div className="border rounded-2xl p-6 mb-8 backdrop-blur-sm" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Progresso Geral</h2>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent" aria-live="polite">
              {getTotalProgresso(totalDias)}%
            </span>
          </div>
          <ProgressBar value={getTotalProgresso(totalDias)} color="from-blue-500 via-cyan-400 to-purple-500" />
          <div className="flex justify-between mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <span>Início</span>
            <span>{Math.round((100 - getTotalProgresso(totalDias)) * 0.3)} dias restantes (estimado)</span>
            <span>Fim</span>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTopColor: 'var(--border-color)' }}>
            <button
              onClick={exportProgress}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)' }}
            >
              <Download className="w-3.5 h-3.5" />
              Exportar Progresso
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)' }}
            >
              <Upload className="w-3.5 h-3.5" />
              Importar Progresso
            </button>
            <button
              onClick={() => {
                const data = JSON.stringify(planoEstudo, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${cursoAtivo}-study-plan.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)' }}
            >
              <Download className="w-3.5 h-3.5" />
              Plano (JSON)
            </button>
            <button
              onClick={() => {
                const lines: string[] = [];
                lines.push(`# ${cursoAtivo === 'ts' ? 'TypeScript' : 'JavaScript'} Study Plan`);
                lines.push('');
                for (const semana of planoEstudo) {
                  lines.push(`## Semana ${semana.semana}: ${semana.titulo}`);
                  lines.push('');
                  lines.push(semana.descricao);
                  lines.push('');
                  for (const dia of semana.dias) {
                    lines.push(`### Dia ${dia.dia}: ${dia.titulo}`);
                    lines.push('');
                    lines.push(`**Teoria:** ${dia.teoria}`);
                    lines.push('');
                    lines.push(`**Exercício:** ${dia.exercicio}`);
                    lines.push('');
                    lines.push('**Tópicos:**');
                    for (const topico of dia.topicos) {
                      lines.push(`- ${topico.titulo}: ${topico.descricao}`);
                    }
                    lines.push('');
                  }
                  lines.push(`**Mini-Projeto:** ${semana.miniProjeto.titulo} — ${semana.miniProjeto.descricao}`);
                  lines.push('');
                }
                const data = lines.join('\n');
                const blob = new Blob([data], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${cursoAtivo}-study-plan.md`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)' }}
            >
              <Download className="w-3.5 h-3.5" />
              Plano (MD)
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
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
                key={`${cursoAtivo}-${semana.semana}`}
                semana={semana}
                isExpanded={progress.diasConcluidos.some((d) => d.startsWith(`${semana.semana}-`))}
                onOpenDay={handleOpenDay}
                isDiaCompleted={isDiaCompleted}
                progresso={getProgressoSemana(semana.semana, 5)}
                cursoId={cursoAtivo}
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
          observacoesTopicos={progress.observacoesTopicos}
          codigoUsuario={progress.codigosUsuario[`${selectedDay.semana}-${selectedDay.dia}`] || ''}
          onClose={handleCloseModal}
          onToggleComplete={() => toggleDia(`${selectedDay.semana}-${selectedDay.dia}`)}
          onSetObservacao={setObservacao}
          onSetObservacaoTopico={setObservacaoTopico}
          onSetCodigoUsuario={setCodigoUsuario}
          onPrevDay={() => navigateDay(-1)}
          onNextDay={() => navigateDay(1)}
          hasPrev={currentDayIndex > 0}
          hasNext={currentDayIndex < allDays.length - 1}
        />
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="reset-title">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowResetConfirm(false)} />
          <div className="relative rounded-2xl p-6 max-w-sm w-full" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <h3 id="reset-title" className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Resetar Progresso?</h3>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Esta ação não pode ser desfeita. Todo o seu progresso será perdido.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl transition-colors font-medium"
                style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
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