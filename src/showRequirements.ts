import { GradRequirement } from "./data/gradRequirement";

const addUnitSum = (s: string, group: any): string => {
  const minimum = String(group[1]);
  const maximum = String(group[2]);
  return s + "<h4>合計 (" + minimum + "～" + maximum + ")</h4>";
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
    output += "<li style='margin-right: 10%'>" + course + "</li>";
  });
  output += "</ul>";
  output +=
    "<h3>合計" + majorRequirement.courses.complusorySumUnit + "単位</h3>";
  document.getElementById("compulsory")!.innerHTML = output;
};

const showSelect = (majorRequirement: GradRequirement) => {
  let output = "<h2>選択科目</h2>";
  let majorCourseOutput = "<h3>専門科目</h3><ul>";
  let majorBasicCourseOutput = "<h3>専門基礎科目</h3><ul>";
  let fundamentalCourseOutput = "<h3>共通科目</h3><ul>";
  let relatedCourseOutput = "<h3>関連科目</h3><ul>";
  majorRequirement.courses.select.forEach((select) => {
    const minimumUnit = String(select[1]);
    const maximumUnit = String(select[2]);
    const courseName = select[4];
    const courseGroup = select[5];
    const tmpOutput =
      "<li style='margin-right: 10%'>" +
      courseName +
      "(" +
      minimumUnit +
      "～" +
      maximumUnit +
      ")</li>";

    if (courseGroup === 0) {
      majorCourseOutput += tmpOutput;
    } else if (courseGroup === 1) {
      majorBasicCourseOutput += tmpOutput;
    } else if (courseGroup === 2) {
      fundamentalCourseOutput += tmpOutput;
    } else {
      relatedCourseOutput += tmpOutput;
    }
  });

  majorCourseOutput += "</ul>";
  majorBasicCourseOutput += "</ul>";
  fundamentalCourseOutput += "</ul>";
  relatedCourseOutput += "</ul>";

  majorCourseOutput = addUnitSum(
    majorCourseOutput,
    majorRequirement.courses.groups[0]
  );
  majorBasicCourseOutput = addUnitSum(
    majorBasicCourseOutput,
    majorRequirement.courses.groups[1]
  );
  fundamentalCourseOutput = addUnitSum(
    fundamentalCourseOutput,
    majorRequirement.courses.groups[2]
  );
  relatedCourseOutput = addUnitSum(
    relatedCourseOutput,
    majorRequirement.courses.groups[3]
  );

  output +=
    majorCourseOutput +
    majorBasicCourseOutput +
    fundamentalCourseOutput +
    relatedCourseOutput;
  document.getElementById("select")!.innerHTML = output;
};

const showRequirements = (majorRequirement: GradRequirement) => {
  showComplusory(majorRequirement);
  showSelect(majorRequirement);
};

export default showRequirements;
