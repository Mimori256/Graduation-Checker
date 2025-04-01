export type SelectItem = [string[], number, number, boolean, string, number];

export type Requirement = {
  [key: string]: {
    header: {
      department: string;
      major: string;
      enrollYear: number | string;
    };
    courses: {
      compulsory: string[];
      compulsorySumUnit: number;
      select: SelectItem[];
      selectMinimumUnit: number;
      groups: [number, number, number, string][];
    };
  };
};
