import { z } from "zod";

export const UserStory = z.object({
  as_a: z.string().min(1),
  i_want: z.string().min(1),
  so_that: z.string().min(1),
  notes: z.string().optional(),
});

export const EpicJSON = z.object({
  title: z.string().min(1),
  background: z.string().min(1),
  appendix: z.object({ useful_links: z.array(z.string()) }),
  user_stories: z.array(UserStory).min(1),
  goals: z.array(z.string()).min(1),
  design: z.object({ summary: z.string(), figma_links: z.array(z.string()) }),
  affected_entities: z.object({
    organizations: z.array(z.string()),
    environments: z.array(z.string()),
    systems: z.array(z.string()),
  }),
  acceptance_criteria: z.array(z.string()).min(1),
});

export type EpicJSONType = z.infer<typeof EpicJSON>;
