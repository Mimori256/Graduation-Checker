import type { SelectResult } from "../types/SelectResult";

import {
  countByGroup,
  getSignAndStatus,
  selectResultUnitCount,
} from "../features/utils";

import { SelectDetails } from "./Details";
import { GroupCheck } from "./GroupCheck";

import styles from "../styles/GraduationChecker.module.css";

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
    <div>
      <details>
        <summary>
          {selectResult.requirement.message}
          <span className={styles[status]}>{sign}</span>
          {unitCount}({selectResult.requirement.minimum}~
          {selectResult.requirement.maximum})
        </summary>
        <SelectDetails
          result={selectResult}
          includeCourseYear={includeCourseYear}
        />
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
