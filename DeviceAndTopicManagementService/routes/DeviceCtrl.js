const express = require('express');
const router = express.Router();
const device = require('../models/device');
router.get('/list/:userId', (req, res) => {
    device.getUserDeviceList(req.params.userId).then(value => { res.send(value) });
});

router.get('/create/:userId/:deviceName/:deviceModel/:Topic/:MacAddress', (req, res) => {
    //TODO : simple validation here
    var device = {
        userId: req.params.userId,
        deviceName: req.params.deviceName,
        deviceModel: req.params.deviceModel,
        Topic: req.params.Topic,
        MacAddress: req.params.MacAddress
    }
    device.createDevice(device).then((value)=>{res.send(value)});
});




module.exports = router;