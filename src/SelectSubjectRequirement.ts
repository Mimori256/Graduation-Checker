class SelectSubjectRequirement {
  codes: string[];
  minimum: number;
  maximum: number;
  isExcludeRequirement: boolean;
  message: string;
  constructor(
    codes: string[],
    minimum: number,
    maximum: number,
    isExcludeRequirement: boolean,
    message: string
  ) {
    this.codes = codes;
    this.minimum = minimum;
    this.maximum = maximum;
    this.isExcludeRequirement = isExcludeRequirement;
    this.message = message;
  }
}

export default SelectSubjectRequirement;
