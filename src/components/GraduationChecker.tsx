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
  requirementType: Major;
  courseList: Course[];
  includeCourseYear: boolean;
}

interface LeftCoursesProps {
  leftCourseList: Course[];
}

interface TotalCountProps {
  groupCount: { [key: string]: number };
  groups: any[];
  compulsoryUnitCount: number;
}

interface GpaSectionProps {
  courses: Course[];
}

const LeftCourses = ({ leftCourseList }: LeftCoursesProps) => {
  if (leftCourseList.length === 0) {
    return <div />;
  }
  return (
    <div>
      {leftCourseList.map((course) => {
        return (
          <div>
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
  let sign;
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
        累計GPAの計算式は『
        <a href="https://www.tsukuba.ac.jp/education/ug-courses-gpa/pdf/gpaqa_students.pdf">
          GPA制度へのQA 学生用
        </a>
        』に基づいています
      </p>
      <p>
        {gpa ? (
          <span className="total-gpa">{gpa.toFixed(2)}</span>
        ) : (
          <span>科目データが与えられていません</span>
        )}
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
  return (
    <div className={styles.content}>
      <p className={styles.title}>
        {header.department} {header.major} {header.enrollYear}年度
      </p>
      <Compulsory
        compulsoryResultList={compulsoryResultList}
        includeCourseYear={includeCourseYear}
        minimumUnit={minimumUnit}
      />
      <Select
        selectResultList={selectResultList}
        includeCourseYear={includeCourseYear}
        requirement={requirement}
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
