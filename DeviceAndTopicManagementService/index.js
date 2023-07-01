// this file work as service gateway
//++++++++++++++DEVICE Service++++++++++++++++++++
const express = require('express');
const deviceModel = require('./models/device');
const controllerRouter = require('./routes/DeviceCtrl');
const app = express();
const DeviceInfo = require('./models/deviceinfo');
const roomRouter = require('./routes/roomsCtrl');

app.use('/api/ctrl',controllerRouter);
app.use('/api/room',roomRouter);

app.get('/GetDeviceTopic/:deviceID', (req, res) => {
  try {
    console.log('GetTopic : ' + req.params.deviceID);
    deviceModel.getDeviceTopic(req.params.deviceID).then(value => {res.send(value)});
  } catch(error) {
    console.log('GetDeviceTopic error');
    res.status(500).send("Internal server error.")
  }
});

app.get('/GetDeviceMac/:deviceID',(req,res)=>{
  try {
    deviceModel.getDeviceMac(req.params.deviceID).then(value => {res.send(value)});
  } catch(error) {
    console.log('GetDeviceMac Error');
    res.status(500).send("Internal server error.")
  }
});


// const { exec } = require('child_process');

// exec('cd ..', (error, stdout, stderr) => {
//   if (error) {
//     console.error(`Command execution error: ${error}`);
//     return;
//   }
//   console.log(stdout);
// });


const port = process.env.port || 3003;
app.get('/pinger',(req,res)=>{res.send(`Device Service is ok `)});

app.listen(port, () => console.log(`Device Service is listening on port ${port}`));
