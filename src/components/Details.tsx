import type { CompulsoryResult } from "../types/CompulsoryResult";
import type { SelectResult } from "../types/SelectResult";
import { sortByGrade } from "../features/utils";

import styles from "../styles/CourseTable.module.css";

interface DetailsProps {
  readonly result: CompulsoryResult;
  readonly includeCourseYear: boolean;
}

interface SelectDetailsProps {
  readonly result: SelectResult;
  readonly includeCourseYear: boolean;
  readonly sorted: boolean;
}

export const Details = ({ result, includeCourseYear }: DetailsProps) => {
  if (!result.courses) {
    return <></>;
  }
  return (
    <>
      {result.courses.map((course) => {
        return (
          <tr key={course.id}>
            <td className={styles.courseId}>{course.id}</td>
            <td className={styles.courseName}>
              {course.name} {includeCourseYear ? `(${course.year})` : ""}
            </td>
            <td className={styles.unit}>{course.unit}単位</td>
            <td className={styles.grade}>{course.grade}</td>
          </tr>
        );
      })}
    </>
  );
};

export const SelectDetails = ({
  result,
  includeCourseYear,
  sorted,
}: SelectDetailsProps) => {
  if (result.courses.length === 0) {
    return <tr />;
  }
  const sortedCourses = sorted ? sortByGrade(result.courses) : result.courses;
  return (
    <>
      {sortedCourses.map((course) => {
        let grade = course.grade.toLowerCase();
        grade = grade.replace("+", "p");
        grade = grade.replace("認定", "nin");
        grade = grade.replace("履修中", "taking");
        const gradeColor = sorted ? styles[grade] : "";
        return (
          <tr key={course.id} className={gradeColor}>
            <td className={styles.courseId}>{course.id}</td>
            <td className={styles.courseName}>
              {course.name} {includeCourseYear ? `(${course.year}年度)` : ""}
            </td>
            <td className={styles.unit}>{course.unit}単位</td>
            <td className={styles.grade}>{course.grade}</td>
          </tr>
        );
      })}
    </>
  );
};
