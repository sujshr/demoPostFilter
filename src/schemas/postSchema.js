import { z } from "zod";

const coordinatesSchema = z
  .object({
    latitude: z.number().optional().nullable(),
    longitude: z.number().optional().nullable(),
  })
  .optional()
  .nullable();

const mediaAttachmentSchema = z
  .object({
    type: z.string().optional().nullable(),
    url: z.string().url().optional().nullable(),
  })
  .optional()
  .nullable();

const disasterPostSchema = z.object({
  type: z.string().optional().nullable(),
  location: z
    .object({
      city: z.string().optional().nullable(),
      state: z.string().optional().nullable(),
      country: z.string().optional().nullable(),
      coordinates: coordinatesSchema,
    })
    .optional()
    .nullable(),
  timestamp: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  criticality: z
    .object({
      magnitude: z.number().optional().nullable(),
      severity: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  media: z
    .object({
      percentage: z.number().optional().nullable(),
      attachments: z.array(mediaAttachmentSchema).optional().nullable(),
    })
    .optional()
    .nullable(),
  status: z
    .object({
      reviewedByNDRF: z.boolean().optional().nullable(),
      reviewDate: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
});

const schemaDescription = `
{
  type: string,
  location: {
    city: string,
    state: string,
    country: string,
    coordinates: {
      latitude: number,
      longitude: number
    }
  } ,
  timestamp: string,
  description: string | null (optional),
  criticality: {
    magnitude: number | null (optional),
    severity: string | null (optional)
  } (optional),
  media: {
    percentage: number | null (optional),
    attachments: [
      {
        type: string | null (optional),
        url: string | null (optional)
      }
    ] (optional)
  } (optional),
  status: {
    reviewedByNDRF: boolean | null (optional),
    reviewDate: string | null (optional)
  } (optional)
}
`;

export { disasterPostSchema, schemaDescription };
