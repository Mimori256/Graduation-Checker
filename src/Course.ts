import { Grade } from "./data/grade";

class Course {
  constructor(
    public id: string,
    public name: string,
    public unit: number,
    public grade: Grade,
    public year: number
  ) {}
}

export default Course;
