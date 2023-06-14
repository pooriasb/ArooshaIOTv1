const express = require('express');
const app = express();
const server = require('http').Server(app);
const messageLogRouter = require('./routes/messageLogRouter');

app.use('/api/log/',messageLogRouter);






const { PORT = 3004 } = process.env;
server.listen(PORT, () => {
  console.log(`SocketService is listening on port ${PORT}`);
});
