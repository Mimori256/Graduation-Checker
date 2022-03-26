import React from "react";
import Course from "./Course";
import mast from "./data/mast";

const createElementList = (element: string, courseList: Course[]): string[] => {
  let result = [];
  for (let i = 0; i < courseList.length; i++) {
    if (element === "id") {
      result.push(courseList[i].id);
    }
    if (element === "name") {
      result.push(courseList[i].name);
    }
    if (element === "grade") {
      result.push(courseList[i].grade);
    }
  }
  return result;
};

const checkCompulsory = (courseList: Course[]) => {
  const complusoryList: string[] = mast.courses.complusory;
  const courseIDList: string[] = createElementList("id", courseList);
  const courseNameList: string[] = createElementList("name", courseList);
  const courseGradeList: string[] = createElementList("grade", courseList);
  let resultArray: string[] = [];
  let courseName;
  let courseGrade;
  for (let i = 0; i < complusoryList.length; i++) {
    // リストの要素が授業名か科目かどうか確認する
    courseName =  complusoryList[i];
    if (!courseName.includes("::")) {
      //科目名の場合
      if (courseNameList.includes(courseName)) {

        resultArray.push(courseName + "  " +  )
      }
    }
  }
};

export default checkCompulsory;
