import Course from "./Course";
import type { Grade } from "./data/grade";

export const calcUnitsPerGrades = (
  courses: Course[],
  targetGrades: Grade[]
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

  courses
    .filter((c) => targetGrades.includes(c.grade))
    .map((course) => {
      const { grade, unit } = course;
      ratioPerGrade[grade] += unit;
    });

  return ratioPerGrade;
};

export default calcUnitsPerGrades;
