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
    output += "<li style='margin-right: 7%'>" + course + "</li>";
  });
  output += "</ul>";
  output +=
    "<h3>合計" + majorRequirement.courses.complusorySumUnit + "単位</h3>";
  document.getElementById("compulsory")!.innerHTML = output;
};

const showSelect = (majorRequirement: GradRequirement) => {
  let output = "<h2>選択科目</h2>";
  let couruseGroupOutputList = [
    "<h3>専門科目</h3>",
    "<h3>専門基礎科目</h3>",
    "<h3>共通科目</h3>",
    "<h3>関連科目</h3>",
  ];
  majorRequirement.courses.select.forEach((select) => {
    const minimumUnit = String(select[1]);
    let maximumUnit = String(select[2]);
    const courseName = select[4];
    const courseGroup = select[5];

    maximumUnit = maximumUnit === "128" ? "" : maximumUnit;

    const tmpOutput =
      "<li style='margin-right: 1%'>" +
      courseName +
      "(" +
      minimumUnit +
      "～" +
      maximumUnit +
      ")</li>";

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
