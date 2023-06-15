const express= require('express');
const app = express();
const apiRouter = require('./routes/apiGateway');
const authRouter = require('./routes/auth');
const deviceRouter = require('./routes/device');
const energyRouter = require('./routes/energy');
const mqttRouter = require('./routes/mqtt');
const schedulerRouter = require('./routes/scheduler');
const socketRouter = require('./routes/socket');
const pinger = require('./routes/pinger');
const config = require('config');

app.use('/apiGateway',apiRouter);
app.use('/auth',authRouter);
app.use('/device',deviceRouter);
app.use('/energy',energyRouter);
app.use('/scheduler',schedulerRouter);
app.use('/scheduler',schedulerRouter);
app.use('/socket',socketRouter);
app.use('/mqtt',mqttRouter);




pinger.pingRequest('http://localhost:3000/pinger').then((value)=>{
console.log(value);
});



// run server
const { PORT = 3007 } = process.env;
app.listen(PORT, () => {
  console.log(`Health service is listening on port ${PORT}`);
});
