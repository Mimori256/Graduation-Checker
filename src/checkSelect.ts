import mast from "./data/mast";
import Course from "./Course";
import CourseGroup from "./CourseGroup";
import codeType from "./data/courseCodeTypes";
import { group } from "console";

class SelectSubjectRequirement {
  codes: string[];
  minimum: number;
  maximum: number;
  isExcludeRequirement: boolean;
  message: string;
  group: number;
  constructor(
    codes: string[],
    minimum: number,
    maximum: number,
    isExcludeRequirement: boolean,
    message: string,
    group: number
  ) {
    this.codes = codes;
    this.minimum = minimum;
    this.maximum = maximum;
    this.isExcludeRequirement = isExcludeRequirement;
    this.message = message;
    this.group = group;
  }
}

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

const getUnitFromIDList = (idList: string[], courseList: Course[]): number => {
  let unit = 0;
  for (let i = 0; i < idList.length; i++) {
    unit += getCourseUnitFromID(idList[i], courseList);
  }
  return unit;
};

const getCourseListFromIDList = (
  idList: string[],
  courseList: Course[]
): Course[] => {
  let res: Course[] = [];
  for (let i = 0; i < courseList.length; i++) {
    if (idList.includes(courseList[i].id)) {
      res.push(courseList[i]);
    }
  }
  return res;
};

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
    for (let i = 0; i < codes.length; i++) {
      // 科目のタグ表記ではない場合
      if (!codes[i].startsWith("*")) {
        includedIDList = courseIDList.filter((id) => id.startsWith(codes[i]));
        excludeCourseList = excludeCourseList.concat(
          getCourseListFromIDList(includedIDList, courseList)
        );
        unitCount += getUnitFromIDList(includedIDList, courseList);
      }
      // 科目タグの場合(アスタリスクで始める)
      else {
        let tag = codes[i].replace("*", "");
        tagCodes = codeType[tag as keyof typeof codeType].codes;
        tagExcept = codeType[tag as keyof typeof codeType].except;
        for (let j = 0; j < tagCodes.length; j++) {
          includedIDList = courseIDList.filter(
            (id) => id.startsWith(tagCodes[j]) && !beginWithMatch(id, tagExcept)
          );
          excludeCourseList = excludeCourseList.concat(
            getCourseListFromIDList(includedIDList, courseList)
          );
          unitCount += getUnitFromIDList(includedIDList, courseList);
        }
      }
    }
  } else {
    //除外するカウントの場合
    let expandedExcludeList: string[] = [];
    let expandedExceptList: string[] = [];
    for (let i = 0; i < codes.length; i++) {
      if (!codes[i].startsWith("*")) {
        expandedExcludeList.push(codes[i]);
      } else {
        //タグを展開してリストに追加
        let tag = codes[i].replace("*", "");
        tagCodes = codeType[tag as keyof typeof codeType].codes;
        tagExcept = codeType[tag as keyof typeof codeType].except;
        expandedExcludeList = expandedExcludeList.concat(tagCodes);
        expandedExceptList = expandedExceptList.concat(tagExcept);
      }
    }
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

const createDetail = (detectedCourses: Course[]): string => {
  let res = "";
  for (let i = 0; i < detectedCourses.length; i++) {
    res += detectedCourses[i].name + "   " + detectedCourses[i].grade + "<br>";
  }
  return res;
};

const checkSelect = (courseList: Course[]): [Course[], number] => {
  const selectList: SelectSubjectRequirement[] = mast.courses.select;
  const courseIDList: string[] = createElementList("id", courseList);
  const courseGroupList: CourseGroup[] = mast.courses.groups;
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

  for (let i = 0; i < selectList.length; i++) {
    groupid = selectList[i].group;
    tmp = countUnitFromCode(selectList[i], courseIDList, courseList);
    unitCount = tmp[1];
    groupUnitList[groupid] += unitCount;
    detectedCourses = tmp[0];
    excludeCourseList = excludeCourseList.concat(detectedCourses);
    if (unitCount >= selectList[i].maximum) {
      resultArray.push(
        "<details><summary>" +
          selectList[i].message +
          "  " +
          "<font color='red'>〇</font>" +
          " " +
          String(selectList[i].maximum) +
          "/" +
          String(selectList[i].maximum) +
          "単位" +
          "</summary>" +
          createDetail(detectedCourses) +
          "</details>"
      );
    } else if (unitCount >= selectList[i].minimum) {
      resultArray.push(
        "<details><summary>" +
          selectList[i].message +
          "  " +
          "<font color='red'>〇</font>" +
          " " +
          unitCount +
          "(" +
          String(selectList[i].minimum) +
          "~" +
          String(selectList[i].maximum) +
          ")" +
          "</summary>" +
          createDetail(detectedCourses) +
          "</details>"
      );
    } else {
      // 条件を満たしていない場合
      resultArray.push(
        "<details><summary>" +
          selectList[i].message +
          "  " +
          "<font color='blue'>✖</font>" +
          " " +
          unitCount +
          "(" +
          String(selectList[i].minimum) +
          "~" +
          String(selectList[i].maximum) +
          ")" +
          "</summary>" +
          createDetail(detectedCourses) +
          "</details>"
      );
    }
  }
  resultArray.unshift("<h2>選択科目の条件一覧</h2>");
  let courseGroupUnit: number;
  let marubatsu: string;
  for (let i = 0; i < courseGroupList.length; i++) {
    courseGroupUnit = groupUnitList[courseGroupList[i].id];
    if (courseGroupUnit >= courseGroupList[i].minUnit) {
      marubatsu = "<font color='red'>〇</font>";
    } else {
      marubatsu = "<font color='blue'>✖</font>";
      isCompleted = false;
    }
    resultArray.push(
      "<br><h4>" +
        courseGroupList[i].name +
        "</h4>" +
        String(groupUnitList[i]) +
        "/(" +
        String(courseGroupList[i].minUnit) +
        "~" +
        String(courseGroupList[i].maxUnit) +
        ")" +
        marubatsu
    );
    sumUnit += Math.min(courseGroupUnit, courseGroupList[i].maxUnit);
  }
  resultArray.push(
    "<br>" +
      "<h3>合計" +
      String(sumUnit) +
      "/" +
      String(mast.courses.selectMinimumUnit) +
      "単位" +
      "</h3>"
  );
  const result = resultArray.join("<br>");
  document.getElementById("select")!.innerHTML = result;

  // 差集合をとる
  const newCourseList = courseList.filter(
    (val) => !excludeCourseList.includes(val)
  );
  return [newCourseList, sumUnit];
};

export default checkSelect;
