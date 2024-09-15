import {
  disasterPostSchema,
  schemaDescription,
} from "../schemas/postSchema.js";
import { llm } from "../llm/GoogleGenerativeAI.js";

async function transformPost(rawPost) {
  try {
    const rawPostString = JSON.stringify(rawPost);

    console.log(rawPost);
    const prompt = `
    This is the disasterPostSchema:
    ${schemaDescription}
    Please extract and format the following data according to the disasterPostSchema from this JSON object:
    ${rawPostString}
    If the post is related to disasters and natural disasters events such as earthquakes, floods, and such then make sure that you return a valid JSON string where the properties and values are enclosed in double quotes and can be passed into JSON.parse() method without errors and strictly adhere to the zod schema provided in the disasterPostSchema. Also, don't assign null as values for any of the fields that are optional if it doesn't exist. Simply omit them. For values that aren't optional, include appropriate value according to schema. If the description is null, generate a suitable one and assign it to the field. If the post is not related to disasters, ignore them.
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

import { clientDb } from "../connection/dbConnection.js";
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
//   let filteredPosts = [];
//   try {
//     const db = clientDb.db();

//     const collection = db.collection("filteredPosts");

//     filteredPosts = await collection.find({}).toArray();

//     console.log("Fetched posts from filteredPosts collection");
//   } catch (error) {
//     console.error("Error fetching data from MongoDB:", error);
//   }

  return filteredPosts;
}
