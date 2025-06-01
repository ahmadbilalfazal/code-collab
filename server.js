const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const documents = {};

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', (documentId) => {
    socket.join(documentId);
    if (!documents[documentId]) {
      documents[documentId] = { content: '' };
    }
    socket.emit('load', documents[documentId].content);
  });

  socket.on('change', (delta, documentId) => {
    documents[documentId].content = delta;
    socket.to(documentId).emit('change', delta);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = 4000;
const HOST = '0.0.0.0';
server.listen(PORT, HOST, () => { 
  console.log(`Server running on http://${HOST}:${PORT}`);
});