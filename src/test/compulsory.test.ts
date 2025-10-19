import { test, expect } from "vitest";

import { checkCompulsory } from "../features/checkCompulsory";
import { compulsoryResultUnitCount } from "../features/utils";

import { test1, test2, test3 } from "./compulsoryData";
import { gradRequirementData } from "../data/gradRequirementData";

let result: ReturnType<typeof checkCompulsory>;
let units: number;

const mast21 = gradRequirementData["mast-21"];
test("satisfies compulsory requirement", () => {
  result = checkCompulsory(test1, mast21);
  units = compulsoryResultUnitCount(result.compulsoryResultList);
  expect(units).toBe(50);
});

test("D and F courses are not counted", () => {
  result = checkCompulsory(test2, mast21);
  units = compulsoryResultUnitCount(result.compulsoryResultList);
  expect(units).toBe(44);
});

test("Can handle alternative courses", () => {
  result = checkCompulsory(test3, mast21);
  units = compulsoryResultUnitCount(result.compulsoryResultList);
  expect(units).toBe(50);
});
