// this file work as service gateway
const express = require('express');
const deviceModel = require('./models/device');

const app = express();



app.get('/GetDeviceTopic/:deviceID',(req,res)=>{
     deviceModel.getDeviceTopic(req.params.deviceID).then(value => {res.send(value)});
});
app.get('/GetDeviceMac/:deviceID',(req,res)=>{
    deviceModel.getDeviceMac(req.params.deviceID).then(value => {res.send(value)});
});





const port = process.env.port || 3003;
app.listen(port, () => console.log(`Device Service is listening on port ${port}`));



