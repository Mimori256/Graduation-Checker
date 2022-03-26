import React from "react";
import Course from "./Course";
import checkCompulsory from "./checkCompulsory";
import mast from "./data/mast";
import courseCodeType from "./data/courseCodeTypes";

const GraduationChecker: React.FC = () => {
  const loadCSV = (csv: string): Course[] => {
    csv = csv.replaceAll('"', "");
    const splitedCourseList: string[] = csv.split("\n");
    let splitedCourse: string[];
    let courseList: Course[] = [];
    let id: string;
    let name: string;
    let unit: number;
    let grade: string;

    for (let i = 1; i < splitedCourseList.length - 1; i++) {
      splitedCourse = splitedCourseList[i].split(",");
      id = splitedCourse[2];
      name = splitedCourse[3];
      unit = parseFloat(splitedCourse[4].replace(" ", ""));
      grade = splitedCourse[7];
      courseList.push(new Course(id, name, unit, grade));
    }

    return courseList;
  };

  const gradeCheck = (csv: Blob) => {
    const reader = new FileReader();
    reader.readAsText(csv);
    reader.onload = () => {
      const courseList: Course[] = loadCSV(reader.result as string);
      checkCompulsory(courseList);
    };
  };

  const onFileStateChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files !== null) {
      const file = (event.currentTarget as HTMLInputElement).files?.[0];
      if (!file) {
        window.alert("ファイルが選択されていません");
        return;
      }

      if (!file.name.endsWith(".csv")) {
        window.alert("CSVファイルをアップロードしてください");
        return;
      }
      gradeCheck(file);
    }
  };

  return (
    <>
      <div className="menu">
        <p>TWINSの成績ファイルを選択してください</p>
        <input
          type="file"
          id="grade-csv"
          accept=".csv"
          onChange={onFileStateChanged}
        />
        <div id="result">
          <h2>必修</h2>
          <div id="compulsory"></div>
          <div id="select"></div>
        </div>
      </div>
    </>
  );
};

export default GraduationChecker;
