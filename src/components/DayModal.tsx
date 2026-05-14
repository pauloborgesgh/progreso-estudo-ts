import { useState, memo, useCallback, useEffect, useRef } from 'react';
import { X, CheckCircle, Circle, BookOpen, Code, FileText, Save, Lightbulb, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Semana, Dia } from '../types/study';

interface DayModalProps {
  semana: Semana;
  dia: Dia;
  diaId: string;
  isCompleted: boolean;
  observacao: string;
  onClose: () => void;
  onToggleComplete: () => void;
  onSetObservacao: (diaId: string, texto: string) => void;
  onPrevDay?: () => void;
  onNextDay?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

const tabs = [
  { id: 'teoria' as const, label: 'Teoria', icon: BookOpen, color: 'blue' },
  { id: 'exercicio' as const, label: 'Exercício', icon: FileText, color: 'green' },
  { id: 'codigo' as const, label: 'Código', icon: Code, color: 'purple' },
] as const;

const DayModal = memo(function DayModal({
  semana,
  dia,
  diaId,
  isCompleted,
  observacao,
  onClose,
  onToggleComplete,
  onSetObservacao,
  onPrevDay,
  onNextDay,
  hasPrev,
  hasNext,
}: DayModalProps) {
  const [activeTab, setActiveTab] = useState<'teoria' | 'exercicio' | 'codigo'>('teoria');
  const [localObs, setLocalObs] = useState(observacao);
  const [copied, setCopied] = useState(false);
  const prevObservacao = useRef(observacao);

  // Sincroniza localObs quando observacao mudar (来自父组件)
  useEffect(() => {
    if (observacao !== prevObservacao.current) {
      prevObservacao.current = observacao;
      setLocalObs(observacao);
    }
  }, [observacao]);

  // Ctrl+S para salvar anotações
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (activeTab === 'exercicio') {
          onSetObservacao(diaId, localObs);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, diaId, localObs, onSetObservacao]);

  const handleSaveObs = useCallback(() => {
    onSetObservacao(diaId, localObs);
  }, [diaId, localObs, onSetObservacao]);

  const handleCopyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
  }, []);

  // Cleanup do timeout
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div
        className="relative flex flex-col bg-[#12121a] rounded-2xl border border-white/10 w-full max-w-3xl max-h-[90vh] shadow-2xl shadow-black/50"
      >
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  SEMANA {semana.semana}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  DIA {dia.dia}
                </span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                    isCompleted
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isCompleted ? '✓ Concluído' : 'Pendente'}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">{dia.titulo}</h2>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Navegação entre dias */}
              <div className="flex items-center gap-1 mr-2 pr-2 border-r border-white/10">
                <button
                  onClick={onPrevDay}
                  disabled={!hasPrev}
                  className={`p-2 rounded-lg transition-all ${
                    hasPrev
                      ? 'text-slate-400 hover:text-white hover:bg-white/10'
                      : 'text-slate-700 cursor-not-allowed'
                  }`}
                  title="Dia anterior (←)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-slate-600 font-mono">← →</span>
                <button
                  onClick={onNextDay}
                  disabled={!hasNext}
                  className={`p-2 rounded-lg transition-all ${
                    hasNext
                      ? 'text-slate-400 hover:text-white hover:bg-white/10'
                      : 'text-slate-700 cursor-not-allowed'
                  }`}
                  title="Próximo dia (→)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={onToggleComplete}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                  isCompleted
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                }`}
                title="Marcar/desmarcar conclusão"
              >
                {isCompleted ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Concluído</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" />
                    <span>Marcar</span>
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                title="Fechar (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? `text-${tab.color}-400 bg-${tab.color}-500/10 border-b-2 border-${tab.color}-400`
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4a5568 #1a1a2e' }}>
          {activeTab === 'teoria' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-xl p-5 border border-blue-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="text-blue-400 font-semibold">Teoria</h3>
                </div>
                <p className="text-slate-300 leading-relaxed">{dia.teoria}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-bold">
                    {dia.topicos.length}
                  </span>
                  Tópicos do Dia
                </h3>
                <div className="grid gap-3">
                  {dia.topicos.map((topico, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-white/5 rounded-lg p-3.5 border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {i + 1}
                      </div>
                      <span className="text-slate-300">{topico}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'exercicio' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-xl p-5 border border-green-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-green-400" />
                  </div>
                  <h3 className="text-green-400 font-semibold">Exercício do Dia</h3>
                </div>
                <p className="text-slate-300 leading-relaxed text-lg">{dia.exercicio}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Save className="w-4 h-4 text-purple-400" />
                  Minhas Anotações
                </h3>
                <textarea
                  value={localObs}
                  onChange={(e) => setLocalObs(e.target.value)}
                  placeholder="Escreva suas anotações, dúvidas ou insights aqui..."
                  className="w-full h-48 max-h-64 overflow-y-auto bg-white/5 rounded-xl p-4 text-slate-300 placeholder-slate-600 border border-white/10 focus:border-purple-500 focus:outline-none resize-none transition-colors"
                  style={{ scrollbarWidth: 'thin', scrollbarColor: '#4a5568 #1a1a2e' }}
                />
                <button
                  onClick={handleSaveObs}
                  className="mt-3 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-opacity font-semibold"
                >
                  <Save className="w-4 h-4" />
                  Salvar Anotações
                  <span className="text-xs text-white/50 ml-1 hidden sm:inline">Ctrl+S</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'codigo' && (
            <div className="space-y-6 animate-fadeIn">
              {dia.codigoInicial && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Code className="w-4 h-4 text-blue-400" />
                      Código Inicial
                    </h3>
                    <button
                      onClick={() => handleCopyCode(dia.codigoInicial!)}
                      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                  <pre className="bg-[#0a0a0f] rounded-xl p-5 overflow-x-auto border border-white/10 font-mono text-sm">
                    <code className="text-slate-400 whitespace-pre">{dia.codigoInicial}</code>
                  </pre>
                </div>
              )}

              {dia.codigoSolucao && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-green-400 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Solução
                    </h3>
                    <button
                      onClick={() => handleCopyCode(dia.codigoSolucao!)}
                      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                  <pre className="bg-[#0a0a0f] rounded-xl p-5 overflow-x-auto border border-green-500/20 font-mono text-sm">
                    <code className="text-slate-300 whitespace-pre">{dia.codigoSolucao}</code>
                  </pre>
                </div>
              )}

              {!dia.codigoInicial && !dia.codigoSolucao && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Code className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-slate-500">Este dia ainda não possui código de exemplo.</p>
                  <p className="text-slate-600 text-sm mt-2">Continue estudando para mais conteúdo!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default DayModal;