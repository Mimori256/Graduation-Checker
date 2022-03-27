import React from "react";
import Course from "./Course";
import mast from "./data/mast";
import codeType from "./data/courseCodeTypes";

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

const getCourseGradeFromName = (
  courseName: string,
  courseList: Course[]
): string => {
  for (let i = 0; i < courseList.length; i++) {
    if (courseList[i].name === courseName) {
      return courseList[i].grade;
    }
  }
  return "null";
};

const getCourseUnitFromID = (
  courseID: string,
  courseList: Course[]
): number => {
  for (let i = 0; i < courseList.length; i++) {
    if (courseList[i].id === courseID) {
      return courseList[i].unit;
    }
  }
  return 0;
};

const getCourseUnitFromName = (
  courseName: string,
  courseList: Course[]
): number => {
  for (let i = 0; i < courseList.length; i++) {
    if (courseList[i].name === courseName) {
      return courseList[i].unit;
    }
  }
  return 0;
};

const beginWithMatch = (code: string, codeList: string[]): boolean => {
  for (let i = 0; i < codeList.length; i++) {
    if (code.indexOf(codeList[i]) === 0) {
      return true;
    }
  }
  return false;
};

const checkCompulsory = (courseList: Course[]) => {
  const complusoryList: string[] = mast.courses.complusory;
  const courseIDList: string[] = createElementList("id", courseList);
  const courseNameList: string[] = createElementList("name", courseList);
  const courseGradeList: string[] = createElementList("grade", courseList);
  let resultArray: string[] = [];
  let courseName;
  let courseGrade;
  let courseTag;
  let unitNumber;
  let codes;
  let except: string[];
  let sumUnit = 0;
  for (let i = 0; i < complusoryList.length; i++) {
    // リストの要素が授業名か科目かどうか確認する
    courseName = complusoryList[i];
    if (!courseName.includes("::")) {
      //科目名の場合
      if (courseNameList.includes(courseName)) {
        courseGrade = getCourseGradeFromName(courseName, courseList);

        if (courseGrade === "履修中" || courseGrade === "D") {
          resultArray.push(courseName + "  " + "△");
        } else {
          let courseUnit = getCourseUnitFromName(courseName, courseList);
          sumUnit += courseUnit;
          resultArray.push(
            courseName +
              "  " +
              "<font color='red'>〇</font> (" +
              courseGrade +
              ")" +
              " " +
              courseUnit +
              "単位"
          );
        }
      } else {
        // 必修科目がデータに存在していない場合
        resultArray.push(courseName + "  " + "<font color='blue'>✖</font>");
      }
    } else {
      //科目のタグの場合
      courseTag = courseName.split("::")[0];
      unitNumber = parseInt(courseName.split("::")[1]);
      //タグの該当する科目番号のリストを取得
      codes = codeType[courseTag as keyof typeof codeType].codes;
      except = codeType[courseTag as keyof typeof codeType].except;
      let unitCount = 0;
      for (let j = 0; j < courseIDList.length; j++) {
        if (
          beginWithMatch(courseIDList[j], codes) &&
          !beginWithMatch(courseIDList[j], except)
        ) {
          let unit = getCourseUnitFromID(courseIDList[j], courseList);
          unitCount += unit;
        }
      }
      // タグ付けされた科目の単位数が条件を満たしているか確認
      sumUnit += unitCount;
      if (unitCount === unitNumber) {
        resultArray.push(
          courseTag +
            " " +
            "<font color='red'>〇</font>" +
            " " +
            unitCount +
            "/" +
            unitCount +
            "単位"
        );
      } else {
        resultArray.push(
          courseTag +
            " " +
            "<font color='blue'>✖</font>" +
            " " +
            unitCount +
            "/" +
            unitNumber +
            "単位"
        );
      }
    }
  }
  resultArray.push(
    "<br>" +
      "<h3>合計" +
      String(sumUnit) +
      "/" +
      String(mast.courses.complusorySumUnit) +
      "単位" +
      "</h3>"
  );
  resultArray.unshift("<h2>必修科目</h2>");
  const result = resultArray.join("<br>");
  document.getElementById("compulsory")!.innerHTML = result;
};

export default checkCompulsory;
