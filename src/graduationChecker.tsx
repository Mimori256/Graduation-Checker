import React from "react";
import Course from "./Course";
import checkCompulsory from "./checkCompulsory";
import checkSelect from "./checkSelect";
import "./graduationChecker.css";

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

  const showExceptCourses = (courseList: Course[]) => {
    let element: string = "<h3>卒業要件外の科目</h3>";
    if (courseList.length === 0) {
      element += "なし";
    } else {
      for (let i = 0; i < courseList.length; i++) {
        element += "<p> ・" + courseList[i].name + "</p>\n";
      }
    }

    document.getElementById("except")!.innerHTML = element;
  };

  const gradeCheck = (csv: Blob) => {
    // 使い方の表示を消す
    document.getElementById("usage")!.innerHTML = "";

    const reader = new FileReader();
    const minumumGraduationUnit = 124;
    let sumUnit = 0;
    reader.readAsText(csv);
    reader.onload = () => {
      const courseList: Course[] = loadCSV(reader.result as string);
      let tmpRes = checkCompulsory(courseList);
      let newCourseList = tmpRes[0];
      sumUnit += tmpRes[1];
      tmpRes = checkSelect(newCourseList);
      newCourseList = tmpRes[0];
      sumUnit += tmpRes[1];
      showExceptCourses(newCourseList);
      document.getElementById("sum")!.innerHTML +=
        "合計" + sumUnit + "/" + minumumGraduationUnit;

      if (sumUnit >= minumumGraduationUnit) {
        document.getElementById("sum")!.innerHTML +=
          "<font color='red'>◯</font>";
      } else {
        document.getElementById("sum")!.innerHTML +=
          "<font color='blue'>✖</font>";
      }
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
        <p>
          履修中の科目は、単位数にカウントされます
        </p>
        <p>成績がDとなっている科目は、単位数にカウントされません</p>
        <input
          type="file"
          id="grade-csv"
          accept=".csv"
          onChange={onFileStateChanged}
        />
      </div>
      <div id="usage">
        <h3>使い方</h3>
        <p>
          TWINSにログインして、成績をクリック、ページ下部にあるダウンロード→出力をクリックしてCSVファイルをダウンロードする
        </p>
        <p>そのCSVファイルを上で選択する</p>
      </div>
      <div id="result">
        <div id="compulsory"></div>
        <br />
        <div id="select"></div>
        <div id="except"></div>
        <div id="sum"></div>
      </div>
      <div id="footer">
        <p>
          TWINSの成績ファイルはローカルで処理され、サーバーにアップロードされることはありません
        </p>
        <p>
          現在は2021年の情報学群メディア創成学類の卒業要件のみに対応しています
        </p>
        <p>
          <a
            href="https://github.com/Mimori256/Graduation-Checker"
            target="_blank"
            rel="noreferrer"
          >
            Source code is available on GitHub
          </a>
        </p>
        Contributed by{" "}
        <a
          href="https:///github.com/Mimori256"
          target="_blank"
          rel="noreferrer"
        >
          Mimori
        </a>
        <p></p>
      </div>
    </>
  );
};

export default GraduationChecker;
