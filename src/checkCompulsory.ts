import Course from "./Course";
import mast from "./data/mast";
import codeType from "./data/courseCodeTypes";

const ErrorCourse = new Course("Error", "Error", 0, "Error", 0);

const addParen = (s: string): string => {
  return "(" + s + ")";
};

const createElementList = (element: string, courseList: Course[]): string[] => {
  let result = [];
  let name = "";
  for (let i = 0; i < courseList.length; i++) {
    if (element === "id") {
      result.push(courseList[i].id);
    }
    if (element === "name") {
      name = courseList[i].name;
      if (name.includes("//")) {
        name = name.split("//")[0];
      }
      result.push(name);
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
  return "";
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

const getCourseYearfromName = (
  courseName: string,
  courseList: Course[]
): number => {
  for (let i = 0; i < courseList.length; i++) {
    if (courseList[i].name === courseName) {
      return courseList[i].year;
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

const createDetail = (
  detectedCourses: Course[],
  includeCourseYear: boolean
): string => {
  let res = "";
  if (detectedCourses.length === 0) {
    res += "該当なし";
  }
  for (let i = 0; i < detectedCourses.length; i++) {
    if (includeCourseYear) {
      res +=
        detectedCourses[i].name +
        addParen(String(detectedCourses[i].year)) +
        "   " +
        detectedCourses[i].grade +
        "<br>";
    } else {
      res +=
        detectedCourses[i].name + "   " + detectedCourses[i].grade + "<br>";
    }
  }
  return res;
};

const checkAlternativeRequirement = (
  courseNameList: string[],
  alternativeRequirement: string[]
): boolean => {
  let res = true;
  alternativeRequirement.forEach(function (requiredCourse) {
    if (!courseNameList.includes(requiredCourse)) {
      res = false;
    }
  });
  return res;
};

const addExcludeFromList = (
  excludeCourseList: Course[],
  excludeList: string[],
  courseList: Course[]
): Course[] => {
  excludeList.forEach((c) => {
    excludeCourseList.push(searchCourseFromName(c, courseList));
  });
  return excludeCourseList;
};

// HTML要素を変更して、必修課目を除外した新しい科目リストを返す
const checkCompulsory = (
  courseList: Course[],
  includeCourseYear: boolean
): [Course[], number] => {
  const complusoryList: string[] = mast.courses.complusory;
  const courseIDList: string[] = createElementList("id", courseList);
  const courseNameList: string[] = createElementList("name", courseList);
  let excludeCourseList: Course[] = [];
  let resultArray: string[] = [];
  let courseName;
  let courseGrade;
  let courseTag;
  let courseUnit;
  let courseYear;
  let unitNumber;
  let codes;
  let except: string[];
  let alternativeRequirement: string[] = [];
  let sumUnit = 0;
  let detectedCourses: Course[] = [];
  let sign = "";

  let courseExists: boolean;
  let alternativeExists: boolean;

  for (let i = 0; i < complusoryList.length; i++) {
    //初期化
    detectedCourses = [];
    courseName = complusoryList[i];
    courseExists = false;
    alternativeExists = false;

    if (courseName.includes("//")) {
      alternativeRequirement = eval(courseName.split("//")[1]);
      courseName = courseName.split("//")[0];
      alternativeExists = true;
    }

    //科目のタグの場合
    if (courseName.includes("::")) {
      courseExists = true;
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
      let courseDetail = createDetail(detectedCourses, includeCourseYear);
      if (unitCount >= unitNumber) {
        resultArray.push(
          "<details><summary>" +
            courseTag +
            " " +
            "<font color='red'>〇</font>" +
            " " +
            unitCount +
            "/" +
            unitNumber +
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
    } else {
      //科目名サーチ(互換なし)
      if (courseNameList.includes(courseName)) {
        courseExists = true;
        courseGrade = getCourseGradeFromName(courseName, courseList);

        //if (courseGrade === "履修中" || courseGrade === "D") {
        if (courseGrade === "D") {
          resultArray.push(courseName + "  △ " + addParen(String(courseGrade)));
          excludeCourseList.push(searchCourseFromName(courseName, courseList));
        } else {
          if (courseGrade === "履修中") {
            sign = "△";
          } else {
            sign = "<font color='red'>〇</font>";
          }
          courseUnit = getCourseUnitFromName(courseName, courseList);
          courseYear = getCourseYearfromName(courseName, courseList);
          excludeCourseList.push(searchCourseFromName(courseName, courseList));
          sumUnit += courseUnit;
          if (includeCourseYear) {
            resultArray.push(
              courseName +
                addParen(String(courseYear)) +
                "  " +
                sign +
                " " +
                courseUnit +
                "単位"
            );
          } else {
            resultArray.push(
              courseName + "  " + sign + " " + courseUnit + "単位"
            );
          }
        }
      }
    }

    //科目が見つからず、かつ互換がある場合
    if (!courseExists && alternativeExists) {
      courseExists = true;
      let validUnitCount = 0;
      if (checkAlternativeRequirement(courseNameList, alternativeRequirement)) {
        let tmpArray: String[] = alternativeRequirement.map((x) =>
          getCourseGradeFromName(x, courseList)
        );

        // 要件を全く履修していない場合
        if (tmpArray.every((grade) => grade === "")) {
          sign = "<font color='blue'>✖</font>";
        } else if (
          //Dまたは履修中の科目が互換要件にある場合
          tmpArray.some((grade) => grade === "D") ||
          tmpArray.some((grade) => grade === "履修中")
        ) {
          sign = "△";
          validUnitCount = tmpArray.filter(
            (grade) => grade === "履修中"
          ).length;
          sumUnit += validUnitCount;
        } else {
          sign = "<font color='red'>〇</font>";
          validUnitCount = alternativeRequirement
            .map((c) => getCourseUnitFromName(c, courseList))
            .reduce((sum, unit) => sum + unit);
          sumUnit += validUnitCount;
        }

        courseYear = getCourseYearfromName(
          alternativeRequirement[0],
          courseList
        );
        if (includeCourseYear) {
          resultArray.push(
            courseName +
              addParen(String(courseYear)) +
              "  " +
              sign +
              " " +
              validUnitCount +
              "単位(単位互換)"
          );
        } else {
          resultArray.push(
            courseName + "  " + sign + " " + validUnitCount + "単位(単位互換)"
          );
        }
        excludeCourseList = addExcludeFromList(
          excludeCourseList,
          alternativeRequirement,
          courseList
        );
      }
    }
    //今までの条件にヒットしなかった場合
    if (!courseExists) {
      resultArray.push(courseName + " <font color='blue'>✖</font>");
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
  let result = resultArray.join("<br>");
  // はじめの改行を削除
  result = result.replace("<br>", "");
  document.getElementById("compulsory")!.innerHTML = result;

  // 差集合をとる
  const newCourseList = courseList.filter(
    (val) => !excludeCourseList.includes(val)
  );
  return [newCourseList, sumUnit];
};

export default checkCompulsory;
