import { clientDb } from "../connection/dbConnection.js";
import { embeddings } from "../llm/Embeddings.js";
import { vectorStore } from "../llm/MongoDbVectoreStore.js";

let io;

const setIO = (socketIO) => {
  io = socketIO;
};

async function updateDatabase(filteredPosts) {
  const db = clientDb.db();
  const collection = db.collection("disasterPosts");

  try {
    for (const post of filteredPosts) {
      try {
        const { city, state, country } = post.location || {};
        const locationString = [city, state, country]
          .filter(Boolean)
          .join(", ");
        console.log(post.description);

        const combinedText = `${locationString} ${post.description}`;

        const postEmbedding = await embeddings.embedDocuments([combinedText]);

        const searchResults = await vectorStore.similaritySearchWithScore(
          combinedText,
          1
        );
        console.log("Search results:", searchResults);

        const similarityThreshold = 0.8;
        const similarDocument = searchResults.find(
          (result) => result[1] > similarityThreshold
        );

        if (similarDocument && similarDocument[0]?.metadata?._id) {
          const documentId = similarDocument[0].metadata._id;
          console.log(`Found similar document with ID: ${documentId} \n`);
          console.log(similarDocument);

          const query = { _id: documentId };
          const update = {
            $inc: { numberOfPosts: 1 },
            $set: { embedding: postEmbedding },
          };

          await collection.updateOne(query, update);
          console.log(
            `Incremented numberOfPosts for post ID: ${documentId} \n`
          );
        } else {
          console.log("No similar document found, inserting a new post. \n");
          const newPost = {
            ...post,
            embedding: postEmbedding,
            numberOfPosts: 1,
          };

          await collection.insertOne(newPost);
          console.log(`Inserted new post with ID: ${post.id}`);

          if (io) {
            const { embedding, ...postWithoutEmbedding } = newPost;
            io.emit("newEntry", postWithoutEmbedding);
            console.log(
              "Emitted 'newEntry' event with new post excluding embedding. \n"
            );
          }
        }
      } catch (err) {
        console.error("Error processing post:", post, err);
      }
    }

    console.log(
      "Database updated with filtered disaster posts and embeddings. \n"
    );
  } catch (error) {
    console.error("Error updating database:", error);
  }
}

export { updateDatabase, setIO };
