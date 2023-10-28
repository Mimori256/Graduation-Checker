import Course from "./Course.ts";

const calcUnitsPerGrades = (courses: Course[], targetGrades: Grade[]) => {
  const ratioPerGrade = targetGrades
    .map((grade) => ({ [grade]: 0 }))
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});

  courses
    .filter((c) => targetGrades.includes(c.grade))
    .forEach((course) => {
      const { grade, unit } = course;
      ratioPerGrade[grade] += unit;
    });

  return ratioPerGrade;
};

export default calcUnitsPerGrades;
