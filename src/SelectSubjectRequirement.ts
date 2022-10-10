class SelectSubjectRequirement {
  constructor(
    public codes: string[],
    public minimum: number,
    public maximum: number,
    public isExcludeRequirement: boolean,
    public message: string,
    public group: number
  ) {}
}

export default SelectSubjectRequirement;
