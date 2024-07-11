// socketServer.js
const http = require('http');
const socketIo = require('socket.io');
const {userSocketMap} = require('./userSocketMap');
const app = require('./app'); // Import the Express app

const server = http.createServer(app);

const io = socketIo(server);

io.on('connection', socket => {
  console.log('A user is connected', socket.id);

  const userId = socket.handshake.query.userId;

  console.log('UserId', userId);

  if (userId !== 'undefined') {
    userSocketMap[userId] = socket.id;
  }

  console.log('User socket data', userSocketMap);

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
    delete userSocketMap[userId];
  });

  socket.on('sendMessage', ({senderId, receiverId, message}) => {
    const receiverSocketId = userSocketMap[receiverId];

    console.log('Receiver Id', receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', {
        senderId,
        message,
      });
    }
  });
});

server.listen(3200, () => {
  console.log('Socket.IO running on port 3200');
});

module.exports = {io};
