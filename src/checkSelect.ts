import Course from "./Course";
import CourseGroup from "./CourseGroup";
import codeType from "./data/courseCodeTypes";
import { GradRequirement } from "./data/gradRequirement";

class SelectSubjectRequirement {
  constructor(
    public codes: string[],
    public minimum: number,
    public maximum: number,
    public isExcludeRequirement: boolean,
    public message: string,
    public group: 0 | 1 | 2 | 3
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
  if (targetCourse?.grade !== "D") {
    return targetCourse ? targetCourse.unit : 0;
  } else {
    return 0;
  }
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
): { excludeCourseList: Course[]; unitCount: number } => {
  const isExclusive = selectSubject.isExcludeRequirement;
  const codes = selectSubject.codes;
  let unitCount = 0;
  let includedIDList: string[];
  let tagCodes: string[];
  let tagExcept: string[];
  let excludeCourseList: Course[] = [];

  // 通常の条件のカウントの場合
  if (!isExclusive) {
    codes.forEach((code) => {
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
        tagCodes.forEach((tagCode) => {
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
    codes.forEach((code) => {
      if (!code.startsWith("*")) {
        expandedExcludeList.push(code);
      } else {
        //タグを展開してリストに追加
        const tag = code.replace("*", "");
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
  return { excludeCourseList, unitCount };
};

const checkSelect = (
  courseList: Course[],
  requirementObject: GradRequirement
) => {
  const selectList = requirementObject.courses.select.map(
    (x) => new SelectSubjectRequirement(x[0], x[1], x[2], x[3], x[4], x[5])
  );
  const courseIDList = createElementList("id", courseList);
  const courseGroupList = requirementObject.courses.groups.map(
    (x) => new CourseGroup(x[0], x[1], x[2], x[3])
  );

  const { groupUnitList, excludeCourseList } = selectList.reduce<{
    groupUnitList: { [key: number]: number };
    excludeCourseList: Course[];
  }>(
    (acc, selectSubject) => {
      const { excludeCourseList: _excludeCourseList, unitCount: _unitCount } =
        countUnitFromCode(selectSubject, courseIDList, courseList);
      const groupId = selectSubject.group;
      acc.groupUnitList[groupId] += _unitCount;
      acc.excludeCourseList = acc.excludeCourseList.concat(_excludeCourseList);
      return acc;
    },
    { groupUnitList: { 0: 0, 1: 0, 2: 0, 3: 0 }, excludeCourseList: [] }
  );

  const sumUnit = calcSumUnit({
    courseGroupList,
    groupUnitList,
    selectMinimumUnit: requirementObject.courses.selectMinimumUnit,
  });

  // 差集合をとる
  const newCourseList = courseList.filter(
    (val) => !excludeCourseList.includes(val)
  );

  return {
    newCourseList,
    sumUnit,
    selectList,
    courseGroupList,
    courseIDList,
    groupUnitList,
  };
};

const calcSumUnit = ({
  courseGroupList,
  groupUnitList,
  selectMinimumUnit,
}: {
  courseGroupList: CourseGroup[];
  groupUnitList: { [key: number]: number };
  selectMinimumUnit: number;
}) => {
  const _sumUnit = courseGroupList.reduce((acc, courseGroup) => {
    const courseGroupUnit = groupUnitList[courseGroup.id];
    return acc + Math.min(courseGroupUnit, courseGroup.maxUnit);
  }, 0);
  return Math.min(_sumUnit, selectMinimumUnit);
};

export { checkSelect, countUnitFromCode };
