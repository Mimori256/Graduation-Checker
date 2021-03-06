import SelectSubjectRequirement from "../SelectSubjectRequirement";
import CourseGroup from "../CourseGroup";
import Course from "../Course";

const mast = {
  header: {
    department: "情報メディア創成学類",
    major: "情報メディア創成",
    enrollYear: 2021,
  },

  courses: {
    complusory: [
      "卒業研究A",
      "卒業研究B",
      "情報メディア実験A",
      "情報メディア実験B",
      "専門英語A",
      "専門英語B",
      "微分積分A",
      "微分積分B",
      "線形代数A",
      "線形代数B",
      "情報数学A",
      "確率と統計",
      "プログラミング入門A",
      "プログラミング入門B",
      "プログラミング",
      "コンピュータシステムとOS",
      "データ構造とアルゴリズム",
      "データ構造とアルゴリズム実習",
      "データ工学概論",
      "フレッシュマン・セミナー",
      "学問への誘い",
      "情報::4",
      "体育::2",
      "必修英語::4",
    ],
    complusorySumUnit: 50,
    select: [
      new SelectSubjectRequirement(
        ["GC5", "GA4"],
        20,
        35,
        false,
        "GC5, GA4",
        0
      ),
      new SelectSubjectRequirement(
        ["GC2", "GA1"],
        32,
        47,
        false,
        "GC2, GA1",
        1
      ),
      new SelectSubjectRequirement(
        ["*学士基盤科目"],
        1,
        4,
        false,
        "学士基盤科目",
        2
      ),
      new SelectSubjectRequirement(["*体育"], 0, 2, false, "体育", 2),
      new SelectSubjectRequirement(["*外国語"], 0, 6, false, "外国語", 2),
      new SelectSubjectRequirement(["*国語"], 0, 2, false, "国語", 2),
      new SelectSubjectRequirement(["*芸術"], 0, 6, false, "芸術", 2),
      new SelectSubjectRequirement(["GB", "GE"], 0, 9, false, "GB, GE", 3),
      new SelectSubjectRequirement(
        ["*博物館に関する科目"],
        0,
        9,
        false,
        "博物館に関する科目",
        3
      ),
      new SelectSubjectRequirement(
        ["GA", "GB", "GC", "GE", "*総合科目", "*教職に関する科目"],
        6,
        15,
        true,
        "他学群の授業科目",
        3
      ),
    ],
    selectMinimumUnit: 74,
    groups: [
      new CourseGroup(0, 20, 35, "専門科目選択"),
      new CourseGroup(1, 32, 47, "専門基礎科目選択"),
      new CourseGroup(2, 1, 10, "共通科目選択"),
      new CourseGroup(3, 6, 15, "関連科目選択"),
    ],
  },
};

export default mast;
