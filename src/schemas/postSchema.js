import { z } from "zod";

const disasterPostSchema = z.object({
  id: z.string(),
  type: z.string(),
  location: z.object({
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string(),
  }),
  date: z.string(),
  description: z.string().optional(),
});

const schemaDescription = `
{
  id: string,
  type: string,
  location: {
    city: string (optional),
    state: string (optional),
    country: string
  },
  date: string,
  description: string (optional),
}
`;

export { disasterPostSchema, schemaDescription };
