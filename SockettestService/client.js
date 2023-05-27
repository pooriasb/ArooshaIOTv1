const io = require('socket.io-client');

// Connect to the server
const socket = io('http://localhost:3004');

// Listen for connection event
socket.on('connect', () => {
  console.log('Connected to server!');
});

// Listen for message event
socket.on('response', (data) => {
  console.log('Received message from server:', data);
});
socket.on('messageFromServer', (data) => {
  console.log('Received message from server:', data);
});

socket.emit('request', {message:'hellow',type :'A'});
socket.on('reciveId', (data) => {
  showId(data);
});


function showId(data){
  console.log('Received my id:', data);
}