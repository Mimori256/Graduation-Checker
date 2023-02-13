import React from "react";
import Course from "./Course";
import { gradRequirement, GradRequirement } from "./data/gradRequirement";
import checkCompulsory from "./checkCompulsory";
import checkSelect from "./checkSelect";
import showRequirements from "./showRequirements";
import "./graduationChecker.css";
import { GradePieChart } from "./GradePieChart";
import mast from "./data/mast.json";
import klis_ksc from "./data/klis_ksc.json";
import klis_kis from "./data/klis_kis.json";
import klis_irm from "./data/klis_irm.json";
import { TotalGPA } from "./totalGPA";

const getRequirement = (major: Major): GradRequirement =>
  gradRequirement.parse(
    {
      mast: mast,
      "klis-ksc": klis_ksc,
      "klis-kis": klis_kis,
      "klis-irm": klis_irm,
    }[major]
  );

const GraduationChecker: React.FC = () => {
  const [courseList, setCourseList] = React.useState<Course[] | null>(null);
  const [exceptCourses, setExceptCourses] = React.useState<Course[] | null>(
    null
  );
  const includeCourseYear = React.useRef<HTMLInputElement | null>(null);
  const majorSelect = React.useRef<HTMLSelectElement | null>(null);
  const loadCSV = (csv: string): Course[] => {
    document.getElementById("result")!.style.display = "block";
    csv = csv.replaceAll('"', "");
    const splitedCourseList: string[] = csv.split("\n");

    return splitedCourseList
      .filter((_splitedCourse, i) => _splitedCourse && i !== 0)
      .map((_splitedCourse) => {
        const splitedCourse: string[] = _splitedCourse.split(",");
        const [id, name, unit, grade, year] = [
          splitedCourse[2],
          splitedCourse[3],
          parseFloat(splitedCourse[4].replace(" ", "")),
          splitedCourse[7] as Grade,
          Number(splitedCourse[9]),
        ];
        return new Course(id, name, unit, grade, year);
      });
  };

  const checkRequirements = () => {
    const major = (majorSelect.current?.value as Major) || "mast";
    const majorRequirements = getRequirement(major);
    showRequirements(majorRequirements);
  };

  const gradeCheck = (csv: Blob) => {
    // 使い方の表示を消す
    document.getElementById("usage")!.innerHTML = "";

    //チェックボックスの判定
    const checkBox = includeCourseYear.current;
    const major = (majorSelect.current?.value as Major) || "mast";
    const requirementObject = getRequirement(major);

    const isChecked = (checkBox && checkBox.checked) || false;
    const reader = new FileReader();
    const minumumGraduationUnit = 124;
    let sumUnit = 0;
    reader.readAsText(csv);
    reader.onload = () => {
      const courseList: Course[] = loadCSV(reader.result as string);
      setCourseList(courseList);
      const {
        newCourseList: compulsoryCourseList,
        sumUnit: compulsorySumUnit,
      } = checkCompulsory(courseList, isChecked, requirementObject);
      const { newCourseList: selectCourseList, sumUnit: selectSumUnit } =
        checkSelect(compulsoryCourseList, isChecked, requirementObject);
      sumUnit = selectSumUnit + compulsorySumUnit;
      setExceptCourses(selectCourseList);
      document.getElementById(
        "sum"
      )!.innerHTML += `合計${sumUnit}/${minumumGraduationUnit}`;

      document.getElementById("sum")!.innerHTML +=
        sumUnit >= minumumGraduationUnit
          ? "<font color='red'>◯</font>"
          : "<font color='blue'>✖</font>";
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
          ref={includeCourseYear}
        />
        <label htmlFor="includeCourseYear">各授業の履修年度も表示する</label>
        <p>
          <b>チェックする学類と専攻</b>
        </p>
        <select name="major" id="major-select" ref={majorSelect}>
          <option value="mast">情報メディア創成学類-メディア創成</option>
          <option value="klis-ksc">知識情報・図書館学類-知識科学</option>
          <option value="klis-kis">
            知識情報・図書館学類-知識情報システム
          </option>
          <option value="klis-irm">知識情報・図書館学類-情報資源経営</option>
        </select>
        <p>
          <button
            type="button"
            id="showRequirements"
            onClick={checkRequirements}
          >
            卒業要件を表示
          </button>
        </p>
      </div>
      <div id="usage">
        <h3>使い方</h3>
        <ul>
          <li>
            TWINSにログインして、成績をクリック、ページ下部にあるダウンロード→出力をクリックしてCSVファイルをダウンロードする
          </li>
          <li>
            そのCSVファイルを上で選択すると、その成績が卒業要件を満たしているか確認することができます
          </li>
          <li>
            科目の左の三角をクリックすることで、単位の内訳の科目を詳細表示することができます
          </li>
          <li>
            また、「卒業要件を表示」ボタンを押すことで、選択している専攻の卒業要件を表示することができます
          </li>
        </ul>
      </div>
      <div id="result">
        <div id="compulsory"></div>
        <br />
        <div id="select"></div>
        <div id="except">
          <h3>卒業要件外の科目</h3>
          {exceptCourses ? (
            <ul>
              {exceptCourses.map((exceptCourse) => (
                <li>
                  ${exceptCourse.name}(${exceptCourse.id})
                </li>
              ))}
            </ul>
          ) : (
            `なし`
          )}
        </div>
        <div id="sum"></div>
        <TotalGPA courses={courseList}></TotalGPA>
        <GradePieChart courseList={courseList}></GradePieChart>
      </div>
      <div id="footer">
        <ul>
          <li>
            TWINSの成績ファイルはローカルで処理され、サーバーにアップロードされることはありません
          </li>
          <li>
            現在は2021年の情報学群メディア創成学類、知識情報図書館学類の卒業要件のみに対応しています
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
        <li>
          <a
            href="https:///github.com/Mimori256"
            target="_blank"
            rel="noreferrer"
          >
            Mimori
          </a>
          ,&thinsp;
          <a
            href="https://github.com/yudukikun5120"
            target="_blank"
            rel="noreferrer"
          >
            yudukikun5120
          </a>
        </li>
        <p></p>
      </div>
    </>
  );
};

export default GraduationChecker;
