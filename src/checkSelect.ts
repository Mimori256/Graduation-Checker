import Course from "./Course";
import CourseGroup from "./CourseGroup";
import codeType from "./data/courseCodeTypes";

class SelectSubjectRequirement {
  constructor(
    public codes: string[],
    public minimum: number,
    public maximum: number,
    public isExcludeRequirement: boolean,
    public message: string,
    public group: number
  ) {}
}

const createElementList = (
  element: "id" | "name" | "grade",
  courseList: Course[]
): string[] => courseList.map((course) => course[element]);

const getCourseUnitFromID = (
  courseID: string,
  courseList: Course[]
): number => {
  const targetCourse = courseList.find((course) => course.id === courseID);

  return targetCourse ? targetCourse.unit : 0;
};

const beginWithMatch = (code: string, codeList: string[]): boolean =>
  codeList.some((c) => code.startsWith(c));

const getUnitFromIDList = (idList: string[], courseList: Course[]): number =>
  idList.reduce((acc, id) => acc + getCourseUnitFromID(id, courseList), 0);

const getCourseListFromIDList = (
  idList: string[],
  courseList: Course[]
): Course[] => courseList.filter((course) => idList.includes(course.id));

// 単位数と検出した科目リストを返す
const countUnitFromCode = (
  selectSubject: SelectSubjectRequirement,
  courseIDList: string[],
  courseList: Course[]
): [Course[], number] => {
  const isExclusive = selectSubject.isExcludeRequirement;
  const codes = selectSubject.codes;
  let unitCount = 0;
  let includedIDList: string[];
  let tagCodes: string[];
  let tagExcept: string[];
  let excludeCourseList: Course[] = [];

  // 通常の条件のカウントの場合
  if (!isExclusive) {
    codes.map((code) => {
      // 科目のタグ表記ではない場合
      if (!code.startsWith("*")) {
        includedIDList = courseIDList.filter((id) => id.startsWith(code));
        excludeCourseList = excludeCourseList.concat(
          getCourseListFromIDList(includedIDList, courseList)
        );
        unitCount += getUnitFromIDList(includedIDList, courseList);
      }
      // 科目タグの場合(アスタリスクで始める)
      else {
        let tag = code.replace("*", "");
        tagCodes = codeType[tag as keyof typeof codeType].codes;
        tagExcept = codeType[tag as keyof typeof codeType].except;
        tagCodes.map((tagCode) => {
          includedIDList = courseIDList.filter(
            (id) => id.startsWith(tagCode) && !beginWithMatch(id, tagExcept)
          );
          excludeCourseList = excludeCourseList.concat(
            getCourseListFromIDList(includedIDList, courseList)
          );
          unitCount += getUnitFromIDList(includedIDList, courseList);
        });
      }
    });
  } else {
    //除外するカウントの場合
    let expandedExcludeList: string[] = [];
    let expandedExceptList: string[] = [];
    codes.map((code) => {
      if (!code.startsWith("*")) {
        expandedExcludeList.push(code);
      } else {
        //タグを展開してリストに追加
        let tag = code.replace("*", "");
        tagCodes = codeType[tag as keyof typeof codeType].codes;
        tagExcept = codeType[tag as keyof typeof codeType].except;
        expandedExcludeList = expandedExcludeList.concat(tagCodes);
        expandedExceptList = expandedExceptList.concat(tagExcept);
      }
    });
    includedIDList = courseIDList.filter(
      (id) =>
        !beginWithMatch(id, expandedExcludeList) ||
        beginWithMatch(id, expandedExceptList)
    );
    excludeCourseList = excludeCourseList.concat(
      getCourseListFromIDList(includedIDList, courseList)
    );
    unitCount += getUnitFromIDList(includedIDList, courseList);
  }
  return [excludeCourseList, unitCount];
};

const createDetail = (
  detectedCourses: Course[],
  includeCourseYear: boolean
): string[] =>
  detectedCourses.map((course) => {
    const year = includeCourseYear ? `(${course.year}年度)` : "";
    return `${course.id} ${course.name} ${year}: ${course.grade}`;
  });

const checkSelect = (
  courseList: Course[],
  includeCourseYear: boolean,
  requirementObject: any
): { newCourseList: Course[]; sumUnit: number } => {
  const selectList: SelectSubjectRequirement[] =
    requirementObject.courses.select.map(
      (x: any) =>
        new SelectSubjectRequirement(x[0], x[1], x[2], x[3], x[4], x[5])
    );
  const courseIDList: string[] = createElementList("id", courseList);
  const courseGroupList: CourseGroup[] = requirementObject.courses.groups.map(
    (x: any) => new CourseGroup(x[0], x[1], x[2], x[3])
  );
  let groupUnitList: { [key: number]: number } = { 0: 0, 1: 0, 2: 0, 3: 0 };
  let groupid: number;
  let excludeCourseList: Course[] = [];
  let detectedCourses: Course[];
  let tmp: [Course[], number];
  //const courseNameList: string[] = createElementList("name", courseList);
  //const courseGradeList: string[] = createElementList("grade", courseList);
  let resultArray: string[] = [];
  let unitCount;
  let sumUnit = 0;
  let isCompleted = true;

  selectList.map((selectSubject) => {
    groupid = selectSubject.group;
    tmp = countUnitFromCode(selectSubject, courseIDList, courseList);
    unitCount = tmp[1];
    groupUnitList[groupid] += unitCount;
    detectedCourses = tmp[0];
    excludeCourseList = excludeCourseList.concat(detectedCourses);
    if (unitCount >= selectSubject.maximum) {
      resultArray.push(`<details>
          <summary>
            ${selectSubject.message}  <font color='red'>〇</font> ${
        selectSubject.maximum
      }/${selectSubject.maximum}単位
          </summary>
          <ul>
          ${createDetail(detectedCourses, includeCourseYear).map(
            (course) => `<li>${course}</li>`
          )}
          </ul>
        </details>`);
    } else if (unitCount >= selectSubject.minimum) {
      resultArray.push(
        `<details>
          <summary>
          ${selectSubject.message}  <font color='red'>〇</font> ${unitCount}(${
          selectSubject.minimum
        }~${selectSubject.maximum})
          </summary>
          ${createDetail(detectedCourses, includeCourseYear)}
        </details>`
      );
    } else {
      // 条件を満たしていない場合
      resultArray.push(
        "<details><summary>" +
          selectSubject.message +
          "  " +
          "<font color='blue'>✖</font>" +
          " " +
          unitCount +
          "(" +
          String(selectSubject.minimum) +
          "~" +
          String(selectSubject.maximum) +
          ")" +
          "</summary>" +
          createDetail(detectedCourses, includeCourseYear) +
          "</details>"
      );
    }
  });
  resultArray.unshift("<h2>選択科目の条件一覧</h2>");
  let courseGroupUnit: number;
  let marubatsu: string;
  let exceedMessage: string;
  courseGroupList.map((courseGroup, index) => {
    exceedMessage = "";
    courseGroupUnit = groupUnitList[courseGroup.id];
    if (courseGroupUnit >= courseGroup.minUnit) {
      marubatsu = "<font color='red'>〇</font>";
      if (courseGroupUnit >= courseGroup.maxUnit) {
        exceedMessage = " (単位上限を超えています)";
      }
    } else {
      marubatsu = "<font color='blue'>✖</font>";
      isCompleted = false;
    }
    resultArray.push(`<h4>${courseGroup.name}</h4>
      ${groupUnitList[index]}/(${courseGroup.minUnit}~${courseGroup.maxUnit})${marubatsu}${exceedMessage}`);
    sumUnit += Math.min(courseGroupUnit, courseGroup.maxUnit);
  });
  resultArray.push(`<h3>
      合計${sumUnit}/${requirementObject.courses.selectMinimumUnit}単位
    </h3>`);
  document.getElementById("select")!.innerHTML = String(resultArray);

  // 差集合をとる
  const newCourseList = courseList.filter(
    (val) => !excludeCourseList.includes(val)
  );
  return { newCourseList: newCourseList, sumUnit: sumUnit };
};

export default checkSelect;
