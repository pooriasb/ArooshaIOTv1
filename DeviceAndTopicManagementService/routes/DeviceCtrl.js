const express = require('express');
const router = express.Router();
const device = require('../models/device');
router.get('/list/:userId', (req, res) => {
    device.getUserDeviceList(req.params.userId).then(value => { res.send(value) });
});

router.post('/createDevice', (req, res) => {
    const { userId, deviceName, deviceModel, topic, macAddress } = req.body;
    const device = { userId, deviceName, deviceModel, topic, macAddress };
    
    //TODO: do proper validation 
    device.createDevice(device)
        .then((value) => res.send(value))
        .catch((error) => res.status(400).send(error));
});

router.get('/delete/:deviceId',(req,res)=>{
    device.deleteDevice(req.params.deviceId).then((value)=>{
res.send(value);
    });
});



module.exports = router;