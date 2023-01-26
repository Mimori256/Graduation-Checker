import Course from "./Course";
import calcUnitsPerGrades from "./calcUnitsPerGrades";

type GradesIncludedInGPA = Exclude<
  Grade,
  "P" | "F" | "認" | "履修中" | "Error"
>;

const gradesIncludedInGPA: Grade[] = ["A+", "A", "B", "C", "D"];

const gradePoints: {
  [grade in Grade as GradesIncludedInGPA]: number;
} = {
  "A+": 4.3,
  A: 4.0,
  B: 3.0,
  C: 2.0,
  D: 0.0,
};

const calcGPA = (courses: Course[]) => {
  const unitsPerGrades = calcUnitsPerGrades(courses, gradesIncludedInGPA);
  const totalUnits = Object.values(unitsPerGrades).reduce(
    (acc, cur) => acc + cur,
    0
  );
  const totalGradePoints = Object.entries(unitsPerGrades).reduce(
    (acc, [grade, units]) =>
      acc + gradePoints[grade as GradesIncludedInGPA] * units,
    0
  );
  return totalGradePoints / totalUnits;
};

const TotalGPA = ({ courses }: { courses: Course[] | null }) => (
  <>
    <h3>累計GPA</h3>
    <p className="total-gpa-notice">
      累計GPAの計算式は『
      <a href="https://www.tsukuba.ac.jp/education/ug-courses-gpa/pdf/gpaqa_students.pdf">
        GPA制度へのQA 学生用
      </a>
      』に基づいています
    </p>
    <p>
      {courses ? (
        <span className="total-gpa">{calcGPA(courses).toFixed(2)}</span>
      ) : (
        <>科目データが与えられていません</>
      )}
    </p>
  </>
);

export { TotalGPA };
