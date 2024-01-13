import type { Group } from "../types/Group";

import styles from "../styles/Select.module.css";

interface GroupProps {
  readonly groupCount: { [key: string]: number };
  readonly requirement: any;
}

interface GroupSectionProps {
  readonly groupCount: { [key: string]: number };
  readonly courseGroup: any;
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
  let passedElement;
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
    <div>
      <p className={styles.semiBold}>{message}</p>
      {groupCount[group]}/({minimum}~{maximum}){passedElement}
    </div>
  );
};

export const GroupCheck = ({ groupCount, requirement }: GroupProps) => {
  const courseGroups: Group[] = requirement.courses.groups;
  return (
    <div className={styles.group}>
      {courseGroups.map((courseGroup) => {
        return (
          <GroupSection groupCount={groupCount} courseGroup={courseGroup} />
        );
      })}
      <div className={styles.bold}>
        {totalUnitCount(groupCount, courseGroups)}/
        {requirement.courses.selectMinimumUnit}単位
      </div>
    </div>
  );
};
