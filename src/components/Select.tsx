import type { SelectResult } from "../types/SelectResult";
import type { GradRequirement } from "../data/gradRequirementData";

import {
  countByGroup,
  getSignAndStatus,
  selectResultUnitCount,
} from "../features/utils";

import { SelectDetails } from "./Details";
import { GroupCheck } from "./GroupCheck";

import styles from "../styles/GraduationChecker.module.css";
import tableStyles from "../styles/CourseTable.module.css";

interface ResultProps {
  readonly selectResultList: SelectResult[];
  readonly includeCourseYear: boolean;
  readonly requirement: GradRequirement;
  readonly isSorted: boolean;
}

interface RequirementProps {
  readonly selectResult: SelectResult;
  readonly includeCourseYear: boolean;
  isSorted: boolean;
}

const Requirement = ({
  selectResult,
  includeCourseYear,
  isSorted,
}: RequirementProps) => {
  const unitCount = selectResultUnitCount([selectResult]);
  const [status, sign] = getSignAndStatus(selectResult);

  return (
    <div className={tableStyles.table}>
      <details open>
        <summary>
          {selectResult.requirement.message}
          <span className={styles[status]}>{sign}</span>
          {unitCount}({selectResult.requirement.minimum}~
          {selectResult.requirement.maximum})
        </summary>
        <table>
          <thead>
            <tr>
              <th>科目番号</th>
              <th>科目名</th>
              <th>単位数</th>
              <th>成績</th>
            </tr>
          </thead>
          <tbody>
            <SelectDetails
              result={selectResult}
              includeCourseYear={includeCourseYear}
              sorted={isSorted}
            />
          </tbody>
        </table>
      </details>
    </div>
  );
};

export const Select = ({
  selectResultList,
  includeCourseYear,
  requirement,
  isSorted,
}: ResultProps) => {
  return (
    <div className={styles.select}>
      {selectResultList.map((selectResult) => {
        return (
          <Requirement
            key={selectResult.requirement.message}
            selectResult={selectResult}
            includeCourseYear={includeCourseYear}
            isSorted={isSorted}
          />
        );
      })}
      <GroupCheck
        groupCount={countByGroup(selectResultList)}
        requirement={requirement}
      />
    </div>
  );
};
