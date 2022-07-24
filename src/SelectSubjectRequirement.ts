class SelectSubjectRequirement {
  codes: string[];
  minimum: number;
  maximum: number;
  isExcludeRequirement: boolean;
  message: string;
  group: number;
  constructor(
    codes: string[],
    minimum: number,
    maximum: number,
    isExcludeRequirement: boolean,
    message: string,
    group: number
  ) {
    this.codes = codes;
    this.minimum = minimum;
    this.maximum = maximum;
    this.isExcludeRequirement = isExcludeRequirement;
    this.message = message;
    this.group = group;
  }
}

export default SelectSubjectRequirement;
