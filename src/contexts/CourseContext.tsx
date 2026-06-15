import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CourseId, Topic } from "../data/roadmap-data";
import { courseTopics } from "../data/roadmap-data";

const COURSE_KEY = "js-roadmap-active-course";

interface CourseContextType {
  course: CourseId;
  setCourse: (c: CourseId) => void;
  topics: Topic[];
}

const CourseContext = createContext<CourseContextType | null>(null);

function loadCourse(): CourseId {
  try {
    const saved = localStorage.getItem(COURSE_KEY);
    if (saved === "js" || saved === "ts" || saved === "angular") return saved;
  } catch { /* ignore */ }
  return "js";
}

export function CourseProvider({ children }: { children: ReactNode }) {
  const [course, setCourse] = useState<CourseId>(loadCourse);

  useEffect(() => {
    try { localStorage.setItem(COURSE_KEY, course); } catch { /* ignore */ }
  }, [course]);

  return (
    <CourseContext.Provider value={{ course, setCourse, topics: courseTopics[course] }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error("useCourse must be used within CourseProvider");
  return ctx;
}
