import type { CompulsoryResult } from "../types/CompulsoryResult";

import { compulsoryResultUnitCount, getSignAndStatus } from "../features/utils";

import { Details } from "./Details";

import styles from "../styles/GraduationChecker.module.css";
import tableStyles from "../styles/CourseTable.module.css";

interface CompulsoryProps {
  readonly compulsoryResultList: CompulsoryResult[];
  readonly includeCourseYear: boolean;
  readonly minimumUnit: number;
}

interface SubjectProps {
  readonly compulsoryResult: CompulsoryResult;
  readonly includeCourseYear: boolean;
}

const SingleCompulsorySubject = ({
  compulsoryResult,
  includeCourseYear,
}: SubjectProps) => {
  const [status, sign] = getSignAndStatus(compulsoryResult);
  if (compulsoryResult.courses.length === 0) {
    return (
      <tr>
        <td></td>
        <td>{compulsoryResult.name}</td>
        <td></td>
        <td>
          <span className={styles[status]}>{sign}</span>
        </td>
      </tr>
    );
  }
  const course = compulsoryResult.courses[0];
  return (
    <tr>
      <td>{course.id}</td>
      <td>
        {course.name}
        {includeCourseYear && `(${course.year})`}
      </td>
      <td>{course.unit}単位</td>
      <td>
        <span className={styles[status]}>{sign}</span>
      </td>
    </tr>
  );
};

const CompulsoryCourseGroup = ({
  compulsoryResult,
  includeCourseYear,
}: SubjectProps) => {
  const [status, sign] = getSignAndStatus(compulsoryResult);
  return (
    <div className={tableStyles.table}>
      <details open>
        <summary>
          {compulsoryResult.name.split("::")[0]}{" "}
          <span className={styles[status]}>{sign}</span>
          {compulsoryResultUnitCount([compulsoryResult])}/
          {compulsoryResult.minimumUnit}単位
        </summary>
        <table>
          <thead>
            <tr>
              <th>科目番号</th>
              <th>科目名</th>
              <th className={tableStyles.unit}>単位数</th>
              <th className={tableStyles.grade}>成績</th>
            </tr>
          </thead>
          <tbody>
            <Details
              result={compulsoryResult}
              includeCourseYear={includeCourseYear}
            />
          </tbody>
        </table>
      </details>
    </div>
  );
};

export const Compulsory = ({
  compulsoryResultList,
  includeCourseYear,
  minimumUnit,
}: CompulsoryProps) => {
  const sumUnit = compulsoryResultUnitCount(compulsoryResultList);
  const compulsoryCourseGroups = compulsoryResultList.filter(
    (compulsoryResult) => compulsoryResult.isCourseGroup,
  );
  const compulsoryNonCourseGroups = compulsoryResultList.filter(
    (compulsoryResult) => !compulsoryResult.isCourseGroup,
  );
  return (
    <div className={styles.block}>
      <div className={tableStyles.table}>
        <h2>必修科目</h2>
        <table>
          <thead>
            <tr>
              <th>科目番号</th>
              <th>科目名</th>
              <th className={tableStyles.unit}>単位数</th>
              <th className={tableStyles.grade}>合否</th>
            </tr>
          </thead>
          <tbody>
            {compulsoryNonCourseGroups.map((compulsoryResult) => (
              <SingleCompulsorySubject
                key={compulsoryResult.name}
                compulsoryResult={compulsoryResult}
                includeCourseYear={includeCourseYear}
              />
            ))}
          </tbody>
        </table>
        {compulsoryCourseGroups.map((compulsoryResult) => (
          <CompulsoryCourseGroup
            key={compulsoryResult.name}
            compulsoryResult={compulsoryResult}
            includeCourseYear={includeCourseYear}
          />
        ))}
        <div className={styles.total}>
          <b>
            {sumUnit}/{minimumUnit}単位
          </b>
        </div>
      </div>
    </div>
  );
};
