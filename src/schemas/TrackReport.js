import { z } from 'zod';

// Define the Zod schema for QuickReport
const quickReportSchema = z.object({
  disasterId: z.string().optional(), // Assuming disasterId is a UUID, or use z.string().nonempty() if it’s a simple string
  status: z.string().min(1, "Status is required"), // Ensures status is non-empty
  comments: z.string().optional(), // Comments are optional
  teamMessage: z.string().optional(), // Team message is optional
  createdAt: z.date().default(() => new Date()), // Default to current date
});



export { quickReportSchema };
