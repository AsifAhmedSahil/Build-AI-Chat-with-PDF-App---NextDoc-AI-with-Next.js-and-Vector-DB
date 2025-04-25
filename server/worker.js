import { Worker } from 'bullmq';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { QdrantClient } from "@qdrant/js-client-rest";



const worker = new Worker(
  'file-uploads-queue',
  async job => {
    
    console.log(`job:`,job.data);
    const data = JSON.parse(job.data)
   

    // load the pdf:
    const loader = new PDFLoader(data.path);
    const docs = await loader.load(); 
    // console.log("DOCS:",docs)

    const client = new QdrantClient({ url: `http://localhost:6333` });

    const embeddings = new GoogleGenerativeAIEmbeddings({
        model: "embedding-001",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
        apiKey: "AIzaSyDVzyIj75hjqcx5u0TYTsAuivXL1ma8cRw"
      });

      const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: "http://localhost:6333",
        collectionName: "langchainjs-testing",
      });

      await vectorStore.addDocuments(docs)
     
      

  },
  {  connection:{
    host:"localhost",
    port:"6379"
  } },
);