import type { Course } from "./Course";

export interface CompulsoryResult {
  name: string;
  isCourseGroup: boolean;
  passed: boolean;
  minimumUnit?: number;
  courses: Course[];
  alternative?: string;
  alternativeCourseNumber?: number;
}
