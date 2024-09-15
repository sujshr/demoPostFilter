import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { disasterPostSchema } from "./postSchema.js";

export const parser = StructuredOutputParser.fromZodSchema(disasterPostSchema);
