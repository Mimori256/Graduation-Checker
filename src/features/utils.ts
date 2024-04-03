import type { CompulsoryResult } from "../types/CompulsoryResult";
import type { Course } from "../types/Course";
import type { KdbCourse } from "../types/KdbCourse";
import type { SelectResult } from "../types/SelectResult";

import { errorCourse, statusSignMap } from "../consts/const";

export const isFailed = (grade: string): boolean =>
  grade === "F" || grade === "D";

export const getAcademicYear = (): string => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  return `${month < 4 ? year - 1 : year}`;
};

export const createElementList = (
  element: "id" | "grade" | "name",
  courseList: Course[],
): string[] => {
  return courseList.map((c) =>
    c[element].includes("//") ? c[element].split("//")[0] : c[element],
  );
};
export const beginWithMatch = (code: string, codeList: string[]): boolean =>
  codeList.some((c) => code.startsWith(c));

export const searchCourse = (
  type: "id" | "name",
  query: string,
  courseList: Course[],
): Course => {
  const foundCourse =
    type === "id"
      ? courseList.find((course) => course.id === query)
      : courseList.find((course) => course.name === query);

  return foundCourse ?? errorCourse;
};

export const getSignAndStatus = (result: CompulsoryResult | SelectResult) => {
  let status: keyof typeof statusSignMap;
  // if the type is compulsory
  if ("isCourseGroup" in result) {
    if (result.passed) {
      if (result.courses.every((c) => c.grade !== "履修中")) {
        status = "passed";
      } else {
        status = "taking";
      }
    } else {
      status = "failed";
    }
    return [status, statusSignMap[status]];
  }

  // if the type is select
  const unitCount = selectResultUnitCount([result]);
  const validUnitCount = selectValidUnitCount([result]);
  if (validUnitCount >= result.requirement.minimum) {
    status = "passed";
  } else if (unitCount >= result.requirement.minimum) {
    status = "taking";
  } else {
    status = "failed";
  }
  return [status, statusSignMap[status]];
};

export const compulsoryResultUnitCount = (
  compulsoryResults: CompulsoryResult[],
): number => {
  let unitCount = 0;
  for (const compulsoryResult of compulsoryResults) {
    let tmpUnitCount = 0;
    for (const course of compulsoryResult.courses) {
      if (!isFailed(course.grade)) {
        tmpUnitCount += course.unit;
      }
    }
    if (compulsoryResult.isCourseGroup && compulsoryResult.minimumUnit) {
      unitCount += Math.min(tmpUnitCount, compulsoryResult.minimumUnit);
    } else {
      unitCount += tmpUnitCount;
    }
  }
  return unitCount;
};

export const selectResultUnitCount = (selectResultList: SelectResult[]) => {
  let unitCount = 0;
  for (const selectResult of selectResultList) {
    let tmpUnitCount = 0;
    for (const course of selectResult.courses) {
      if (!isFailed(course.grade)) {
        tmpUnitCount += course.unit;
      }
    }
    unitCount += tmpUnitCount;
  }
  return unitCount;
};

export const selectValidUnitCount = (selectResultList: SelectResult[]) => {
  let unitCount = 0;
  for (const selectResult of selectResultList) {
    let tmpUnitCount = 0;
    for (const course of selectResult.courses) {
      if (!isFailed(course.grade) && course.grade !== "履修中") {
        tmpUnitCount += course.unit;
      }
    }
    unitCount += tmpUnitCount;
  }
  return unitCount;
};

export const countByGroup = (selectResults: SelectResult[]) => {
  return selectResults.reduce(
    (res, selectResult) => {
      const group = selectResult.requirement.group.toString();
      res[group] = (res[group] || 0) + selectResultUnitCount([selectResult]);
      return res;
    },
    {} as { [key: string]: number },
  );
};

const isAvailableSelectCourse = (courseName: string) => {
  const exceptionCourses = [
    "卒業研究",
    "専門英語",
    "専門語学",
    "実験A",
    "実験B",
    "実習A",
    "実習B",
    "知識情報演習",
    "アカデミックスキルズ",
  ] as const;

  for (const exceptionCourse of exceptionCourses) {
    if (courseName.includes(exceptionCourse)) {
      return false;
    }
  }

  return true;
};

export const searchCourseFromKdb = (
  idList: string[],
  kdbData: KdbCourse[],
  compulsoryList: string[],
): KdbCourse[] => {
  const res: KdbCourse[] = [];
  for (const course of kdbData) {
    if (
      idList.some(
        (id) =>
          course.id.includes(id) &&
          !compulsoryList.includes(course.name) &&
          isAvailableSelectCourse(course.name),
      )
    ) {
      res.push(course);
    }
  }
  return res;
};
