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
const fs = require('fs');

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

    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    const fileName = `./logs/APIlog.txt`;

    let lastStatus;
    try {
      const lastLogEntry = fs.readFileSync(fileName, 'utf8')
        .split('\n')
        .filter(Boolean)
        .pop();
      lastStatus = lastLogEntry.split('Status:')[1].split(' ')[0];
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`File "${fileName}" does not exist, creating it...`);
        fs.writeFileSync(fileName, '');
        lastStatus = null;
      } else {
        console.error('Error while reading the log file:', error);
        lastStatus = null;
      }
    }



    if (lastStatus === undefined || value.status.toString() !== lastStatus) {
      const logEntry = `${formattedDate} - Status:${value.status} Data:${value.data}\n`;
      fs.appendFileSync(fileName, logEntry);
      console.log(`API Log created: ${logEntry}`);
    } else {
      console.log('API No change in status, not logging.')
    }
  });
  pinger.pingRequest(config.DeviceServiceAddress + '/pinger').then((value) => {
    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
  
    const formattedDate = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    const fileName = `./logs/Devicelog.txt`;
  
    let lastStatus;
    try {
      const lastLogEntry = fs.readFileSync(fileName, 'utf8')
        .split('\n')
        .filter(Boolean)
        .pop();
      lastStatus = lastLogEntry.split('Status:')[1].split(' ')[0];
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`File "${fileName}" does not exist, creating it...`);
        fs.writeFileSync(fileName, '');
        lastStatus = null;
      } else {
        console.error('Error while reading the log file:', error);
        lastStatus = null;
      }
    }
  
  
  
    if (lastStatus === undefined || value.status.toString() !== lastStatus) {
      const logEntry = `${formattedDate} - Status:${value.status} Data:${value.data}\n`;
      fs.appendFileSync(fileName, logEntry);
      console.log(`Device Log created: ${logEntry}`);
    } else {
      console.log('Device No change in status, not logging.')
    }
  });
  pinger.pingRequest(config.MQTTServiceAddress + '/pinger').then((value) => {
    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    const fileName = `./logs/MQTTlog.txt`;

    let lastStatus;
    try {
      const lastLogEntry = fs.readFileSync(fileName, 'utf8')
        .split('\n')
        .filter(Boolean)
        .pop();
      lastStatus = lastLogEntry.split('Status:')[1].split(' ')[0];
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`File "${fileName}" does not exist, creating it...`);
        fs.writeFileSync(fileName, '');
        lastStatus = null;
      } else {
        console.error('Error while reading the log file:', error);
        lastStatus = null;
      }
    }



    if (lastStatus === undefined || value.status.toString() !== lastStatus) {
      const logEntry = `${formattedDate} - Status:${value.status} Data:${value.data}\n`;
      fs.appendFileSync(fileName, logEntry);
      console.log(`MQTT Log created: ${logEntry}`);
    } else {
      const logEntry = `${formattedDate} - Status:${value.status} Data:${value.data}\n`;

      console.log('MQTT not logging.' +logEntry );
    }

  });
  pinger.pingRequest(config.SocketAddress + '/pinger').then((value) => {
    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    const fileName = `./logs/SOCKETlog.txt`;

    let lastStatus;
    try {
      const lastLogEntry = fs.readFileSync(fileName, 'utf8')
        .split('\n')
        .filter(Boolean)
        .pop();
      lastStatus = lastLogEntry.split('Status:')[1].split(' ')[0];
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`File "${fileName}" does not exist, creating it...`);
        fs.writeFileSync(fileName, '');
        lastStatus = null;
      } else {
        console.error('Error while reading the log file:', error);
        lastStatus = null;
      }
    }



    if (lastStatus === undefined || value.status.toString() !== lastStatus) {
      const logEntry = `${formattedDate} - Status:${value.status} Data:${value.data}\n`;
      fs.appendFileSync(fileName, logEntry);
      console.log(`socket Log created: ${logEntry}`);
    } else {
      console.log('socket No change in status, not logging.')
    }

  });
  pinger.pingRequest(config.LogAddress + '/pinger').then((value) => {
    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    const fileName = `./logs/LogServicelog.txt`;

    let lastStatus;
    try {
      const lastLogEntry = fs.readFileSync(fileName, 'utf8')
        .split('\n')
        .filter(Boolean)
        .pop();
      lastStatus = lastLogEntry.split('Status:')[1].split(' ')[0];
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`File "${fileName}" does not exist, creating it...`);
        fs.writeFileSync(fileName, '');
        lastStatus = null;
      } else {
        console.error('Error while reading the log file:', error);
        lastStatus = null;
      }
    }



    if (lastStatus === undefined || value.status.toString() !== lastStatus) {
      const logEntry = `${formattedDate} - Status:${value.status} Data:${value.data}\n`;
      fs.appendFileSync(fileName, logEntry);
      console.log(`LOG Log created: ${logEntry}`);
    } else {
      console.log('LOG No change in status, not logging.')
    }
  });
  pinger.pingRequest(config.EnergyAddress + '/pinger').then((value) => {
    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    const fileName = `./logs/Energylog.txt`;

    let lastStatus;
    try {
      const lastLogEntry = fs.readFileSync(fileName, 'utf8')
        .split('\n')
        .filter(Boolean)
        .pop();
      lastStatus = lastLogEntry.split('Status:')[1].split(' ')[0];
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`File "${fileName}" does not exist, creating it...`);
        fs.writeFileSync(fileName, '');
        lastStatus = null;
      } else {
        console.error('Error while reading the log file:', error);
        lastStatus = null;
      }
    }



    if (lastStatus === undefined || value.status.toString() !== lastStatus) {
      const logEntry = `${formattedDate} - Status:${value.status} Data:${value.data}\n`;
      fs.appendFileSync(fileName, logEntry);
      console.log(`Energy Log created: ${logEntry}`);
    } else {
      console.log('Energy No change in status, not logging.')
    }
  });
  pinger.pingRequest(config.schedulerAddress + '/pinger').then((value) => {
    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    const fileName = `./logs/SCHEDULERlog.txt`;

    let lastStatus;
    try {
      const lastLogEntry = fs.readFileSync(fileName, 'utf8')
        .split('\n')
        .filter(Boolean)
        .pop();
      lastStatus = lastLogEntry.split('Status:')[1].split(' ')[0];
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`File "${fileName}" does not exist, creating it...`);
        fs.writeFileSync(fileName, '');
        lastStatus = null;
      } else {
        console.error('Error while reading the log file:', error);
        lastStatus = null;
      }
    }



    if (lastStatus === undefined || value.status.toString() !== lastStatus) {
      const logEntry = `${formattedDate} - Status:${value.status} Data:${value.data}\n`;
      fs.appendFileSync(fileName, logEntry);
      console.log(`Scheduler Log created: ${logEntry}`);
    } else {
      console.log('Scheduler No change in status, not logging.')
    }
  });
  pinger.pingRequest(config.AuthAddress + '/pinger').then((value) => {
    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    const fileName = `./logs/AUTHlog.txt`;

    let lastStatus;
    try {
      const lastLogEntry = fs.readFileSync(fileName, 'utf8')
        .split('\n')
        .filter(Boolean)
        .pop();
      lastStatus = lastLogEntry.split('Status:')[1].split(' ')[0];
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`File "${fileName}" does not exist, creating it...`);
        fs.writeFileSync(fileName, '');
        lastStatus = null;
      } else {
        console.error('Error while reading the log file:', error);
        lastStatus = null;
      }
    }



    if (lastStatus === undefined || value.status.toString() !== lastStatus) {
      const logEntry = `${formattedDate} - Status:${value.status} Data:${value.data}\n`;
      fs.appendFileSync(fileName, logEntry);
      console.log(`AUTH Log created: ${logEntry}`);
    } else {
      console.log('AUTH No change in status, not logging.')
    }
  });

}, { scheduled: true });


// run server
const { PORT = 3007 } = process.env;
app.listen(PORT, () => {
  console.log(`Health service is listening on port ${PORT}`);
});
