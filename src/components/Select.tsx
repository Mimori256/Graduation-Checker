import type { SelectResult } from "../types/SelectResult";

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
  readonly requirement: any;
}

interface RequirementProps {
  readonly selectResult: SelectResult;
  readonly includeCourseYear: boolean;
}

const Requirement = ({ selectResult, includeCourseYear }: RequirementProps) => {
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
}: ResultProps) => {
  return (
    <div className={styles.select}>
      <h2>選択科目</h2>
      {selectResultList.map((selectResult) => {
        return (
          <Requirement
            key={selectResult}
            selectResult={selectResult}
            includeCourseYear={includeCourseYear}
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
