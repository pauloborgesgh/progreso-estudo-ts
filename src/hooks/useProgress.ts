import { useCallback, useEffect, useState } from "react";
import type { CourseId } from "../data/roadmap-data";

interface ProgressState {
  completed: number[];
  subtopics: Record<number, number[]>;
  notes: Record<string, string>;
}

const empty: ProgressState = { completed: [], subtopics: {}, notes: {} };

function read(key: string): ProgressState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      subtopics: parsed.subtopics ?? {},
      notes: parsed.notes ?? {},
    };
  } catch {
    return empty;
  }
}

export function useProgress(course: CourseId) {
  const storageKey = `js-roadmap-${course}-v1`;
  const [state, setState] = useState<ProgressState>(() => read(storageKey));
  const hydrated = true;

  // Sync from localStorage when course changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(read(storageKey));
  }, [storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  const toggleTopic = useCallback((id: number) => {
    setState((s) => {
      const set = new Set(s.completed);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...s, completed: [...set] };
    });
  }, []);

  const toggleSubtopic = useCallback((topicId: number, index: number) => {
    setState((s) => {
      const current = new Set(s.subtopics[topicId] ?? []);
      if (current.has(index)) current.delete(index);
      else current.add(index);
      return { ...s, subtopics: { ...s.subtopics, [topicId]: [...current] } };
    });
  }, []);

  const setNote = useCallback((topicId: number, index: number, text: string) => {
    setState((s) => {
      const key = `${topicId}:${index}`;
      const notes = { ...s.notes };
      if (text.trim() === "") delete notes[key];
      else notes[key] = text;
      return { ...s, notes };
    });
  }, []);

  const getNote = useCallback(
    (topicId: number, index: number) => state.notes[`${topicId}:${index}`] ?? "",
    [state.notes],
  );

  const reset = useCallback(() => setState(empty), []);

  const exportJson = useCallback(() => JSON.stringify(state, null, 2), [state]);

  const importJson = useCallback((raw: string) => {
    try {
      const parsed = JSON.parse(raw) as Partial<ProgressState>;
      setState({
        completed: Array.isArray(parsed.completed) ? parsed.completed : [],
        subtopics: parsed.subtopics ?? {},
        notes: parsed.notes ?? {},
      });
      return true;
    } catch {
      return false;
    }
  }, []);

  const isCompleted = useCallback((id: number) => state.completed.includes(id), [state.completed]);
  const subtopicsDone = useCallback(
    (id: number) => state.subtopics[id] ?? [],
    [state.subtopics],
  );

  return {
    hydrated,
    completedCount: state.completed.length,
    isCompleted,
    subtopicsDone,
    toggleTopic,
    toggleSubtopic,
    setNote,
    getNote,
    reset,
    exportJson,
    importJson,
  };
}
