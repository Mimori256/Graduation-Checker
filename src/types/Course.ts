export type Grade =
  | "A+"
  | "A"
  | "B"
  | "C"
  | "D"
  | "P"
  | "F"
  | "認"
  | "履修中"
  | "Error";

export type GradesIncludedInCalc = Exclude<
  Grade,
  "P" | "F" | "認" | "履修中" | "Error"
>;

export interface Course {
  id: string;
  name: string;
  unit: number;
  grade: Grade;
  year: number;
}
