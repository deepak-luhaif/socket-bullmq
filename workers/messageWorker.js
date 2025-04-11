import { Worker } from 'bullmq';
import { redis } from '../lib/redis.js';
import { Message } from '../models/Message.js';

import { io } from '../index.js';

const worker = new Worker(
  'messages',
  async (job) => {
    const { username, message, socketId } = job.data;

    const newMsg = new Message({ username, message });
    await newMsg.save();

    io.emit('message', newMsg);
  },
  {
    connection: redis,
  }
);

worker.on('completed', (job) => {
  console.log('Job completed', job.id);
});

worker.on('failed', (job, err) => {
  console.log('Job failed', job.id, err);
});
