import type { Course } from "../types/Course";

export const majors = ["mast", "klis-ksc", "klis-kis", "klis-irm"];
export const majorNames = [
  "情報メディア創成学類-メディア創成",
  "知識情報・図書館学類-知識科学",
  "知識情報・図書館学類-知識情報システム",
  "知識情報・図書館学類-情報資源経営",
];
export const years = ["2021", "2022～2024"];

export const compulsoryEnglishDict: { [key: string]: string } = {
  "English Reading Skills I": "31H",
  "English Presentation Skills I": "31J",
  "English Reading Skills II": "31K",
  "English Presentation Skills II": "31L",
};

export const errorCourse: Course = {
  id: "Error",
  name: "Error",
  unit: 0,
  grade: "Error",
  year: 0,
};

export const statusSignMap = {
  passed: "〇",
  failed: "✖",
  taking: "△",
};

export const PASSED = "〇";
export const FAILED = "✖";
export const TAKING = "△";
