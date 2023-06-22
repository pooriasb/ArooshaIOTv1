const express = require('express');
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
const cron = require('node-cron');

app.use('/apiGateway', apiRouter);
app.use('/auth', authRouter);
app.use('/device', deviceRouter);
app.use('/energy', energyRouter);
app.use('/scheduler', schedulerRouter);
app.use('/scheduler', schedulerRouter);
app.use('/socket', socketRouter);
app.use('/mqtt', mqttRouter);


cron.schedule('*/10 * * * * *', async () => {
console.clear();
console.log(Date.now());

  pinger.pingRequest(config.ApiGatewayAddress + '/pinger').then((value) => {
    console.log('ApiGateway :' +value);
  });
  pinger.pingRequest(config.DeviceServiceAddress + '/pinger').then((value) => {
    console.log('DeviceService :' +value);
  });
  pinger.pingRequest(config.MQTTServiceAddress + '/pinger').then((value) => {
    console.log('MQTTService :' +value);
  });
  
  pinger.pingRequest(config.SocketAddress + '/pinger').then((value) => {
    console.log('Socket :' +value);
  });
  pinger.pingRequest(config.LogAddress + '/pinger').then((value) => {
    console.log('log :' +value);
  });
  pinger.pingRequest(config.EnergyAddress + '/pinger').then((value) => {
    console.log('Energy :' +value);
  });
  pinger.pingRequest(config.schedulerAddress + '/pinger').then((value) => {
    console.log('scheduler :' +value);
  });
  pinger.pingRequest(config.AuthAddress + '/pinger').then((value) => {
    console.log('Auth :' + value);
  });

}, { scheduled: true });


// run server
const { PORT = 3007 } = process.env;
app.listen(PORT, () => {
  console.log(`Health service is listening on port ${PORT}`);
});
