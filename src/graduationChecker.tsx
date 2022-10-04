import React from "react";
import Course from "./Course";
import checkCompulsory from "./checkCompulsory";
import checkSelect from "./checkSelect";
import "./graduationChecker.css";
import { Grade } from "./data/grade";

const GraduationChecker: React.FC = () => {
  const loadCSV = (csv: string): Course[] => {
    document.getElementById("result")!.style.display = "block";
    csv = csv.replaceAll('"', "");
    const splitedCourseList: string[] = csv.split("\n");
    let splitedCourse: string[];
    let courseList: Course[] = [];
    let id: string;
    let name: string;
    let unit: number;
    let grade: Grade;
    let year: number;

    for (let i = 1; i < splitedCourseList.length - 1; i++) {
      splitedCourse = splitedCourseList[i].split(",");
      id = splitedCourse[2];
      name = splitedCourse[3];
      unit = parseFloat(splitedCourse[4].replace(" ", ""));
      grade = splitedCourse[7] as Grade;
      year = Number(splitedCourse[9]);
      courseList.push(new Course(id, name, unit, grade, year));
    }

    return courseList;
  };

  const showExceptCourses = (courseList: Course[]) => {
    let element: string = "<h3>卒業要件外の科目</h3>";
    if (courseList.length === 0) {
      element += "なし";
    } else {
      for (let i = 0; i < courseList.length; i++) {
        element +=
          "<p> ・" + courseList[i].name + " (" + courseList[i].id + ") </p>\n";
      }
    }

    document.getElementById("except")!.innerHTML = element;
  };

  const gradeCheck = (csv: Blob) => {
    // 使い方の表示を消す
    document.getElementById("usage")!.innerHTML = "";

    let isChecked: boolean;
    //チェックボックスの判定
    const checkBox = document.querySelector(
      "input[type='checkbox']"
    ) as HTMLInputElement;

    if (checkBox && checkBox.checked) {
      isChecked = true;
    } else {
      isChecked = false;
    }
    const reader = new FileReader();
    const minumumGraduationUnit = 124;
    let sumUnit = 0;
    reader.readAsText(csv);
    reader.onload = () => {
      const courseList: Course[] = loadCSV(reader.result as string);
      let tmpRes = checkCompulsory(courseList, isChecked);
      let newCourseList = tmpRes[0];
      sumUnit += tmpRes[1];
      tmpRes = checkSelect(newCourseList, isChecked);
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
        <ul>
          <li>TWINSの成績ファイルを選択してください</li>
          <li>履修中の科目は、必修、選択に関わらず単位数にカウントされます</li>
          <li>成績がDとなっている科目は、単位数にカウントされません</li>
        </ul>
        <p>
          <input
            type="file"
            id="grade-csv"
            accept=".csv"
            onChange={onFileStateChanged}
          />
        </p>
        <input
          id="includeCourseYear"
          type="checkbox"
          name="includeCourseYear"
        />
        <label htmlFor="includeCourseYear">各授業の履修年度も表示する</label>
      </div>
      <div id="usage">
        <h3>使い方</h3>
        <ul>
          <li>
            TWINSにログインして、成績をクリック、ページ下部にあるダウンロード→出力をクリックしてCSVファイルをダウンロードする
          </li>
          <li>
            そのCSVファイルを上で選択すると、その成績が卒業要件を満たしているか確認することができます。
          </li>
          <li>
            科目の左の三角をクリックすることで、単位の内訳の科目を詳細表示することができます
          </li>
        </ul>
      </div>
      <div id="result">
        <div id="compulsory"></div>
        <br />
        <div id="select"></div>
        <div id="except"></div>
        <div id="sum"></div>
      </div>
      <div id="footer">
        <ul>
          <li>
            TWINSの成績ファイルはローカルで処理され、サーバーにアップロードされることはありません
          </li>
          <li>
            現在は2021年の情報学群メディア創成学類の卒業要件のみに対応しています
          </li>
          <li>
            卒業要件は、2021年度の
            <a
              href="https://www.tsukuba.ac.jp/education/ug-courses-directory/2021/pdf/5-2.pdf"
              target="_blank"
              rel="noopener"
            >
              学群等履修細則
            </a>
            に基づいています
          </li>
          <li>
            このツールの使用によって生じた不利益等について、開発者は一切の責任を負いません
          </li>
        </ul>
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
