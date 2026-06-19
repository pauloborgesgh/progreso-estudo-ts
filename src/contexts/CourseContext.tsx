import { useEffect, useState, type ReactNode } from "react";
import type { CourseId } from "../data/roadmap-data";
import { courseTopics } from "../data/roadmap-data";
import { CourseContext } from "./course-context";

const COURSE_KEY = "js-roadmap-active-course";

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
