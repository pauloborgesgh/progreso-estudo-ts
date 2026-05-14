import { useState, useCallback } from 'react';
import type { Progresso } from '../types/study';

const STORAGE_KEY = 'ts-study-progress';

function hoje(): string {
  return new Date().toISOString().split('T')[0];
}

function loadProgress(): Progresso {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { diasConcluidos: [], dataInicio: null, observacoes: {}, datasEstudo: [] };
    }
  }
  return { diasConcluidos: [], dataInicio: null, observacoes: {}, datasEstudo: [] };
}

function saveProgress(progress: Progresso) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function useStudyProgress() {
  const [progress, setProgress] = useState<Progresso>(loadProgress);

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

      saveProgress(newProgress);
      return newProgress;
    });
  }, []);

  const setObservacao = useCallback((diaId: string, texto: string) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        observacoes: { ...prev.observacoes, [diaId]: texto }
      };
      saveProgress(newProgress);
      return newProgress;
    });
  }, []);

  const resetProgress = useCallback(() => {
    const reset = { diasConcluidos: [], dataInicio: null, observacoes: {}, datasEstudo: [] };
    setProgress(reset);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

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
      saveProgress(newProgress);
      return newProgress;
    });
  }, []);

  return {
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
  };
}