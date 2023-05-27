var express = require('express');
var app = express();

// *** FOR HTTPS CONNECTION *** //
// const fs = require('fs');

// var options = {
//   key: fs.readFileSync('./key.pem'),
//   cert: fs.readFileSync('./cert.pem'),
//   passphrase: "password of cert/key file"
// };

// var server = require('https').createServer(options, app);
// *** FOR HTTPS CONNECTION *** //


// *** FOR HTTP CONNECTION *** //
var server = require('http').Server(app);
// *** FOR HTTP CONNECTION *** //

var io = require('socket.io')(server);
var users = {};


server.listen(999, function(){
  console.log('listening on *:999');
});

io.sockets.on('connection', function(socket){
    console.log("User Connected");

    socket.on('user_msg', function(data,callback){
        io.emit('new_message', data);
        callback("Data Received");
    });

    socket.on('disconnect', function(data){
        console.log('User disconnected');
    });
});