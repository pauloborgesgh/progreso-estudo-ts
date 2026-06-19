import { useCallback, useMemo, useState } from "react";
import type { CourseId } from "../data/roadmap-data";

const STREAK_KEY = "js-roadmap-streak-v1";

function loadDates(course: CourseId): string[] {
  try {
    const raw = localStorage.getItem(`${STREAK_KEY}-${course}`);
    if (raw) return JSON.parse(raw) as string[];
  } catch { /* ignore */ }
  return [];
}

function saveDates(course: CourseId, dates: string[]) {
  try {
    localStorage.setItem(`${STREAK_KEY}-${course}`, JSON.stringify(dates));
  } catch { /* ignore */ }
}

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...dates].sort().reverse();
  let streak = 0;
  const todayStr = today();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

  if (sorted[0] !== todayStr && sorted[0] !== yesterdayStr) return 0;

  const day = new Date(sorted[0]);
  for (let i = 0; i < sorted.length; i++) {
    const expected = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
    if (sorted[i] !== expected) break;
    streak++;
    day.setDate(day.getDate() - 1);
  }
  return streak;
}

export function useStreak(course: CourseId) {
  const [dates, setDates] = useState(() => loadDates(course));

  const streak = useMemo(() => computeStreak(dates), [dates]);

  const recordStudy = useCallback(() => {
    const todayStr = today();
    setDates((prev) => {
      if (prev.includes(todayStr)) return prev;
      const next = [...prev, todayStr];
      saveDates(course, next);
      return next;
    });
  }, [course]);

  return { streak, dates, recordStudy };
}
