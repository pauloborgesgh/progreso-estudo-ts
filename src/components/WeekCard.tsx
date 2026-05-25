import { memo, useMemo, useState } from 'react';
import { CheckCircle, Circle, Target, ChevronDown, Sparkles, BookOpen } from 'lucide-react';
import type { CursoId } from '../types/study';

interface WeekCardProps {
  semana: import('../types/study').Semana;
  isExpanded: boolean;
  onOpenDay: (semana: number, dia: number) => void;
  isDiaCompleted: (diaId: string) => boolean;
  progresso: number;
  cursoId: CursoId;
}

const weekGradients = [
  'from-blue-500/20 to-cyan-500/20',
  'from-purple-500/20 to-pink-500/20',
  'from-green-500/20 to-emerald-500/20',
  'from-orange-500/20 to-amber-500/20',
  'from-red-500/20 to-rose-500/20',
  'from-indigo-500/20 to-violet-500/20',
];

const WeekCard = memo(function WeekCard({ semana, isExpanded, onOpenDay, isDiaCompleted, progresso, cursoId }: WeekCardProps) {
  const [showInstrucoes, setShowInstrucoes] = useState(false);
  const diasConcluidos = useMemo(
    () => semana.dias.filter((d) => isDiaCompleted(`${semana.semana}-${d.dia}`)).length,
    [semana.dias, isDiaCompleted, semana.semana]
  );
  const todosConcluidos = useMemo(
    () => diasConcluidos === semana.dias.length,
    [diasConcluidos, semana.dias.length]
  );
  const gradient = weekGradients[(semana.semana - 1) % weekGradients.length];

  const cores = cursoId === 'js'
    ? {
        gradiente: 'from-yellow-400 to-amber-400',
        barra: 'from-yellow-400 via-amber-500 to-orange-500',
        botao: 'text-yellow-400 hover:text-yellow-300',
        caixa: 'bg-yellow-500/10 border-yellow-500/20',
        caixaTexto: 'text-yellow-300',
      }
    : {
        gradiente: 'from-blue-400 to-cyan-400',
        barra: 'from-blue-500 via-cyan-400 to-purple-500',
        botao: 'text-blue-400 hover:text-blue-300',
        caixa: 'bg-blue-500/10 border-blue-500/20',
        caixaTexto: 'text-blue-300',
      };

  return (
    <div
      className={`rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-black/20 ${
        todosConcluidos
          ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/10 border-green-500/30'
          : `bg-gradient-to-br ${gradient} hover:border-white/20`
      }`}
      style={todosConcluidos ? {} : { borderColor: 'var(--border-color)' }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm ${
              todosConcluidos ? 'bg-green-500/30' : 'bg-white/10'
            }`}>
              {todosConcluidos ? '✅' : semana.semana}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                  todosConcluidos
                    ? 'bg-green-500/30 text-green-400'
                    : 'text-slate-300'
                }`}
                style={todosConcluidos ? {} : { backgroundColor: 'var(--bg-card)' }}>
                  SEMANA {semana.semana}
                </span>
                {todosConcluidos && (
                  <span className="text-green-400 text-xs font-medium flex items-center gap-1.5 bg-green-500/20 px-2.5 py-1 rounded-lg">
                    <Sparkles className="w-3 h-3" />
                    Completa
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{semana.titulo}</h2>
              <p className="text-sm max-w-xl" style={{ color: 'var(--text-secondary)' }}>{semana.descricao}</p>

              <button
                onClick={() => setShowInstrucoes(!showInstrucoes)}
                className={`mt-3 flex items-center gap-1.5 text-xs ${cores.botao} transition-colors`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                {showInstrucoes ? 'Ocultar' : 'Como usar esta semana'}
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${showInstrucoes ? 'rotate-180' : ''}`}
                />
              </button>

              {showInstrucoes && (
                <div className={`mt-3 p-3 rounded-lg ${cores.caixa} animate-fadeIn`}>
                  <p className={`${cores.caixaTexto} text-sm leading-relaxed`}>{semana.instrucoes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <div className={`text-3xl font-black ${
              todosConcluidos ? 'text-green-400' : `bg-gradient-to-r ${cores.gradiente} bg-clip-text text-transparent`
            }`}>
              {progresso}%
            </div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {diasConcluidos}/{semana.dias.length} dias
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="h-2.5 rounded-full overflow-hidden backdrop-blur-sm" style={{ backgroundColor: 'var(--bg-card)' }}>
            <div
              className={`h-full transition-all duration-700 rounded-full ${
                todosConcluidos
                  ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                  : `bg-gradient-to-r ${cores.barra}`
              }`}
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>
      </div>

      {/* Days Grid */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {semana.dias.map((dia) => {
            const completed = isDiaCompleted(`${semana.semana}-${dia.dia}`);
            return (
              <button
                key={dia.dia}
                onClick={() => onOpenDay(semana.semana, dia.dia)}
                className={`group relative p-3 rounded-xl text-left transition-all duration-200 ${
                  completed
                    ? 'bg-green-500/20 hover:bg-green-500/30'
                    : 'hover:bg-white/10'
                }`}
                style={completed ? {} : { backgroundColor: 'var(--bg-card)' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  {completed ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                  )}
                  <span className={`text-sm font-semibold ${completed ? 'text-green-400' : ''}`} style={completed ? {} : { color: 'var(--text-secondary)' }}>
                    Dia {dia.dia}
                  </span>
                </div>
                <p className="text-xs truncate pr-4" style={{ color: 'var(--text-muted)' }}>{dia.titulo}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mini Projeto Expandido */}
      {isExpanded && (
        <div className="px-6 pb-6 pt-5" style={{ borderTopColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2 mb-4" style={{ color: 'var(--text-secondary)' }}>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Target className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-sm font-semibold">Mini-Projeto da Semana</span>
          </div>
          <div className="rounded-xl p-5 backdrop-blur-sm" style={{ backgroundColor: 'var(--bg-card)' }}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{semana.miniProjeto.titulo}</h3>
              <ChevronDown className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{semana.miniProjeto.descricao}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {semana.miniProjeto.requisitos.map((req, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span style={{ color: 'var(--text-secondary)' }}>{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default WeekCard;