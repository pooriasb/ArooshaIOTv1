// server.js

const express = require('express');
const socketIO = require('socket.io');

const app = express();
const server = app.listen(3004, () => {
  console.log('Server listening on port 3000.');
});

// Set up socket.io
const io = socketIO(server);

// Listen for new client connections
io.on('connection', (socket) => {
  console.log('New client connected.');

  // Listen for messages from this client
  socket.on('new message', (message) => {
    console.log(`Client says: ${message}`);

    // Broadcast the message to all connected clients
    io.emit('message', 'hello from server');
  });

  // Listen for client disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected.');
  });
});
