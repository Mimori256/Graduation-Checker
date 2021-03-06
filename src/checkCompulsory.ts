import Course from "./Course";
import mast from "./data/mast";
import codeType from "./data/courseCodeTypes";

const ErrorCourse = new Course("Error", "Error", 0, "Error");

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
      //if (courseList[i].grade !== "D" && courseList[i].grade !== "履修中") {
      if (courseList[i].grade !== "D") {
        return courseList[i].unit;
      } else {
        return 0;
      }
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

const searchCourseFromID = (id: string, courseList: Course[]) => {
  for (let i = 0; i < courseList.length; i++) {
    if (courseList[i].id === id) {
      return courseList[i];
    }
  }
  return ErrorCourse;
};

const searchCourseFromName = (name: string, courseList: Course[]) => {
  for (let i = 0; i < courseList.length; i++) {
    if (courseList[i].name === name) {
      return courseList[i];
    }
  }
  return ErrorCourse;
};

const createDetail = (detectedCourses: Course[]): string => {
  let res = "";
  if (detectedCourses.length === 0) {
    res += "該当なし";
  }
  for (let i = 0; i < detectedCourses.length; i++) {
    res += detectedCourses[i].name + "   " + detectedCourses[i].grade + "<br>";
  }
  return res;
};

// HTML要素を変更して、必修課目を除外した新しい科目リストを返す
const checkCompulsory = (courseList: Course[]): [Course[], number] => {
  const complusoryList: string[] = mast.courses.complusory;
  const courseIDList: string[] = createElementList("id", courseList);
  const courseNameList: string[] = createElementList("name", courseList);
  //const courseGradeList: string[] = createElementList("grade", courseList);
  let excludeCourseList: Course[] = [];
  let resultArray: string[] = [];
  let courseName;
  let courseGrade;
  let courseTag;
  let unitNumber;
  let codes;
  let except: string[];
  let sumUnit = 0;
  let detectedCourses: Course[] = [];
  let sign = "";

  for (let i = 0; i < complusoryList.length; i++) {
    detectedCourses = [];
    // リストの要素が授業名か科目かどうか確認する
    courseName = complusoryList[i];
    if (!courseName.includes("::")) {
      //科目名の場合
      if (courseNameList.includes(courseName)) {
        courseGrade = getCourseGradeFromName(courseName, courseList);

        //if (courseGrade === "履修中" || courseGrade === "D") {
        if (courseGrade === "D") {
          resultArray.push(courseName + "  " + "△ (" + courseGrade + ")");
          excludeCourseList.push(searchCourseFromName(courseName, courseList));
        } else {
          if (courseGrade === "履修中") {
            sign = "△";
          }
          else {
            sign = "<font color='red'>〇</font>";
          }
          let courseUnit = getCourseUnitFromName(courseName, courseList);
          excludeCourseList.push(searchCourseFromName(courseName, courseList));
          sumUnit += courseUnit;
          resultArray.push(
            courseName +
              "  " +
              sign + "(" +
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
          detectedCourses.push(searchCourseFromID(courseIDList[j], courseList));
          excludeCourseList.push(
            searchCourseFromID(courseIDList[j], courseList)
          );
          unitCount += unit;
        }
      }
      // タグ付けされた科目の単位数が条件を満たしているか確認
      sumUnit += unitCount;
      let courseDetail = createDetail(detectedCourses);
      if (unitCount === unitNumber) {
        resultArray.push(
          "<details><summary>" +
            courseTag +
            " " +
            "<font color='red'>〇</font>" +
            " " +
            unitCount +
            "/" +
            unitCount +
            "単位" +
            "</summary>" +
            courseDetail +
            "</details>"
        );
      } else {
        resultArray.push(
          "<details><summary>" +
            courseTag +
            " " +
            "<font color='blue'>✖</font>" +
            " " +
            unitCount +
            "/" +
            unitNumber +
            "単位" +
            "</summary>" +
            courseDetail +
            "</details>"
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
  // HTML要素を変更
  resultArray.unshift("<h2>必修科目</h2>");
  const result = resultArray.join("<br>");
  document.getElementById("compulsory")!.innerHTML = result;

  // 差集合をとる
  const newCourseList = courseList.filter(
    (val) => !excludeCourseList.includes(val)
  );
  return [newCourseList, sumUnit];
};

export default checkCompulsory;
