import { GradRequirement } from "./data/gradRequirement";
import { kdb, Kdb } from "./data/kdb";
import kdbJson from "./data/kdb.json";

const addUnitSum = (s: string, group: any): string => {
  const minimum = String(group[1]);
  const maximum = String(group[2]);
  return s + "<h4>合計 (" + minimum + "～" + maximum + ")</h4>";
};

const createLink = (s: string): string => {
  const id = s.split(" ")[0];
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  let nendo;

  if (month < 4) {
    nendo = year - 1;
  } else {
    nendo = year;
  }

  return (
    "<a href = https://kdb.tsukuba.ac.jp/syllabi/" +
    nendo.toFixed() +
    "/" +
    id +
    "/jpn target=_'blank' rel='noopener'>" +
    s +
    "</a>"
  );
};

const removeAlternatives = (complusoryCourses: string[]): string[] => {
  for (let i = 0; i < complusoryCourses.length; i++) {
    if (complusoryCourses[i].includes("//")) {
      complusoryCourses[i] = complusoryCourses[i].slice(
        0,
        complusoryCourses[i].indexOf("//")
      );
    }
  }

  return complusoryCourses;
};

const isShowingCoursesAvailable = (
  courses: string[],
  isExcludeCourse: boolean
): boolean => {
  let tmp = true;
  if (isExcludeCourse) {
    return false;
  }

  courses.forEach((course) => {
    if (course.startsWith("*")) {
      tmp = false;
    }
  });

  return tmp;
};

const isValidCourse = (courseName: string): boolean => {
  const exceptionCourses = [
    "卒業研究",
    "専門英語",
    "専門語学",
    "実験A",
    "実験B",
    "実習A",
    "実習B",
    "知識情報演習",
    "アカデミックスキルズ",
  ];

  let tmp = true;

  exceptionCourses.forEach((c) => {
    if (courseName.includes(c)) tmp = false;
  });

  return tmp;
};

const searchCourses = (
  courseCode: string,
  kdbCourses: Kdb,
  complusoryCourses: string[]
): string[] => {
  const courses = kdbCourses["courses"];
  let validCourses: string[] = [];
  for (let i = 0; i < courses.length; i++) {
    if (
      courses[i].id.startsWith(courseCode) &&
      !complusoryCourses.includes(courses[i].name) &&
      isValidCourse(courses[i].name)
    ) {
      validCourses.push(
        createLink(
          [
            courses[i].id,
            courses[i].name,
            courses[i].modules,
            courses[i].period,
            courses[i].credits + "単位",
            courses[i].registerYear + "年次",
          ].join(" ")
        )
      );
    }
  }
  return validCourses;
};

const addAvailabeCoursesDetail = (
  courses: string[],
  complusoryCourses: string[]
): string => {
  const kdbCourses = kdb.parse(kdbJson);
  let output = "";

  courses.forEach((course) => {
    output += searchCourses(course, kdbCourses, complusoryCourses).join("<br>");
    output += "<br>";
  });

  return output;
};

const showComplusory = (majorRequirement: GradRequirement) => {
  let output = "<h2>必修科目</h2><ul>";
  majorRequirement.courses.complusory.forEach((course: string) => {
    if (course.includes("//")) {
      course = course.replace("//", " 互換: ");
    } else if (course.includes("::")) {
      course = course.replace("::", " ");
      course += "単位";
    }
    output += "<li style='margin-right: 7%'>" + course + "</li>";
  });
  output += "</ul>";
  output +=
    "<h3>合計" + majorRequirement.courses.complusorySumUnit + "単位</h3>";
  document.getElementById("compulsory")!.innerHTML = output;
};

const showSelect = (majorRequirement: GradRequirement) => {
  let output = "<h2>選択科目</h2>";
  const complusoryCourses = removeAlternatives(
    majorRequirement.courses.complusory
  );
  let couruseGroupOutputList = [
    "<h3>専門科目</h3>",
    "<h3>専門基礎科目</h3>",
    "<h3>共通科目</h3>",
    "<h3>関連科目</h3>",
  ];
  majorRequirement.courses.select.forEach((select) => {
    const courses: string[] = select[0];
    const minimumUnit = String(select[1]);
    let maximumUnit = String(select[2]);
    const isExcludeCourse = select[3];
    const courseName = select[4];
    const courseGroup = select[5];
    let tmpOutput = "";

    maximumUnit = maximumUnit === "128" ? "" : maximumUnit;

    if (isShowingCoursesAvailable(courses, isExcludeCourse)) {
      tmpOutput =
        "<li style='margin-right: 1%'>" +
        "<details>" +
        "<summary>" +
        courseName +
        "(" +
        minimumUnit +
        "～" +
        maximumUnit +
        ")</summary>" +
        addAvailabeCoursesDetail(courses, complusoryCourses) +
        "</details>" +
        "</li>";
    } else {
      tmpOutput =
        "<li style='margin-right: 1%'>" +
        courseName +
        "(" +
        minimumUnit +
        "～" +
        maximumUnit +
        ")" +
        "</li>";
    }

    couruseGroupOutputList[courseGroup] += tmpOutput;
  });

  couruseGroupOutputList = couruseGroupOutputList.map((x) => x + "</ul>");

  for (let i = 0; i < couruseGroupOutputList.length; i++) {
    couruseGroupOutputList[i] = addUnitSum(
      couruseGroupOutputList[i],
      majorRequirement.courses.groups[i]
    );
  }

  output += couruseGroupOutputList.join("");

  document.getElementById("select")!.innerHTML = output;
};

const showRequirements = (majorRequirement: GradRequirement) => {
  showComplusory(majorRequirement);
  showSelect(majorRequirement);
};

export default showRequirements;
