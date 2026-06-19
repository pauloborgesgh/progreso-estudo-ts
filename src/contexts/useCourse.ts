import { useContext } from "react";
import { CourseContext, type CourseContextType } from "./course-context";

export function useCourse(): CourseContextType {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error("useCourse must be used within CourseProvider");
  return ctx;
}
