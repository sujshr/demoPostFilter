import { clientDb } from "../connection/dbConnection.js";
import { embeddings } from "../llm/Embeddings.js";
import { vectorStore } from "../llm/MongoDbVectoreStore.js";

async function updateDatabase(filteredPosts) {
  const db = clientDb.db();
  const collection = db.collection("disasterPosts");

  try {
    for (const post of filteredPosts) {
      try {
        const postEmbedding = await embeddings.embedDocuments([
          post.description,
        ]);

        const searchResults = await vectorStore.similaritySearchWithScore(
          post.description,
          1
        );

        console.log(searchResults);

        const similarityThreshold = 0.8;

        const similarDocument = searchResults.find(
          (result) => result[1] > similarityThreshold
        );

        if (similarDocument && similarDocument[0]?.metadata?.id) {
          const documentId = similarDocument[0].metadata.id;
          console.log(`Found similar document with ID: ${documentId}`);

          const query = { id: documentId };
          const update = {
            $inc: { numberOfPosts: 1 },
            $set: { embedding: postEmbedding },
          };

          await collection.updateOne(query, update);
          console.log(`Incremented numberOfPosts for post ID: ${documentId}`);
        } else {
          console.log("No similar document found, inserting a new post.");
          const newPost = {
            ...post,
            embedding: postEmbedding,
            numberOfPosts: 1,
          };
          await collection.insertOne(newPost);
          console.log(`Inserted new post with ID: ${post.id}`);
        }
      } catch (err) {
        console.error("Error processing post:", post, err);
      }
    }

    console.log(
      "Database updated with filtered disaster posts and embeddings."
    );
  } catch (error) {
    console.error("Error updating database:", error);
  }
}

export { updateDatabase };
