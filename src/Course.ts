class Course {
  id: string;
  name: string;
  unit: number;
  grade: string;
  year: number;
  constructor(
    id: string,
    name: string,
    unit: number,
    grade: string,
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
