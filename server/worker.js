import { Worker } from 'bullmq';



const worker = new Worker(
  'file-uploads-queue',
  async job => {
    
    console.log(`job:`,job.data);
    const data = JSON.stringify(job.data)
  },
  {  connection:{
    host:"localhost",
    port:"6379"
  } },
);