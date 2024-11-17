import type { CompulsoryResult } from "../types/CompulsoryResult";
import type { SelectResult } from "../types/SelectResult";

import styles from "../styles/CourseTable.module.css";

interface DetailProps {
  readonly result: CompulsoryResult | SelectResult;
  readonly includeCourseYear: boolean;
}

export const Details = ({ result, includeCourseYear }: DetailProps) => {
  if (result.courses.length === 0) {
    return <></>;
  }
  return (
    <>
      {result.courses.map((course) => {
        return (
          <tr>
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

export const SelectDetails = ({ result, includeCourseYear }: DetailProps) => {
  if (result.courses.length === 0) {
    return <tr></tr>;
  }
  return (
    <>
      {result.courses.map((course) => {
        return (
          <tr>
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
