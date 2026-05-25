import { useState, useCallback } from 'react';
import type { Progresso, CursoId } from '../types/study';

function storageKey(cursoId: CursoId): string {
  return `${cursoId}-study-progress`;
}

function hoje(): string {
  return new Date().toISOString().split('T')[0];
}

function loadProgress(cursoId: CursoId): Progresso {
  const stored = localStorage.getItem(storageKey(cursoId));
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { diasConcluidos: [], dataInicio: null, observacoes: {}, observacoesTopicos: {}, codigosUsuario: {}, datasEstudo: [] };
    }
  }
  return { diasConcluidos: [], dataInicio: null, observacoes: {}, observacoesTopicos: {}, codigosUsuario: {}, datasEstudo: [] };
}

function saveProgress(cursoId: CursoId, progress: Progresso) {
  localStorage.setItem(storageKey(cursoId), JSON.stringify(progress));
}

export function useStudyProgress(cursoId: CursoId) {
  const [progress, setProgress] = useState<Progresso>(() => loadProgress(cursoId));

  const toggleDia = useCallback((diaId: string) => {
    setProgress(prev => {
      const isCompleted = prev.diasConcluidos.includes(diaId);
      const newDias = isCompleted
        ? prev.diasConcluidos.filter(d => d !== diaId)
        : [...prev.diasConcluidos, diaId];

      const newProgress = { ...prev, diasConcluidos: newDias };

      if (!prev.dataInicio && newDias.length > 0) {
        newProgress.dataInicio = hoje();
      }

      if (!isCompleted) {
        const today = hoje();
        if (!newProgress.datasEstudo.includes(today)) {
          newProgress.datasEstudo = [...newProgress.datasEstudo, today];
        }
      }

      saveProgress(cursoId, newProgress);
      return newProgress;
    });
  }, [cursoId]);

  const setObservacao = useCallback((diaId: string, texto: string) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        observacoes: { ...prev.observacoes, [diaId]: texto }
      };
      saveProgress(cursoId, newProgress);
      return newProgress;
    });
  }, [cursoId]);

  const setObservacaoTopico = useCallback((topicoKey: string, texto: string) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        observacoesTopicos: { ...prev.observacoesTopicos, [topicoKey]: texto }
      };
      saveProgress(cursoId, newProgress);
      return newProgress;
    });
  }, [cursoId]);

  const setCodigoUsuario = useCallback((diaId: string, codigo: string) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        codigosUsuario: { ...prev.codigosUsuario, [diaId]: codigo }
      };
      saveProgress(cursoId, newProgress);
      return newProgress;
    });
  }, [cursoId]);

  const resetProgress = useCallback(() => {
    const reset = { diasConcluidos: [], dataInicio: null, observacoes: {}, observacoesTopicos: {}, codigosUsuario: {}, datasEstudo: [] };
    setProgress(reset);
    localStorage.removeItem(storageKey(cursoId));
  }, [cursoId]);

  const isDiaCompleted = useCallback((diaId: string) => {
    return progress.diasConcluidos.includes(diaId);
  }, [progress.diasConcluidos]);

  const getProgressoSemana = useCallback((semanaIndex: number, totalDias: number) => {
    const diasDaSemana = Array.from({ length: totalDias }, (_, i) => `${semanaIndex}-${i + 1}`);
    const concluidos = diasDaSemana.filter(d => progress.diasConcluidos.includes(d)).length;
    return Math.round((concluidos / totalDias) * 100);
  }, [progress.diasConcluidos]);

  const getTotalProgresso = useCallback((totalDias: number) => {
    return Math.round((progress.diasConcluidos.length / totalDias) * 100);
  }, [progress.diasConcluidos]);

  const getStreak = useCallback((): number => {
    if (progress.datasEstudo.length === 0) return 0;
    const sorted = [...progress.datasEstudo].sort().reverse();
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < Math.max(sorted.length, 365); i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      if (sorted.includes(dateStr)) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [progress.datasEstudo]);

  const getWeekStats = useCallback(() => {
    const today = new Date();
    const weekDays: { date: string; studied: boolean }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      weekDays.push({ date: dateStr, studied: progress.datasEstudo.includes(dateStr) });
    }
    const daysStudied = weekDays.filter(d => d.studied).length;
    return { weekDays, daysStudied };
  }, [progress.datasEstudo]);

  const registrarDataEstudo = useCallback(() => {
    const today = hoje();
    setProgress(prev => {
      if (prev.datasEstudo.includes(today)) return prev;
      const newProgress = { ...prev, datasEstudo: [...prev.datasEstudo, today] };
      saveProgress(cursoId, newProgress);
      return newProgress;
    });
  }, [cursoId]);

  const exportProgress = useCallback(() => {
    const data = JSON.stringify(progress, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cursoId}-study-progress-${hoje()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [progress, cursoId]);

  const importProgress = useCallback((jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') return false;
      if (!Array.isArray(data.diasConcluidos)) return false;
      if (data.dataInicio !== null && typeof data.dataInicio !== 'string') return false;
      if (typeof data.observacoes !== 'object') return false;
      if (data.observacoesTopicos && typeof data.observacoesTopicos !== 'object') return false;
      if (data.codigosUsuario && typeof data.codigosUsuario !== 'object') return false;
      if (!Array.isArray(data.datasEstudo)) return false;

      const imported: Progresso = {
        diasConcluidos: data.diasConcluidos,
        dataInicio: data.dataInicio,
        observacoes: data.observacoes,
        observacoesTopicos: data.observacoesTopicos || {},
        codigosUsuario: data.codigosUsuario || {},
        datasEstudo: data.datasEstudo,
      };

      setProgress(imported);
      localStorage.setItem(storageKey(cursoId), JSON.stringify(imported));
      return true;
    } catch {
      return false;
    }
  }, [cursoId]);

  return {
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
  };
}