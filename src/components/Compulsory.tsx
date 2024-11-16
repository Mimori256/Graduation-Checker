import type { CompulsoryResult } from "../types/CompulsoryResult";

import { compulsoryResultUnitCount, getSignAndStatus } from "../features/utils";

import { Details } from "./Details";

import styles from "../styles/GraduationChecker.module.css";

interface CompulsoryProps {
  readonly compulsoryResultList: CompulsoryResult[];
  readonly includeCourseYear: boolean;
  readonly minimumUnit: number;
}

interface SubjectProps {
  readonly compulsoryResult: CompulsoryResult;
  readonly includeCourseYear: boolean;
}

export const Subject = ({
  compulsoryResult,
  includeCourseYear,
}: SubjectProps) => {
  const [status, sign] = getSignAndStatus(compulsoryResult);

  if (compulsoryResult.isCourseGroup) {
    return (
      <div>
        <details>
          <summary>
            {compulsoryResult.name.split("::")[0]}{" "}
            <span className={styles[status]}>{sign}</span>
            {compulsoryResultUnitCount([compulsoryResult])}/
            {compulsoryResult.minimumUnit}単位
          </summary>
          <Details
            result={compulsoryResult}
            includeCourseYear={includeCourseYear}
          />
        </details>
      </div>
    );
  }
  if (compulsoryResult.courses.length === 0) {
    return (
      <div>
        {compulsoryResult.name}
        <span className={styles[status]}>{sign}</span>
      </div>
    );
  }
  const yearElement = includeCourseYear ? (
    <span>({compulsoryResult.courses[0].year})</span>
  ) : null;
  return (
    <div>
      {compulsoryResult.name}
      {yearElement}
      <span className={styles[status]}>{sign}</span>
      {compulsoryResult.courses[0].unit}単位
    </div>
  );
};

export const Compulsory = ({
  compulsoryResultList,
  includeCourseYear,
  minimumUnit,
}: CompulsoryProps) => {
  const sumUnit = compulsoryResultUnitCount(compulsoryResultList);
  return (
    <div className={styles.block}>
      <h2>必修科目</h2>
      {compulsoryResultList.map((compulsoryResult) => {
        return (
          <Subject
            key={compulsoryResult.name}
            compulsoryResult={compulsoryResult}
            includeCourseYear={includeCourseYear}
          />
        );
      })}
      <div className={styles.bold}>
        {sumUnit}/{minimumUnit}単位
      </div>
    </div>
  );
};
