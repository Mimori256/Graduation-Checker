import type { Course, Grade, GradesIncludedInCalc } from "../types/Course";

const gradesIncludeCalcs: Grade[] = ["A+", "A", "B", "C", "D"];

const gradePoints: {
  [grade in Grade as GradesIncludedInCalc]: number;
} = {
  "A+": 4.3,
  A: 4.0,
  B: 3.0,
  C: 2.0,
  D: 0.0,
};

export const calcUnitsPerGrades = (
  courses: Course[],
  targetGrades: Grade[],
) => {
  const ratioPerGrade: { [key in Grade]: number } = {
    "A+": 0,
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    P: 0,
    F: 0,
    認: 0,
    履修中: 0,
    Error: 0,
  };

  for (const course of courses) {
    const { grade, unit } = course;
    if (targetGrades.includes(grade)) {
      ratioPerGrade[grade] += unit;
    }
  }

  return ratioPerGrade;
};

export const calcGpa = (courses: Course[]) => {
  const unitsPerGrades = calcUnitsPerGrades(courses, gradesIncludeCalcs);
  const totalUnits = Object.values(unitsPerGrades).reduce(
    (acc, cur) => acc + cur,
    0,
  );
  const totalGradePoints = Object.entries(unitsPerGrades).reduce(
    (acc, [grade, units]) => {
      if (units !== 0) {
        return acc + gradePoints[grade as GradesIncludedInCalc] * units;
      }
      return acc;
    },
    0,
  );

  return totalGradePoints / totalUnits;
};
