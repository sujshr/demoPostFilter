import {
  disasterPostSchema,
  schemaDescription,
} from "../schemas/postSchema.js";
import { llm } from "../llm/GoogleGenerativeAI.js";

async function transformPost(rawPost) {
  try {
    const rawPostString = JSON.stringify(rawPost);

    console.log(rawPostString);
    const prompt = `
This is the disasterPostSchema:
${schemaDescription}
Please extract and format the following data according to the disasterPostSchema from this JSON object:
${rawPostString}
If the text relates to natural disaster events such as floods, earthquakes, cyclones, storms, etc., return a valid JSON string according to the disasterPostSchema. Ensure:
- Properties and values are in double quotes.
- Omit optional fields if they don't exist.
- Generate a suitable description if null.
- Assign appropriate values for non-optional fields.
- If coordinates are missing, provide them based on the location if available.
- If the post is not disaster-related, ignore it.
`;

    const response = await llm.invoke(prompt);

    const responseContent = response.content.trim();

    console.log(responseContent);
    const startIndex = responseContent.indexOf("{");
    const endIndex = responseContent.lastIndexOf("}");
    if (startIndex === -1 && endIndex === -1) {
      return null;
    }

    const jsonString = responseContent.substring(startIndex, endIndex + 1);

    console.log(jsonString);

    try {
      const disasterPostData = JSON.parse(jsonString);
      return disasterPostSchema.parse(disasterPostData);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  } catch (error) {
    console.error("Error transforming post:", error);
    return null;
  }
}

export async function filterData(rawPosts) {
  const filteredPosts = [];
  let c = 1;
  for (const post of rawPosts) {
    const transformedPost = await transformPost(post);
    console.log(c);
    c++;
    if (transformedPost) {
      filteredPosts.push(transformedPost);
    }
  }
  return filteredPosts;
}
