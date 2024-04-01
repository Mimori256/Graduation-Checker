import { useState } from "preact/hooks";

import type { Course } from "./types/Course";
import type { Major } from "./types/Major";

import { Footer } from "./components/Footer";
import { GraduationChecker } from "./components/GraduationChecker";
import { OptionSelector } from "./components/OptionSelector";
import { Requirement } from "./components/Requirement";

import { loadCSV } from "./features/loadCSV";

import styles from "./App.module.css";
import { majors, years } from "./consts/const";

const getRequirement = (major: string, year: string) => {
  let res = "";
  if (year === "2021") {
    res = `${major}-${21}`;
  } else {
    res = `${major}-${22}`;
  }
  if (isMajor(res)) {
    return res as Major;
  }
  throw new Error("Invalid major");
};

const isMajor = (str: string): str is Major => {
  return [
    "mast-21",
    "mast-22",
    "klis-ksc-21",
    "klis-ksc-22",
    "klis-kis-21",
    "klis-kis-22",
    "klis-irm-21",
    "klis-irm-22",
  ].includes(str);
};

const Usage = () => (
  <div className={styles.usage}>
    <h3>使い方</h3>
    <ul>
      <li>
        TWINSにログインして、成績をクリック、ページ下部にあるダウンロード→出力をクリックしてCSVファイルをダウンロードします
      </li>
      <li>
        そのCSVファイルを上で選択すると、その成績が卒業要件を満たしているか確認することができます
      </li>
      <li>
        科目の左の三角をクリックすることで、単位の内訳の科目を詳細表示することができます
      </li>
      <li>
        また、「卒業要件のみを表示」ボタンを押すことで、選択している専攻の卒業要件を表示することができます
      </li>
      <li>
        卒業要件を表示した後、一部の選択科目は、折りたたみメニューを表示することで、条件を満たす科目一覧を表示できます。
      </li>
      <li>各科目をクリックすることで、シラバスを見ることができます</li>
      <li>
        <span className={styles.warning}>
          今年度開講しない科目や、所属する学類によっては、受講ができない科目も存在するので、受講ができるかどうかは、シラバスをよく確認してください
        </span>
      </li>
    </ul>
  </div>
);

export function App() {
  const [includeCourseYear, setIncludeCourseYear] = useState(false);
  const [isGradCheckMode, setIsGradCheckMode] = useState(false);
  const [isRequirementMode, setIsRequirementMode] = useState(false);
  const [major, setMajor] = useState(majors[0]);
  const [year, setYear] = useState(years[0]);
  const [courseList, setCourseList] = useState<Course[]>([]);

  const onFileStateChanged = async (e: Event) => {
    setIsRequirementMode(false);
    const target = e.currentTarget as HTMLInputElement;
    if (target && target.files !== null) {
      const file = target.files?.[0];
      if (!file) {
        window.alert("ファイルが選択されていません");
        return;
      }

      if (!file.name.endsWith(".csv")) {
        window.alert("CSVファイルをアップロードしてください");
      }

      try {
        const courses = await loadCSV(file);
        setIsGradCheckMode(true);
        setCourseList(courses);
      } catch (error) {
        console.error("Error loading CSV:", error);
      }
    }
  };

  const handleReqirementButton = () => {
    setIsRequirementMode(true);
  };

  return (
    <div className={styles.app}>
      <h1>卒業要件チェッカー</h1>
      <div className="menu">
        <ul>
          <li>TWINSの成績ファイルを選択してください</li>
          <li>履修中の科目は、必修、選択に関わらず単位数にカウントされます</li>
          <li>成績がDとなっている科目は、単位数にカウントされません</li>
        </ul>
        <div>
          <OptionSelector onMajorChange={setMajor} onYearChange={setYear} />
        </div>
        <label htmlFor="grade-csv">TWINSの成績ファイル</label>
        <p>
          <input
            type="file"
            id="grade-csv"
            accept=".csv"
            onChange={onFileStateChanged}
          />
        </p>
        <p>
          <label htmlFor="include-course-year">
            各授業の履修年度も表示する
          </label>
          <input
            id="include-course-year"
            type="checkbox"
            name="include-course-year"
            onChange={(e) => {
              if (e.target) {
                const target = e.target as HTMLInputElement;
                setIncludeCourseYear(target.checked);
              }
            }}
          />
        </p>
        <button
          type="button"
          className={styles.button}
          onClick={handleReqirementButton}
        >
          卒業要件のみを表示
        </button>
      </div>
      {isGradCheckMode && (
        <div>
          <GraduationChecker
            requirementType={getRequirement(major, year)}
            courseList={courseList}
            includeCourseYear={includeCourseYear}
          />
        </div>
      )}
      {isRequirementMode && (
        <div>
          <Requirement major={getRequirement(major, year)} />
        </div>
      )}
      {!isGradCheckMode && !isRequirementMode && <Usage />}
      <Footer />
    </div>
  );
}
