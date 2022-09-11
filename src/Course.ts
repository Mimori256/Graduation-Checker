class Course {
  id: string;
  name: string;
  unit: number;
  grade: string;
  constructor(id: string, name: string, unit: number, grade: string) {
    this.id = id;
    this.name = name;
    this.unit = unit;
    this.grade = grade;
  }
}

export default Course;
