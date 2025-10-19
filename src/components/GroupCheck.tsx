import type { JSX } from "preact";
import type { GradRequirement } from "../data/gradRequirementData";
import type { Group } from "../types/Group";

import styles from "../styles/GraduationChecker.module.css";
import tableStyles from "../styles/CourseTable.module.css";

interface GroupProps {
  readonly groupCount: { [key: string]: number };
  readonly requirement: GradRequirement;
}

interface GroupSectionProps {
  readonly groupCount: { [key: string]: number };
  readonly courseGroup: Group;
}

const totalUnitCount = (
  groupCount: { [key: string]: number },
  courseGroups: Group[],
) => {
  const groupValues = Object.values(groupCount);
  let total = 0;
  for (let i = 0; i < groupValues.length; i++) {
    total += Math.min(groupValues[i], courseGroups[i][2]);
  }
  return total;
};

const GroupSection = ({ groupCount, courseGroup }: GroupSectionProps) => {
  const group: string = courseGroup[0].toString();
  const minimum: number = courseGroup[1];
  const maximum: number = courseGroup[2];
  const message: string = courseGroup[3];
  let passedElement: JSX.Element;
  if (groupCount[group] > maximum) {
    passedElement = (
      <span>
        <span className={styles.passed}>〇</span>(単位条件を超えています)
      </span>
    );
  } else if (groupCount[group] >= minimum) {
    passedElement = <span className={styles.passed}>〇</span>;
  } else {
    passedElement = <span className={styles.failed}>✖</span>;
  }
  return (
    <tr>
      <td>{message}</td>
      <td>{groupCount[group]}</td>
      <td>
        {minimum}~{maximum}
      </td>
      <td>{passedElement}</td>
    </tr>
  );
};

export const GroupCheck = ({ groupCount, requirement }: GroupProps) => {
  const courseGroups: Group[] = requirement.courses.groups as Group[];
  return (
    <div className={styles.groupCheck}>
      <div className={tableStyles.table}>
        <table>
          <thead>
            <tr>
              <th>科目グループ</th>
              <th>取得単位数</th>
              <th>最低/最高単位数</th>
              <th>合否</th>
            </tr>
          </thead>
          <tbody>
            {courseGroups.map((courseGroup) => {
              return (
                <GroupSection
                  key={courseGroup}
                  groupCount={groupCount}
                  courseGroup={courseGroup}
                />
              );
            })}
          </tbody>
        </table>
        <div className={styles.total}>
          <b>
            {Math.min(
              totalUnitCount(groupCount, courseGroups),
              requirement.courses.selectMinimumUnit,
            )}
            /{requirement.courses.selectMinimumUnit}単位
          </b>
        </div>
      </div>
    </div>
  );
};
