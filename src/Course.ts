import { Grade } from "./data/grade";

class Course {
  id: string;
  name: string;
  unit: number;
  grade: Grade;
  year: number;
  constructor(
    id: string,
    name: string,
    unit: number,
    grade: Grade,
    year: number
  ) {
    this.id = id;
    this.name = name;
    this.unit = unit;
    this.grade = grade;
    this.year = year;
  }
}

export default Course;
