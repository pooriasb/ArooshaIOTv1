const io = require('socket.io-client');

// Connect to the server
const socket = io('http://localhost:3004');

// Listen for connection event
socket.on('connect', () => {
  console.log('Connected to server!');
});

// Listen for message event
socket.on('message', (data) => {
  console.log('Received message from server:', data);
});

// Emit a message to the server

socket.emit('new message', 'Hello server!');