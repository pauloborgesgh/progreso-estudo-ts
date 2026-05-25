import { useState, memo, useCallback, useEffect, useRef } from 'react';
import { X, CheckCircle, Circle, BookOpen, Code, FileText, Save, Lightbulb, Copy, Check, ChevronLeft, ChevronRight, ChevronDown, Maximize2, Minimize2, Play, RotateCcw } from 'lucide-react';
import type { Semana, Dia } from '../types/study';

interface DayModalProps {
  semana: Semana;
  dia: Dia;
  diaId: string;
  isCompleted: boolean;
  observacao: string;
  observacoesTopicos: Record<string, string>;
  codigoUsuario: string;
  onClose: () => void;
  onToggleComplete: () => void;
  onSetObservacao: (diaId: string, texto: string) => void;
  onSetObservacaoTopico: (topicoKey: string, texto: string) => void;
  onSetCodigoUsuario: (diaId: string, codigo: string) => void;
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
  observacoesTopicos,
  codigoUsuario,
  onClose,
  onToggleComplete,
  onSetObservacao,
  onSetObservacaoTopico,
  onSetCodigoUsuario,
  onPrevDay,
  onNextDay,
  hasPrev,
  hasNext,
}: DayModalProps) {
  const [activeTab, setActiveTab] = useState<'teoria' | 'exercicio' | 'codigo'>('teoria');
  const [expandedTopico, setExpandedTopico] = useState<number | null>(null);
  const [localObs, setLocalObs] = useState(observacao);
  const [copied, setCopied] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [codeOutput, setCodeOutput] = useState('');
  const [codeError, setCodeError] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const prevObservacao = useRef(observacao);
  const prevCodigo = useRef(codigoUsuario);

  const initialCode = codigoUsuario || dia.codigoInicial || '';
  const [localCode, setLocalCode] = useState(initialCode);

  // Sincroniza localCode quando codigoUsuario mudar
  useEffect(() => {
    if (codigoUsuario !== prevCodigo.current) {
      prevCodigo.current = codigoUsuario;
      setLocalCode(codigoUsuario || dia.codigoInicial || '');
    }
  }, [codigoUsuario, dia.codigoInicial]);

  // Auto-salva código com debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localCode !== (codigoUsuario || '')) {
        onSetCodigoUsuario(diaId, localCode);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [localCode, diaId, onSetCodigoUsuario, codigoUsuario]);

  const handleRestoreCode = useCallback(() => {
    setLocalCode(dia.codigoInicial || '');
  }, [dia.codigoInicial]);

  const handleRunCode = useCallback(() => {
    setCodeError('');
    setCodeOutput('');
    try {
      const logs: string[] = [];
      const mockConsole = {
        log: (...args: unknown[]) => logs.push(args.map(a =>
          typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
        ).join(' ')),
        error: (...args: unknown[]) => logs.push('❌ ' + args.map(a => String(a)).join(' ')),
      };
      const fn = new Function('console', localCode);
      fn(mockConsole);
      setCodeOutput(logs.join('\n') || '(sem saída)');
    } catch (e: unknown) {
      setCodeError('❌ ' + (e instanceof Error ? e.message : String(e)));
    }
  }, [localCode]);

  // Sincroniza localObs quando observacao mudar
  useEffect(() => {
    if (observacao !== prevObservacao.current) {
      prevObservacao.current = observacao;
      setLocalObs(observacao);
    }
  }, [observacao]);

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

  // Atalhos de teclado: t/e/c para abas, f para foco
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return;
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      if (e.key === 't') setActiveTab('teoria');
      if (e.key === 'e') setActiveTab('exercicio');
      if (e.key === 'c') setActiveTab('codigo');
      if (e.key === 'f') setFocusMode(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${focusMode ? 'p-0' : 'p-4'}`} role="dialog" aria-modal="true" aria-label={`Dia ${dia.dia}: ${dia.titulo}`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div
        className={`relative flex flex-col ${focusMode ? 'rounded-none' : 'rounded-2xl'} border w-full ${focusMode ? 'max-w-full max-h-full' : 'max-w-3xl max-h-[90vh]'} shadow-2xl shadow-black/50`}
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
      >
        {/* Header (hidden in focus mode) */}
        {!focusMode && (
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
                onClick={() => setFocusMode(prev => !prev)}
                className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                title="Modo foco (F)"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
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
        )}

        {/* Focus mode mini bar */}
        {focusMode && (
          <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                SEMANA {semana.semana} • DIA {dia.dia}
              </span>
              <span className="text-slate-400 text-sm">{dia.titulo}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onPrevDay}
                disabled={!hasPrev}
                className={`p-1.5 rounded-lg transition-all ${
                  hasPrev ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-700 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={onNextDay}
                disabled={!hasNext}
                className={`p-1.5 rounded-lg transition-all ${
                  hasNext ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-700 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setFocusMode(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                title="Sair do modo foco (F)"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`flex-1 px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? `text-${tab.color}-400 bg-${tab.color}-500/10 border-b-2 border-${tab.color}-400`
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
                <div className="space-y-2">
                  {dia.topicos.map((topico, i) => (
                    <div
                      key={i}
                      className="bg-white/5 rounded-lg border border-white/5 overflow-hidden transition-all duration-200"
                    >
                      <button
                        onClick={() => setExpandedTopico(expandedTopico === i ? null : i)}
                        className="w-full flex items-center gap-3 p-3.5 hover:bg-white/[0.07] transition-colors text-left"
                        aria-expanded={expandedTopico === i}
                        aria-controls={`topico-content-${i}`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                          {i + 1}
                        </div>
                        <span className="flex-1 font-medium" style={{ color: 'var(--text-secondary)' }}>{topico.titulo}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            expandedTopico === i ? 'rotate-180' : ''
                          }`}
                          style={{ color: 'var(--text-muted)' }}
                        />
                      </button>
                      {expandedTopico === i && (
                        <div id={`topico-content-${i}`} className="px-3.5 pb-3.5 pt-0 border-t border-white/5 mt-0 animate-fadeIn">
                          <p className="text-slate-400 text-sm leading-relaxed pl-10">{topico.descricao}</p>
                          {topico.exemplo && (
                            <pre className="bg-[#0a0a0f] rounded-xl p-4 mt-3 ml-10 overflow-x-auto border border-white/10 font-mono text-sm">
                              <code className="text-slate-300 whitespace-pre">{topico.exemplo}</code>
                            </pre>
                          )}
                          <div className="mt-3 ml-10">
                            <textarea
                              value={observacoesTopicos[`${diaId}-${i}`] || ''}
                              onChange={(e) => onSetObservacaoTopico(`${diaId}-${i}`, e.target.value)}
                              placeholder="Anotações sobre este tópico..."
                              className="w-full bg-white/5 rounded-lg p-3 text-xs text-slate-300 placeholder-slate-600 border border-white/10 focus:border-purple-500 focus:outline-none resize-none transition-colors"
                              rows={2}
                              style={{ scrollbarWidth: 'thin', scrollbarColor: '#4a5568 #1a1a2e' }}
                            />
                          </div>
                        </div>
                      )}
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
            <div className="space-y-4 animate-fadeIn">
              {/* Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <Code className="w-4 h-4 text-blue-400" />
                    Editor de Código
                  </h3>
                  <div className="flex items-center gap-1.5">
                    {dia.codigoInicial && (
                      <button
                        onClick={handleRestoreCode}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        <RotateCcw className="w-3 h-3" />
                        Restaurar
                      </button>
                    )}
                    {dia.codigoSolucao && (
                      <button
                        onClick={() => setShowSolution(prev => !prev)}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors"
                        style={{ color: showSolution ? '#22c55e' : 'var(--text-muted)' }}
                      >
                        <CheckCircle className="w-3 h-3" />
                        {showSolution ? 'Ocultar' : 'Solução'}
                      </button>
                    )}
                  </div>
                </div>
                <textarea
                  value={localCode}
                  onChange={(e) => setLocalCode(e.target.value)}
                  className="w-full min-h-[200px] font-mono text-sm p-4 rounded-xl resize-y transition-colors"
                  style={{
                    backgroundColor: '#0a0a0f',
                    color: '#e2e8f0',
                    border: '1px solid var(--border-color)',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#4a5568 #0a0a0f',
                  }}
                  placeholder="// Escreva seu código aqui..."
                  spellCheck={false}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunCode}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:opacity-90 transition-opacity font-semibold"
                >
                  <Play className="w-4 h-4" />
                  Executar
                  <span className="text-xs text-white/50 ml-1 hidden sm:inline">Ctrl+Enter</span>
                </button>
              </div>

              {/* Output */}
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
                <div className="px-4 py-2 text-xs font-semibold" style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-card)' }}>
                  Saída
                </div>
                <div
                  className="p-4 font-mono text-sm min-h-[60px] max-h-[200px] overflow-y-auto"
                  style={{
                    backgroundColor: '#0a0a0f',
                    color: '#94a3b8',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#4a5568 #0a0a0f',
                  }}
                >
                  <code style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {codeOutput || codeError || 'Clique em "Executar" para ver o resultado...'}
                  </code>
                </div>
              </div>

              {/* Solução (revelada) */}
              {showSolution && dia.codigoSolucao && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: '#22c55e' }}>
                      <CheckCircle className="w-4 h-4" />
                      Solução
                    </h3>
                    <button
                      onClick={() => handleCopyCode(dia.codigoSolucao!)}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                  <pre className="rounded-xl p-4 overflow-x-auto font-mono text-sm" style={{ backgroundColor: '#0a0a0f', border: '1px solid rgba(34,197,94,0.3)' }}>
                    <code style={{ color: '#e2e8f0', whiteSpace: 'pre' }}>{dia.codigoSolucao}</code>
                  </pre>
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