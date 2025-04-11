import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';

import { setupSocket } from './socket/index.js';

import './workers/messageWorker.js';

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

export const io = new Server(server, {
  cors: {
    origin: '*', // For now, allow all origins (can restrict later)
  },
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// Socket.IO connection
setupSocket(io);

// Test route
app.get('/', (req, res) => {
  res.send('🎉 Realtime backend is working!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
