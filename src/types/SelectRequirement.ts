export interface SelectRequirement {
  codes: string[];
  minimum: number;
  maximum: number;
  isExcludeRequirement: boolean;
  message: string;
  group: number;
}
