// const io = require('socket.io-client');

// // Connect to the server
// const socket = io('http://localhost:3004', {
//   extraHeaders: {
//     tt: "MY MAC ADDRESS"
//   }
// });

// // Listen for connection event
// socket.on('connect', () => {
//   console.log('Connected to server!');
// });

// // Listen for message event
// socket.on('response', (data) => {
//   console.log('Received message from server:', data);
// });
// socket.on('messageFromServer', (data) => {
//   console.log('Received message from server:', data);
// });

// //socket.emit('request', {message:'hellow',type :'A'});
// socket.on('reciveId', (data) => {
//   showId(data);
// });


// function showId(data){
//   console.log('Received my id:', data);
// }


////////////////////////
// Import required libraries
const http = require('http');
const cluster = require('cluster');
const express = require('express');

const io = require('socket.io')(server);

// Check if current process is a master process or a worker process
if (cluster.isMaster) {
  // If master process, spawn worker processes based on available CPUs
  const numCPUs = require('os').cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Log which process is a worker process and which is a master process
  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online.`);
  });

  // If a worker process dies, log it and respawn a new worker process
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}. Respawning...`);
    cluster.fork();
  });

} else {
  // If worker process, create the server and start listening
  const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello world!\n');
  });
  
  const port = 3000;
  server.listen(port, () => {
    console.log(`Worker ${cluster.worker.id} listening on port ${port}`);
  });

  // Set up Socket.IO connection
  io.on('connection', (socket) => {
    console.log(`Worker ${cluster.worker.id}: Socket ${socket.id} connected.`);
    socket.emit('message', `Hello from socket ${socket.id}`);
  });
}
