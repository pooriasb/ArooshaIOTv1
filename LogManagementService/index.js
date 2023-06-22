const express = require('express');
const app = express();
const server = require('http').Server(app);
const messageLogRouter = require('./routes/messageLogRouter');

app.use('/api/log/',messageLogRouter);






const { PORT = 3008 } = process.env;
app.get('/pinger',(req,res)=>{res.send(`Log is ok `)});

server.listen(PORT, () => {
  console.log(`Log Service is listening on port ${PORT}`);
});
