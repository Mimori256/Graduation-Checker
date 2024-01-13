import type { CompulsoryResult } from "../types/CompulsoryResult";
import type { SelectResult } from "../types/SelectResult";

interface DetailProps {
  readonly result: CompulsoryResult | SelectResult;
  readonly includeCourseYear: boolean;
}

export const Details = ({ result, includeCourseYear }: DetailProps) => {
  if (result.courses.length === 0) {
    return <span>該当無し</span>;
  }
  return (
    <div>
      {result.courses.map((course) => {
        return (
          <p>
            {course.name} {includeCourseYear ? `(${course.year})` : ""}{" "}
            {course.grade}
          </p>
        );
      })}
    </div>
  );
};

export const SelectDetails = ({ result, includeCourseYear }: DetailProps) => {
  if (result.courses.length === 0) {
    return <span>該当無し</span>;
  }
  return (
    <div>
      {result.courses.map((course) => {
        return (
          <p>
            {course.id} {course.name}{" "}
            {includeCourseYear ? `(${course.year}年度)` : ""}
            {": "}
            {course.grade}
          </p>
        );
      })}
    </div>
  );
};
