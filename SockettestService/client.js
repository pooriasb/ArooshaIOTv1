const io = require('socket.io-client');
var message =  {
  message: {
    hue: 'ACDSF256',
    rgbBrightness: Math.floor(Math.random() * 101),
    colorTemperature: Math.floor(Math.random() * 101),
    brightness: Math.floor(Math.random() * 101),
    dance: '0',
    isChanged: '1'
  },
  type: 'A'
}



// Connect to the server
// const socket = io('http://localhost:3004', {
//   extraHeaders: {
//     mac: "0253"
//   }
// });
const socket = io('http://154.211.2.176:3004', {
  extraHeaders: {
   // mac: "BK:85:P0:SA"
     //mac: "BK:85:P0:SB"
    //  mac: "BK:85:P0:SC"
     mac: "BK:85:P0:SD"
  }
});
// Listen for connection event
socket.on('connect', () => {
  console.log('Connected to server!');
});

// Listen for message event
socket.on('response', (data) => {
  //console.clear();
  console.log('Received message from server:', data);
  if(data && data.deviceCustomization && data.deviceCustomization.rgbBrightness){
  message.message.rgbBrightness = data.deviceCustomization.rgbBrightness || 0;
  message.message.colorTemperature = data.deviceCustomization.yellowWhiteTemp || 0;
  message.message.brightness = data.deviceCustomization.yellowWhiteBrightness || 0;
  message.message.dance = data.deviceCustomization.rgbDance || 0;
  sendAliveSignal();
  }
});
// socket.on('messageFromServer', (data) => {
//   console.log('Received message from server:', data);
// });

setInterval(sendAliveSignal,9000);



function sendAliveSignal() {
  socket.emit('request', message);
  console.log('Sent Alive message to server');
  console.log(message);
}
socket.on('reciveId', (data) => {
  showId(data);
});


function showId(data) {
  console.log('Received my id:', data);
}


//////////////////////
