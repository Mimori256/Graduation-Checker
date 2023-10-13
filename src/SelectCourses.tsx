import Course from "./Course";
import CourseGroup from "./CourseGroup";
import SelectSubjectRequirement from "./SelectSubjectRequirement";
import { checkSelect, countUnitFromCode } from "./checkSelect";
import { GradRequirement } from "./data/gradRequirement";

const Select = ({
  courseList,
  includeCourseYear,
  gradRequirement,
}: {
  courseList: Course[];
  includeCourseYear: boolean;
  gradRequirement: GradRequirement;
}) => {
  const { selectList, sumUnit, courseGroupList, courseIDList, groupUnitList } =
    checkSelect(courseList, gradRequirement);

  return (
    <div id="select">
      <h2>選択科目の条件一覧</h2>
      <SelectGroups
        selectList={selectList}
        courseIDList={courseIDList}
        courseList={courseList}
        includeCourseYear={includeCourseYear}
      />
      <CourseGroups
        courseGroupList={courseGroupList}
        groupUnitList={groupUnitList}
      />
      <SelectCourseTotal
        sumUnit={sumUnit}
        selectMinimumUnit={gradRequirement.courses.selectMinimumUnit}
      />
    </div>
  );
};

const SelectGroups = ({
  selectList,
  courseIDList,
  courseList,
  includeCourseYear,
}: {
  selectList: SelectSubjectRequirement[];
  courseIDList: string[];
  courseList: Course[];
  includeCourseYear: boolean;
}) => (
  <>
    {selectList.map((selectSubject) => (
      <SelectGroup
        selectSubject={selectSubject}
        courseIDList={courseIDList}
        courseList={courseList}
        includeCourseYear={includeCourseYear}
      />
    ))}
  </>
);

const SelectGroup = ({
  selectSubject,
  courseIDList,
  courseList,
  includeCourseYear,
}: {
  selectSubject: SelectSubjectRequirement;
  courseIDList: string[];
  courseList: Course[];
  includeCourseYear: boolean;
}) => {
  const { excludeCourseList, unitCount } = countUnitFromCode(
    selectSubject,
    courseIDList,
    courseList
  );

  return (
    <details>
      <summary>
        {selectSubject.message}{" "}
        {unitCount >= selectSubject.minimum ? <span>〇</span> : <span>✖</span>}{" "}
        {unitCount}({selectSubject.minimum}-{selectSubject.maximum}){" "}
        {unitCount > selectSubject.maximum && <span>(上限を超えています)</span>}
      </summary>
      <DetailContent
        courses={excludeCourseList}
        includeCourseYear={includeCourseYear}
      />
    </details>
  );
};

const DetailContent = ({
  courses,
  includeCourseYear,
}: {
  courses: Course[];
  includeCourseYear: boolean;
}) => (
  <>
    {courses.map((course) => {
      const year = includeCourseYear ? `(${course.year}年度)` : "";
      return (
        <li>
          {course.id} {course.name} {year}: {course.grade}
        </li>
      );
    })}
  </>
);

const CourseGroups = ({
  courseGroupList,
  groupUnitList,
}: {
  courseGroupList: CourseGroup[];
  groupUnitList: { [key: number]: number };
}) => (
  <>
    {courseGroupList.map((courseGroup, index) => (
      <CourseGroupFC
        courseGroup={courseGroup}
        groupUnitList={groupUnitList}
        index={index}
      />
    ))}
  </>
);

const CourseGroupFC = ({
  courseGroup,
  groupUnitList,
  index,
}: {
  courseGroup: CourseGroup;
  groupUnitList: { [key: number]: number };
  index: number;
}) => {
  const courseGroupUnit = groupUnitList[courseGroup.id];
  const marubatsu =
    courseGroupUnit >= courseGroup.minUnit ? <span>〇</span> : <span>✖</span>;
  const exceedMessage =
    courseGroupUnit > courseGroup.maxUnit ? (
      <span>(単位上限を超えています)</span>
    ) : (
      ""
    );
  return (
    <>
      <h4>{courseGroup.name}</h4>
      {groupUnitList[index]}/({courseGroup.minUnit}~{courseGroup.maxUnit})
      {marubatsu}
      {exceedMessage}
    </>
  );
};

const SelectCourseTotal = ({
  sumUnit,
  selectMinimumUnit,
}: {
  sumUnit: number;
  selectMinimumUnit: number;
}) => (
  <h3>
    合計{sumUnit}/{selectMinimumUnit}単位
  </h3>
);

export { Select };
