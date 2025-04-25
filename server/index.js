import express from "express";
import cors from "cors";
import multer from "multer";
import { Queue } from "bullmq";

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { QdrantVectorStore } from "@langchain/qdrant";

const queue = new Queue("file-uploads-queue", {
  connection: {
    host: "localhost",
    port: "6379",
  },
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  return res.json({ status: "All Good" });
});

app.post("/upload/pdf", upload.single("pdf"), async (req, res) => {
  await queue.add(
    "file-ready",
    JSON.stringify({
      filename: req.file.originalname,
      destination: req.file.destination,
      path: req.file.path,
    })
  );
  return res.json({ message: "uploaded" });
});

app.get("/chat", async (req, res) => {
  const userQuery = "What is the app name";
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "embedding-001",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    title: "Document title",
    apiKey: "AIzaSyDVzyIj75hjqcx5u0TYTsAuivXL1ma8cRw",
  });
  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: "http://localhost:6333",
      collectionName: "langchainjs-testing",
    }
  );
  const retriever = vectorStore.asRetriever({
    k: 2,
  });

  const result = await retriever.invoke(userQuery);

  const SYSTEM_PROMPT=`You are a helpful ai assistant who answered the user query based on the available context from pdf file. Context: ${JSON.stringify(result)}`

  return res.json({ result });
});

app.listen(8000, () => console.log(`server started on port : ${8000}`));
