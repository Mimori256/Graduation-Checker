import Course from "./Course.ts";
import codeType from "./data/courseCodeTypes.ts";

const ErrorCourse = new Course("Error", "Error", 0, "Error", 0);

const addParen = (s: string): string => `(${s})`;

const createElementList = (
  element: "id" | "grade" | "name",
  courseList: Course[]
): string[] =>
  courseList.map((course) =>
    course[element].includes("//")
      ? course[element].split("//")[0]
      : course[element]
  );

const getCourseGradeFromName = (
  courseName: string,
  courseList: Course[]
): string => {
  const targetCourse = courseList.find((course) => course.name === courseName);
  return targetCourse ? targetCourse.grade : "Error";
};

const getCourseUnitFromID = (
  courseID: string,
  courseList: Course[]
): number => {
  const targetCourse = courseList.find((course) => course.id === courseID);
  return targetCourse && targetCourse.grade !== "D" ? targetCourse.unit : 0;
};

const getCourseUnitFromName = (
  courseName: string,
  courseList: Course[]
): number => {
  const targetCourse = courseList.find((course) => course.name === courseName);
  return targetCourse ? targetCourse.unit : 0;
};

const getCourseYearfromName = (
  courseName: string,
  courseList: Course[]
): number => searchCourseFromName(courseName, courseList).year;

const beginWithMatch = (code: string, codeList: string[]): boolean =>
  codeList.some((c) => code.startsWith(c));

const searchCourseFromID = (id: string, courseList: Course[]) =>
  courseList.find((course) => course.id === id) || ErrorCourse;

const searchCourseFromName = (name: string, courseList: Course[]) =>
  courseList.find((course) => course.name === name) || ErrorCourse;

const createDetail = (
  detectedCourses: Course[],
  includeCourseYear: boolean
): string => {
  if (!detectedCourses.length) return "該当なし";
  return detectedCourses
    .map(
      (course) =>
        `${course.name} ${includeCourseYear ? `(course.year)` : ""} ${
          course.grade
        }<br>`
    )
    .join("");
};

const checkAlternativeRequirement = (
  courseNameList: string[],
  alternativeRequirement: string[]
): boolean =>
  alternativeRequirement.every((requiredCourse) =>
    courseNameList.includes(requiredCourse)
  );

const addExcludeFromList = (
  excludeCourseList: Course[],
  excludeList: string[],
  courseList: Course[]
): Course[] =>
  excludeCourseList.concat(
    excludeList.map((c) => searchCourseFromName(c, courseList))
  );

const checkCourseCertificate = (courseList: Course[]): Course[] => {
  const compulsoryEnglishDict: { [key: string]: string } = {
    "English Reading Skills I": "31H",
    "English Presentation Skills I": "31J",
    "English Reading Skills II": "31K",
    "English Presentation Skills II": "31L",
  };

  courseList.map((c) => {
    if (c.grade == "認" && compulsoryEnglishDict[c.name] != undefined) {
      c.id = compulsoryEnglishDict[c.name];
    }
  });

  return courseList;
};

// HTML要素を変更して、必修課目を除外した新しい科目リストを返す
const checkCompulsory = (
  courseList: Course[],
  includeCourseYear: boolean,
  requirementObject: any
): { newCourseList: Course[]; sumUnit: number } => {
  const compulsoryList: string[] = requirementObject.courses.compulsory;

  //単位認定科目(必修英語)の前処理
  courseList = checkCourseCertificate(courseList);

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
  let codes: string[];
  let except: string[];
  let alternativeRequirement: string[] = [];
  let sumUnit = 0;
  let detectedCourses: Course[] = [];
  let sign = "";

  let courseExists: boolean;
  let alternativeExists: boolean;

  compulsoryList.map((compulsory) => {
    //初期化
    detectedCourses = [];
    courseName = compulsory;
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
      courseIDList
        .filter(
          (courseID) =>
            beginWithMatch(courseID, codes) && !beginWithMatch(courseID, except)
        )
        .map((courseID) => {
          const unit = getCourseUnitFromID(courseID, courseList);
          detectedCourses.push(searchCourseFromID(courseID, courseList));
          excludeCourseList.push(searchCourseFromID(courseID, courseList));
          unitCount += unit;
        });
      // タグ付けされた科目の単位数が条件を満たしているか確認
      sumUnit += unitCount;
      let courseDetail = createDetail(detectedCourses, includeCourseYear);
      resultArray.push(`
        <details>
          <summary>${courseTag} ${
        unitCount >= unitNumber
          ? "<font color='red'>〇</font>"
          : "<font color='blue'>✖</font>"
      } ${unitCount}/${unitNumber}単位
          </summary>
          ${courseDetail}
        </details>
      `);
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
          sign = courseGrade === "履修中" ? "△" : "<font color='red'>〇</font>";
          courseUnit = getCourseUnitFromName(courseName, courseList);
          courseYear = getCourseYearfromName(courseName, courseList);
          excludeCourseList.push(searchCourseFromName(courseName, courseList));
          sumUnit += courseUnit;
          resultArray.push(
            `${courseName} ${
              includeCourseYear ? addParen(String(courseYear)) : ""
            } ${sign} ${courseUnit}単位`
          );
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
          tmpArray.includes("D") ||
          tmpArray.includes("履修中")
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
        resultArray.push(
          `${courseName} ${
            includeCourseYear ? `(${courseYear})` : ""
          }  ${sign} ${validUnitCount}単位(単位互換)`
        );
        excludeCourseList = addExcludeFromList(
          excludeCourseList,
          alternativeRequirement,
          courseList
        );
      }
    }
    //今までの条件にヒットしなかった場合
    if (!courseExists) {
      resultArray.push(`${courseName} <font color='blue'>✖</font>`);
    }
  });

  resultArray.push(
    `<br>
      <h3>合計${sumUnit}/${requirementObject.courses.compulsorySumUnit}単位</h3>`
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
  return { newCourseList: newCourseList, sumUnit: sumUnit };
};

export default checkCompulsory;
