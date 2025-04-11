import { Message } from '../models/Message.js';
import { messageQueue } from '../queues/messageQueue.js';

export function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('Client connected', socket.io);

    // Optional: Fetch last 10 messages and send to newly connected user
    Message.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .exec()
      .then((messages) => {
        socket.emit('previous-messages', messages.reverse());
      });

    socket.on('message', async (data) => {
      const { username, message } = data;

      await messageQueue.add('save-message', {
        username,
        message,
        socketId: socket.id,
      });

      // io.emit('message', newMsg);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
}
