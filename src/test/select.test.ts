import { test, expect } from "vitest";

import type { Course } from "../types/Course";

import { checkSelect } from "../features/checkSelect";
import { selectResultUnitCount } from "../features/utils";

import data from "./selectData.json";
import requirements from "../data/major.json";

const mast21 = requirements["mast-21"];
const sample = data.sample as Course[];
test("satisfies select requirement", () => {
  const { selectResultList, leftCourseList } = checkSelect(sample, mast21);
  const units = selectResultUnitCount(selectResultList);
  expect(units).toBe(74);
  expect(leftCourseList.length).toBe(0);
});
