import { useState } from "preact/hooks";

import type { Course } from "../types/Course";
import type { Major } from "../types/Major";

import { calcGpa } from "../features/calcGPA";
import { checkCompulsory } from "../features/checkCompulsory";
import { checkSelect } from "../features/checkSelect";
import { compulsoryResultUnitCount, countByGroup } from "../features/utils";

import { Compulsory } from "./Compulsory";
import { GradePieChart } from "./GradePieChart";
import { Select } from "./Select";

import { statusSignMap } from "../consts/const";
import requirements from "../data/major.json";
import styles from "../styles/GraduationChecker.module.css";

interface GraduationCheckerProps {
  readonly requirementType: Major;
  readonly courseList: Course[];
  readonly includeCourseYear: boolean;
}

interface LeftCoursesProps {
  readonly leftCourseList: Course[];
}

interface TotalCountProps {
  readonly groupCount: { [key: string]: number };
  readonly groups: any[];
  readonly compulsoryUnitCount: number;
}

interface GpaSectionProps {
  readonly courses: Course[];
}

const LeftCourses = ({ leftCourseList }: LeftCoursesProps) => {
  if (leftCourseList.length === 0) {
    return <div />;
  }
  return (
    <div>
      {leftCourseList.map((course) => {
        return (
          <div key={course.id}>
            <p>卒業要件に含まれない単位</p>
            <p>
              {course.name} {course.unit}単位
            </p>
          </div>
        );
      })}
    </div>
  );
};

const TotalCount = ({
  groupCount,
  groups,
  compulsoryUnitCount,
}: TotalCountProps) => {
  let total = compulsoryUnitCount;
  let status: keyof typeof statusSignMap;
  let sign: string;
  const values = Object.values(groupCount);
  for (let i = 0; i < values.length; i++) {
    total += Math.min(values[i], groups[i][2]);
  }
  if (total >= 124) {
    status = "passed";
    sign = statusSignMap[status];
  } else {
    status = "failed";
    sign = statusSignMap[status];
  }
  return (
    <div className={styles.total}>
      合計 {total}/124<span className={styles[status]}>{sign}</span>
    </div>
  );
};

const GpaSection = ({ courses }: GpaSectionProps) => {
  const gpa = calcGpa(courses);
  return (
    <div>
      <h3>累計GPA</h3>
      <p>
        {gpa ? (
          <span className={styles.total}>{gpa.toFixed(2)}</span>
        ) : (
          <span>科目データが与えられていません</span>
        )}
      </p>

      <p>
        累計GPAの計算式は『
        <a href="https://www.tsukuba.ac.jp/education/ug-courses-gpa/pdf/gpaqa_students.pdf">
          GPA制度へのQA 学生用
        </a>
        』に基づいています
      </p>
    </div>
  );
};

export const GraduationChecker = ({
  requirementType,
  courseList,
  includeCourseYear,
}: GraduationCheckerProps) => {
  const gradRequirements = requirements;
  const requirement = gradRequirements[requirementType];
  const header = requirement.header;
  const minimumUnit = requirement.courses.compulsorySumUnit;
  if (courseList.length === 0) {
    return <div />;
  }
  const { compulsoryResultList, newCourseList } = checkCompulsory(
    courseList,
    requirement,
  );
  const { selectResultList, leftCourseList } = checkSelect(
    newCourseList,
    requirement,
  );
  const groupCount: { [key: string]: number } = countByGroup(selectResultList);
  const groups = requirement.courses.groups;
  const compulsoryUnitCount = compulsoryResultUnitCount(compulsoryResultList);
  const [isSorted, setIsSorted] = useState(false);
  return (
    <div className={styles.content}>
      <p className={styles.title}>
        {header.department} {header.major} {header.enrollYear}年度
      </p>
      <h2>必修科目</h2>
      <Compulsory
        compulsoryResultList={compulsoryResultList}
        includeCourseYear={includeCourseYear}
        minimumUnit={minimumUnit}
      />
      <h2>選択科目</h2>
      <div>
        <label htmlFor="sortByGrade">成績順にソート</label>
        <input
          id="sortByGrade"
          type="checkbox"
          onClick={() => setIsSorted(!isSorted)}
        />
      </div>
      <Select
        selectResultList={selectResultList}
        includeCourseYear={includeCourseYear}
        requirement={requirement}
        isSorted={isSorted}
      />
      <LeftCourses leftCourseList={leftCourseList} />
      <TotalCount
        groupCount={groupCount}
        groups={groups}
        compulsoryUnitCount={compulsoryUnitCount}
      />
      <GpaSection courses={courseList} />
      <div className={styles.ratio}>
        <GradePieChart courseList={courseList} />
      </div>
    </div>
  );
};
