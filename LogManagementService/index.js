const express = require('express');
const app = express();
const server = require('http').Server(app);









const { PORT = 3004 } = process.env;
server.listen(PORT, () => {
  console.log(`SocketService is listening on port ${PORT}`);
});
