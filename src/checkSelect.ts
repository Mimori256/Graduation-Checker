import mast from "./data/mast";
import Course from "./Course";
import codeType from "./data/courseCodeTypes";

class SelectSubjectRequirement {
  codes: string[];
  minimum: number;
  maximum: number;
  isExcludeRequirement: boolean;
  message: string;
  constructor(
    codes: string[],
    minimum: number,
    maximum: number,
    isExcludeRequirement: boolean,
    message: string
  ) {
    this.codes = codes;
    this.minimum = minimum;
    this.maximum = maximum;
    this.isExcludeRequirement = isExcludeRequirement;
    this.message = message;
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

const checkSelect = (courseList: Course[]): [Course[], number] => {
  const selectList: SelectSubjectRequirement[] = mast.courses.select;
  const courseIDList: string[] = createElementList("id", courseList);
  let excludeCourseList: Course[] = [];
  let tmp: [Course[], number];
  //const courseNameList: string[] = createElementList("name", courseList);
  //const courseGradeList: string[] = createElementList("grade", courseList);
  let resultArray: string[] = [];
  let unitCount;
  let sumUnit = 0;

  for (let i = 0; i < selectList.length; i++) {
    tmp = countUnitFromCode(selectList[i], courseIDList, courseList);
    unitCount = tmp[1];
    excludeCourseList = excludeCourseList.concat(tmp[0]);
    if (unitCount >= selectList[i].maximum) {
      sumUnit += selectList[i].maximum;
      resultArray.push(
        selectList[i].message +
          "  " +
          "<font color='red'>〇</font>" +
          " " +
          String(selectList[i].maximum) +
          "/" +
          String(selectList[i].maximum) +
          "単位"
      );
    } else if (unitCount >= selectList[i].minimum) {
      sumUnit += unitCount;
      resultArray.push(
        selectList[i].message +
          "  " +
          "<font color='red'>〇</font>" +
          " " +
          unitCount +
          "(" +
          String(selectList[i].minimum) +
          "~" +
          String(selectList[i].maximum) +
          ")"
      );
    } else {
      // 条件を満たしていない場合
      sumUnit += unitCount;
      resultArray.push(
        selectList[i].message +
          "  " +
          "<font color='blue'>✖</font>" +
          " " +
          unitCount +
          "(" +
          String(selectList[i].minimum) +
          "~" +
          String(selectList[i].maximum) +
          ")"
      );
    }
  }
  resultArray.unshift("<h2>選択科目</h2>");
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