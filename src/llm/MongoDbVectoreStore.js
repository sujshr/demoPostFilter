import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { embeddings } from "./Embeddings.js";
import { clientDb } from "../connection/dbConnection.js";

const dbConfig = {
  collection: clientDb.db().collection("disasterPosts"),
  indexName: "vector_index",
  textKey: "embedding_text",
  embeddingKey: "embedding",
};

export const vectorStore = new MongoDBAtlasVectorSearch(embeddings, dbConfig);
