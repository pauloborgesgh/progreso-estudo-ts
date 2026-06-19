import { createContext } from "react";
import type { CourseId, Topic } from "../data/roadmap-data";

export interface CourseContextType {
  course: CourseId;
  setCourse: (c: CourseId) => void;
  topics: Topic[];
}

export const CourseContext = createContext<CourseContextType | null>(null);
