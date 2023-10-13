import { z } from "zod";

const gradRequirement = z.object({
  header: z.object({
    department: z.string(),
    major: z.string(),
    enrollYear: z.number(),
  }),
  courses: z.object({
    compulsory: z.array(z.string()),
    compulsorySumUnit: z.number(),
    select: z.array(
      z.tuple([
        z.array(z.string()),
        z.number(),
        z.number(),
        z.boolean(),
        z.string(),
        z.number(),
      ])
    ),
    selectMinimumUnit: z.number(),
    groups: z.array(z.tuple([z.number(), z.number(), z.number(), z.string()])),
  }),
});

type GradRequirement = z.infer<typeof gradRequirement>;

export { gradRequirement, type GradRequirement };
