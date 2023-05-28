var express = require('express');
var app = express();

var server = require('http').Server(app);


var io = require('socket.io')(server);
var users = {};

io.use(async (socket, next) => {
    try {
      const user = await fetchUser(socket);
      socket.user = user;
    } catch (e) {
      next(new Error("unknown user"));
    }
  });
server.listen(999, function(){
  console.log('listening on *:999');
});

io.sockets.on('connection', function(socket){
    console.log("User Connected");
    console.log(socket.user);
    socket.on('user_msg', function(data,callback){
        io.emit('new_message', data);
        callback("Data Received");
    });

    socket.on('disconnect', function(data){
        console.log('User disconnected');
    });
});