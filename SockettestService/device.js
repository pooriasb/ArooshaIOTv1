const http = require('http');
const cluster = require('cluster');
const express = require('express');

const io = require('socket.io')(server);

const socket = io('http://localhost:3004', {
  extraHeaders: {
    tt: "MY MAC ADDRESS"
  }
});