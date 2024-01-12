export interface KdbCourse {
  id: string;
  name: string;
  credits: string;
  registerYear: string;
  modules: string;
  period: string;
}

// KdbData: the data structure of the kdb.json file
export interface KdbData {
  courses: KdbCourse[];
}
