class SelectSubjectRequirement {
  constructor(
    public codes: string[],
    public minimum: number,
    public maximum: number,
    public isExcludeRequirement: boolean,
    public message: string,
    public group: 0 | 1 | 2 | 3
  ) {}
}

export default SelectSubjectRequirement;
