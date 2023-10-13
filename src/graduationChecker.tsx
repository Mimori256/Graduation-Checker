import React from "react";
import Course from "./Course";
import { gradRequirement, GradRequirement } from "./data/gradRequirement";
import checkCompulsory from "./checkCompulsory";
import checkSelect from "./checkSelect";
import showRequirements from "./showRequirements";
import "./graduationChecker.css";
import { GradePieChart } from "./GradePieChart";
import mast21 from "./data/mast21.json";
import klis_ksc21 from "./data/klis_ksc21.json";
import klis_kis21 from "./data/klis_kis21.json";
import klis_irm21 from "./data/klis_irm21.json";
import mast22 from "./data/mast22.json";
import klis_ksc22 from "./data/klis_ksc22.json";
import klis_kis22 from "./data/klis_kis22.json";
import klis_irm22 from "./data/klis_irm22.json";
import { TotalGPA } from "./totalGPA";

const getRequirement = (major: Major): GradRequirement =>
  gradRequirement.parse(
    {
      mast21: mast21,
      "klis-ksc21": klis_ksc21,
      "klis-kis21": klis_kis21,
      "klis-irm21": klis_irm21,
      mast22: mast22,
      "klis-ksc22": klis_ksc22,
      "klis-kis22": klis_kis22,
      "klis-irm22": klis_irm22,
    }[major]
  );

const GraduationChecker: React.FC = () => {
  const [courseList, setCourseList] = React.useState<Course[] | null>(null);
  const [exceptCourses, setExceptCourses] = React.useState<Course[] | null>(
    null
  );
  const [usageVisible, setUsageVisible] = React.useState<boolean>(true);
  const [sumUnit, setSumUnit] = React.useState<number>(0);
  const [minumumGraduationUnit, setMinumumGraduationUnit] =
    React.useState<number>(124);
  const [isCompulsoryCompleted, setIsCompulsoryCompleted] =
    React.useState<boolean>(false);

  const includeCourseYear = React.useRef<HTMLInputElement | null>(null);
  const majorSelect = React.useRef<HTMLSelectElement | null>(null);
  const enrollYear = React.useRef<HTMLSelectElement | null>(null);
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
    const tmpMajor = majorSelect.current!.value + enrollYear.current!.value;
    const major = (tmpMajor as Major) || "mast21";
    const majorRequirements = getRequirement(major);
    showRequirements(majorRequirements);
  };

  const gradeCheck = (csv: Blob) => {
    // 使い方の表示を消す
    setUsageVisible(false);
    //チェックボックスの判定
    const checkBox = includeCourseYear.current;
    const tmpMajor = majorSelect.current!.value + enrollYear.current!.value;
    const major = (tmpMajor as Major) || "mast21";
    const requirementObject = getRequirement(major);

    const isChecked = (checkBox && checkBox.checked) || false;
    const reader = new FileReader();
    const minumumGraduationUnit = 124;
    const compulsoryRequirementUnit =
      requirementObject.courses.complusorySumUnit;
    let sumUnit = 0;
    let isCompulsoryCompleted = false;
    reader.readAsText(csv);
    reader.onload = () => {
      const courseList: Course[] = loadCSV(reader.result as string);
      setCourseList(courseList);
      const {
        newCourseList: compulsoryCourseList,
        sumUnit: compulsorySumUnit,
      } = checkCompulsory(courseList, isChecked, requirementObject);

      isCompulsoryCompleted = compulsorySumUnit === compulsoryRequirementUnit;

      const { newCourseList: selectCourseList, sumUnit: selectSumUnit } =
        checkSelect(compulsoryCourseList, isChecked, requirementObject);
      sumUnit = selectSumUnit + compulsorySumUnit;
      setSumUnit(sumUnit);
      setMinumumGraduationUnit(minumumGraduationUnit);
      setIsCompulsoryCompleted(isCompulsoryCompleted);
      setExceptCourses(selectCourseList);
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
          <b>チェックする学類と専攻、年度</b>
        </p>
        <select name="major" id="major-select" ref={majorSelect}>
          <option value="mast">情報メディア創成学類-メディア創成</option>
          <option value="klis-ksc">知識情報・図書館学類-知識科学</option>
          <option value="klis-kis">
            知識情報・図書館学類-知識情報システム
          </option>
          <option value="klis-irm">知識情報・図書館学類-情報資源経営</option>
        </select>
        <br />
        <br />
        <select name="enrollYear" id="enroll-year" ref={enrollYear}>
          <option value="21">2021年度</option>
          <option value="22">2022/2023年度</option>
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
      {usageVisible && <Usage />}
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
        <Sum
          sumUnit={sumUnit}
          minumumGraduationUnit={minumumGraduationUnit}
          isCompulsoryCompleted={isCompulsoryCompleted}
        ></Sum>
        <TotalGPA courses={courseList}></TotalGPA>
        <GradePieChart courseList={courseList}></GradePieChart>
      </div>
      <div id="footer">
        <ul>
          <li>
            TWINSの成績ファイルはローカルで処理され、サーバーにアップロードされることはありません
          </li>
          <li>
            現在は2021、2022、2023年度入学の情報学群メディア創成学類、知識情報図書館学類の卒業要件のみに対応しています
          </li>
          <li>
            卒業要件は、
            <a
              href="https://www.tsukuba.ac.jp/education/ug-courses-directory/index.html"
              target="_blank"
              rel="noreferrer"
              rel="noreferrer noopener"
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
            rel="noreferrer noopener"
          >
            Source code is available on GitHub
          </a>
        </p>
        <Contributors></Contributors>
      </div>
    </>
  );
};

const Usage = () => (
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
      <li>
        卒業要件を表示した後、一部の選択科目は、折りたたみメニューを表示することで、条件を満たす科目一覧を表示できます。各科目をクリックすることで、シラバスを見ることができます
      </li>
      <li>
        <span className="warn">
          今年度開講しない科目や、所属する学類によっては、受講ができない科目も存在するので、受講ができるかどうかは、シラバスをよく確認してください
        </span>
      </li>
    </ul>
  </div>
);

const Sum = ({
  sumUnit,
  minumumGraduationUnit,
  isCompulsoryCompleted,
}: {
  sumUnit: number;
  minumumGraduationUnit: number;
  isCompulsoryCompleted: boolean;
}) => (
  <>
    <p>
      合計{sumUnit}/{minumumGraduationUnit}
    </p>
    <p>
      {sumUnit >= minumumGraduationUnit && isCompulsoryCompleted ? (
        <span color="red">◯</span>
      ) : (
        <span color="blue">✖</span>
      )}
    </p>
    {sumUnit >= minumumGraduationUnit && !isCompulsoryCompleted && (
      <p>(必修科目に不足があります！)</p>
    )}
  </>
);

const Contributors = () => (
  <div>
    Contributed by{" "}
    <address className="contributor">
      <a
        href="https:///github.com/Mimori256"
        target="_blank"
        rel="noreferrer noopener"
      >
        Mimori
      </a>
    </address>
    ,&thinsp;
    <address className="contributor">
      <a
        href="https://github.com/yudukikun5120"
        target="_blank"
        rel="noreferrer noopener"
      >
        yudukikun5120
      </a>
    </address>
  </div>
);

export default GraduationChecker;
