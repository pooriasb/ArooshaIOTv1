const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });
const helper = require('./models/helper');
const axios = require('axios');
const apiGatewayRouter = require('./routes/gateway');

app.use('/api', apiGatewayRouter);
const cors = require('cors');
const { config } = require('process');
// CORS configuration
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST']
};
app.use(cors(corsOptions));




io.use((socket, next) => {
  const macValue = socket.handshake.headers['mac'];
  socket.id = macValue
  next();
});

// Listen for new client connections
io.on('connection', (socket) => {
  console.log('New client: ' + socket.id);

  // const ttValue = socket.handshake.headers['tt'];
  // console.log(`Value of tt: ${ttValue}`);


  socket.on('request', handleRequest);
  socket.on('requestToSingle', handleSingleRequest);
  socket.on('sendToRoom', handelRoomRequest);
  socket.on('getMySocketId', sendSocketId);
  socket.on('disconnect', handleDisconnect);




  function handleRequest(data) {

    switch (data.type) {
      case "A": // Alive signal
        processAliveSignal(socket.id, data.message);
        io.emit('response', '200');
        break;
      case "S":
        var message = helper.createScheduleMessage(data.message);
        sendScheduleToClient(message.room, message.mac, message.eventId);
        break;
      default:
        console.log("Sorry, I didn't understand that.");
    }
  }
  function sendScheduleToClient(room, mac, deviceId) {
    // Join the specified room
    socket.join(room);

    // Use destructuring assignment to create the message object
    const message = { mac, deviceId };

    // Emit the "response" event to all sockets in the specified room
    io.to(room).emit('response', message);

    // Log the message and room name to the console
    console.log(`Message ${JSON.stringify(message)} sent from socket to all clients in room: ${room}`);
  }
  function handleSingleRequest(data) {
    console.log('Client Say: ' + JSON.stringify(data));
    io.to(socket.id).emit('response', 'Welcome!');
  }

  function handelRoomRequest(data) {
    console.log('Client Say: ' + JSON.stringify(data));
    socket.join(data.room);
    io.to(data.room).emit('response', data.message);

  }
  function sendSocketId(data) {
    io.emit('reciveId', socket.id);
  }

  function handleDisconnect() {
    console.log('Client disconnected.');
  }
});

app.post('/sendMessage',async (req, res) => {
  try {
    io.to(req.mac).emit('response', req.message);
   var response =  await axios.post(config.LogAddress + '/api/log/logMessage',{mac: req.mac , message:req.message });
 console.log('log service respons: '+response.data);
   res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});


// function processAliveSignal(mac, message) {

//   const parsedData = message;
//   var mac = mac;
//   var userId = 'Sajad';
//   var hue = message.hue;
//   var rgbBrightness = message.RGBBrightnes;
//   var colorTemperature = message.ColorTemperature
//   var brightness = message.Brightness;
//   var dance = message.Dance;
//   helper.sendAliveSignalToinfluxService({ userId, mac, hue, rgbBrightness, colorTemperature, brightness, dance });
// }

function processAliveSignal(macAddress, data) {
  const { hue, rgbBrightness, colorTemperature, brightness, dance } = data;
  const userId = 'Sajad';
  const mac = macAddress;
 helper.sendAliveSignalToInfluxService({ userId, mac, hue,rgbBrightness, colorTemperature, brightness, dance });
}




const { PORT = 3004 } = process.env;
server.listen(PORT, () => {
  console.log(`SocketService is listening on port ${PORT}`);
});
