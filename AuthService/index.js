

const express = require('express');
const app = express();
const server = require('http').Server(app);
const authRouter = require('./routes/auth');
app.use('/api/auth',authRouter);





const { PORT = 3009 } = process.env;
server.listen(PORT, () => {
  console.log(`Auth Service is listening on port ${PORT}`);
});





