class CourseGroup {
  id: number;
  minUnit: number;
  maxUnit: number;
  name: string;
  constructor(id: number, minUnit: number, maxUnit: number, name: string) {
    this.id = id;
    this.minUnit = minUnit;
    this.maxUnit = maxUnit;
    this.name = name;
  }
}

export default CourseGroup;
