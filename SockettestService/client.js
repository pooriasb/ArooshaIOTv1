const io = require('socket.io-client');

// Connect to the server
const socket = io('http://localhost:3004', {
  extraHeaders: {
    mac: "MY MAC ADDRESS"
  }
});

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

setInterval(sendAliveSignal,5000);



function sendAliveSignal(){
  socket.emit('request', {message :{ hue :'ACDSF256',
  RGBBrightnes :Math.floor(Math.random() * 101),
  ColorTemperature :Math.floor(Math.random() * 101),
  Brightness :Math.floor(Math.random() * 101),
  Dance : '0',
  isChanged : '1'},
  type :'A'
});
}
socket.on('reciveId', (data) => {
  showId(data);
});


function showId(data){
  console.log('Received my id:', data);
}


//////////////////////
