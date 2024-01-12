import type { Course } from "../types/Course";
import type { SelectRequirement } from "../types/SelectRequirement";
import type { SelectResult } from "../types/SelectResult";

import { createElementList, beginWithMatch, searchCourse } from "./utils";

import { codeType } from "../consts/courseCodeTypes";

interface CheckSelectResult {
  selectResultList: SelectResult[];
  leftCourseList: Course[];
}

const findCourseFromCode = (
  selectSubject: SelectRequirement,
  idList: string[],
  courseList: Course[],
): Course[] => {
  const isExclusive = selectSubject.isExcludeRequirement;
  const codes = selectSubject.codes;
  let includedIDList: string[];
  let includedCourseList: Course[] = [];
  let excludeCourseList: Course[] = [];

  // Not exclusive requirement
  if (!isExclusive) {
    codes.map((code) => {
      // if the code is not a tag
      if (!code.startsWith("*")) {
        includedIDList = idList.filter((id) => id.startsWith(code));
        includedCourseList = includedIDList.map((id) => {
          return searchCourse("id", id, courseList);
        });
        excludeCourseList = excludeCourseList.concat(includedCourseList);
      } else {
        // if the code is a tag (which starts with *)
        const tag = code.replace("*", "");
        const tagCodes = codeType[tag as keyof typeof codeType].codes;
        const tagExcept = codeType[tag as keyof typeof codeType].except;
        tagCodes.map((tagCode) => {
          includedIDList = idList.filter(
            (id) => id.startsWith(tagCode) && !beginWithMatch(id, tagExcept),
          );
          includedCourseList = includedIDList.map((id) => {
            return searchCourse("id", id, courseList);
          });
          excludeCourseList = excludeCourseList.concat(includedCourseList);
        });
      }
    });
  } else {
    // Exclusive requirement
    let expandedExcludeList: string[] = [];
    let expandedExceptList: string[] = [];
    codes.map((code) => {
      if (!code.startsWith("*")) {
        expandedExcludeList.push(code);
      } else {
        // expand the tag and add it to the lists
        const tag = code.replace("*", "");
        const tagCodes = codeType[tag as keyof typeof codeType].codes;
        const tagExcept = codeType[tag as keyof typeof codeType].except;
        expandedExcludeList = expandedExcludeList.concat(tagCodes);
        expandedExceptList = expandedExceptList.concat(tagExcept);
      }
    });
    includedIDList = idList.filter(
      (id) =>
        !beginWithMatch(id, expandedExcludeList) ||
        beginWithMatch(id, expandedExceptList),
    );
    excludeCourseList = excludeCourseList.concat(
      includedIDList.map((id) => {
        return searchCourse("id", id, courseList);
      }),
    );
  }
  return excludeCourseList;
};

export const checkSelect = (
  courseList: Course[],
  // biome-ignore lint/suspicious/noExplicitAny:
  requirementObject: any,
): CheckSelectResult => {
  const requirements: SelectRequirement[] =
    // biome-ignore lint/suspicious/noExplicitAny:
    requirementObject.courses.select.map((x: any) => {
      return {
        codes: x[0],
        minimum: x[1],
        maximum: x[2],
        isExcludeRequirement: x[3],
        message: x[4],
        group: x[5],
      } as SelectRequirement;
    });
  let excludeCourseList: Course[] = [];
  const selectResultList: SelectResult[] = [];
  const idList = createElementList("id", courseList);
  requirements.map((requirement) => {
    const detectedCourses = findCourseFromCode(requirement, idList, courseList);
    excludeCourseList = excludeCourseList.concat(detectedCourses);
    selectResultList.push({
      requirement: requirement,
      courses: detectedCourses,
    });
  });
  const newCourseList = courseList.filter(
    (course) => !excludeCourseList.includes(course),
  );
  return {
    selectResultList: selectResultList,
    leftCourseList: newCourseList,
  };
};
