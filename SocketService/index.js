const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });
const helper = require('./models/helper');
const cors = require('cors');

// CORS configuration
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST']
};
app.use(cors(corsOptions));


// Listen for new client connections
io.on('connection', (socket) => {

  console.log('New client: ' + socket.id);

  socket.on('request', handleRequest);
  socket.on('requestToSingle', handleSingleRequest);
  socket.on('sendToRoom', handelRoomRequest);
  socket.on('getMySocketId', sendSocketId);
  socket.on('disconnect', handleDisconnect);

  function handleRequest(data) {
    console.log('Client Say: ' + data.message);
    switch (data.type) {
      case "A": // Alive signal
        console.log('alive signal : '+data.message);
        io.emit('response', '200');

        break;
        
      case "S":
     var message=  helper.createScheduleMessage(data.message);
     sendScheduleToClient(message.room,message.mac,message.eventId);
        break;
        
      default:
        console.log("Sorry, I didn't understand that.");
    }
 
  }




function sendScheduleToClient(room,mac,deviceId){
  socket.join(room);
  var message = {mac,deviceId};
  io.to('room').emit('response', message); // Send event to all sockets in 'room1'
console.log('message '+message+' sent from socket to all client in room :'+room);
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






const port = process.env.PORT || 3004;
server.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
