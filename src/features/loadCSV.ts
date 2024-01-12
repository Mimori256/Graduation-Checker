import { Course, Grade } from "../types/Course";

export const loadCSV = async (csvFile: Blob): Promise<Course[]> => {
  const csv = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(csvFile);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

  const cleanedCsv = csv.replaceAll('"', "");
  const splited = cleanedCsv.split("\n");
  return splited
    .filter((_splitCourse, i) => _splitCourse && i !== 0)
    .map((_splitCourse) => {
      const splitCourse: string[] = _splitCourse.split(",");
      const [id, name, unit, grade, year] = [
        splitCourse[2],
        splitCourse[3],
        parseFloat(splitCourse[4].replace(" ", "")),
        splitCourse[7] as Grade,
        Number(splitCourse[9]),
      ];
      return { id, name, unit, grade, year };
    });
};
