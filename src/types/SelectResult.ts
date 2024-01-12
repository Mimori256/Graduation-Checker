import type { SelectRequirement } from "./SelectRequirement";
import type { Course } from "./Course";

export interface SelectResult {
  requirement: SelectRequirement;
  courses: Course[];
}
