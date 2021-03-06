# Graduation Checker

https://mimori256.github.io/Graduation-Checker/

## 概要

TWINS の成績データから、筑波大学の卒業要件を満たしているかどうか確認するツール。現在は情報学群メディア創成学類の令和 3 年度入学生の卒業要件のみに対応しています。

## 卒業要件ファイルのフォーマット

卒業要件を表すデータファイルは JSON 形式になっています。具体的なフォーマットは以下のようになっています。

```
{
  header: {
    department: "学類",
    major: "専攻",
    enrollYear: 入学年,
  },

courses: {
  complusory: [
      "必修科目の科目名、または(科目の区分:必要単位数)",
      ...
    ],
    complusorySumUnit: 必修科目の単位の合計
    select: [
      new SelectSubjectRequirement(条件の科目番号のリスト, 最低単位, 最高単位, リストの科目か、それ意外の科目か(bool), "ウェブページの表記"),
      ...
    ],
    selectMinimumUnit: 選択科目の最低単位数,
}

```

### Contribution

Issue や PR、このツールに関する質問はいつでも受け付けています。
