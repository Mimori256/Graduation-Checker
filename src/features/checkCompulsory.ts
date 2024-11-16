import type { CompulsoryResult } from "../types/CompulsoryResult";
import type { Course, Grade } from "../types/Course";

import {
  beginWithMatch,
  createElementList,
  isFailed,
  searchCourse,
} from "./utils";

import { compulsoryEnglishDict } from "../consts/const";
import { codeType } from "../consts/courseCodeTypes";

const checkCourseCertificate = (courseList: Course[]): Course[] => {
  courseList.map((c) => {
    if (c.grade === "認" && compulsoryEnglishDict[c.name] !== undefined) {
      c.id = compulsoryEnglishDict[c.name];
    }
  });

  return courseList;
};

const checkAlternativeRequirement = (
  courseNameList: string[],
  alternativeRequirement: string[],
): boolean =>
  alternativeRequirement.every((requiredCourse) =>
    courseNameList.includes(requiredCourse),
  );

interface CheckCompulsoryResult {
  compulsoryResultList: CompulsoryResult[];
  newCourseList: Course[];
}

export const checkCompulsory = (
  courseListSource: Course[],
  requirement: any,
): CheckCompulsoryResult => {
  // Preprocess
  const courseList = checkCourseCertificate(courseListSource);
  const compulsoryList: string[] = requirement.courses.compulsory;
  const idList: string[] = createElementList("id", courseList);
  const nameList: string[] = createElementList("name", courseList);
  const excludeCourseList: Course[] = [];
  let codes: string[];
  let except: string[];
  let alternativeRequirement: string[] = [];
  let courseTag: string;
  let unitNumber: number;
  let courseName: string;
  let courseGrade: Grade;
  let detectedCourses: Course[] = [];
  let courseExists: boolean;
  let alternativeExists: boolean;
  const compulsoryResultList: CompulsoryResult[] = [];

  compulsoryList.map((compulsory) => {
    // Initialize
    courseName = compulsory;
    detectedCourses = [];
    courseExists = false;
    alternativeExists = false;

    // Check if the requirement has alternative courses
    if (courseName.includes("//")) {
      alternativeRequirement = JSON.parse(
        courseName.split("//")[1].replace(/'/g, '"'),
      );
      courseName = courseName.split("//")[0];
      alternativeExists = true;
    }

    // Check if the requirement is a course tag instead of a course name
    if (courseName.includes("::")) {
      courseExists = true;
      courseTag = courseName.split("::")[0];
      unitNumber = Number.parseInt(courseName.split("::")[1]);
      // Get the list of course IDs that satisfy the course tag
      codes = codeType[courseTag as keyof typeof codeType].codes;
      except = codeType[courseTag as keyof typeof codeType].except;
      let unitCount = 0;
      idList
        .filter(
          (id) => beginWithMatch(id, codes) && !beginWithMatch(id, except),
        )
        .map((id) => {
          const unit = searchCourse("id", id, courseList).unit;
          detectedCourses.push(searchCourse("id", id, courseList));
          excludeCourseList.push(searchCourse("id", id, courseList));
          if (!isFailed(searchCourse("id", id, courseList).grade)) {
            unitCount += unit;
          }
        });

      compulsoryResultList.push({
        name: courseName,
        isCourseGroup: true,
        passed: unitCount >= unitNumber,
        minimumUnit: unitNumber,
        courses: detectedCourses,
      });
    } else {
      // Search by course name (no alternative courses)
      if (nameList.includes(courseName)) {
        courseExists = true;
        courseGrade = searchCourse("name", courseName, courseList).grade;
        excludeCourseList.push(searchCourse("name", courseName, courseList));
        compulsoryResultList.push({
          name: courseName,
          isCourseGroup: false,
          passed: !isFailed(courseGrade),
          courses: [searchCourse("name", courseName, courseList)],
        } as const);
      }
    }

    // If the subject is not found, and there are alternative courses
    if (!courseExists && alternativeExists) {
      courseExists = true;
      let passed = false;
      const tmpCourses = alternativeRequirement.map((name) => {
        return searchCourse("name", name, courseList);
      });
      tmpCourses.map((c) => excludeCourseList.push(c));
      if (checkAlternativeRequirement(nameList, alternativeRequirement)) {
        passed = tmpCourses.every((c) => !isFailed(c.grade));
        compulsoryResultList.push({
          name: courseName,
          isCourseGroup: false,
          passed: passed,
          courses: tmpCourses,
          alternative: alternativeRequirement.join(", "),
          alternativeCourseNumber: tmpCourses.length,
        } as const);
      } else {
        compulsoryResultList.push({
          name: courseName,
          isCourseGroup: false,
          passed: false,
          courses: tmpCourses,
          alternative: alternativeRequirement.join(", "),
        } as const);
      }
    }

    // If the subject is not found
    if (!courseExists) {
      compulsoryResultList.push({
        name: courseName,
        isCourseGroup: false,
        passed: false,
        courses: [],
      } as const);
    }
  });
  const newCourseList = courseList.filter(
    (c) => !excludeCourseList.includes(c),
  );
  return {
    compulsoryResultList: compulsoryResultList,
    newCourseList: newCourseList,
  };
};
