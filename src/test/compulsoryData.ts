import type { Course } from "../types/Course";
import sample from "./compulsoryData.json";

const createTest2 = (courseList: Course[]): Course[] => {
  courseList[0].grade = "D";
  courseList[1].grade = "F";
  return courseList;
};

const createTest3 = (courseList: Course[]): Course[] => {
  const newCourseList = [...courseList];
  // Remove 微分積分A
  newCourseList.splice(20, 1);
  newCourseList.push({
    id: "FA01341",
    name: "微積分1",
    unit: 1,
    grade: "A",
    year: 2021,
  });
  newCourseList.push({
    id: "FA01441",
    name: "微積分2",
    unit: 1,
    grade: "A",
    year: 2021,
  });
  return newCourseList;
};

export const test1 = sample["sample"] as Course[];
export const test2 = createTest2(JSON.parse(JSON.stringify(test1)));
export const test3 = createTest3(JSON.parse(JSON.stringify(test1)));
