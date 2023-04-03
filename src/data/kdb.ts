import { z } from "zod";

const kdb = z.object({
  courses: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      credits: z.string(),
      modules: z.string(),
      period: z.string(),
    })
  ),
});

type Kdb = z.infer<typeof kdb>;

export { kdb, type Kdb };
