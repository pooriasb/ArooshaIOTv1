const express = require('express');
const router = express.Router();
router.use(express.json());
const device = require('../models/device');



router.get('/list/:userId', (req, res) => {
    device.getUserDeviceList(req.params.userId).then(value => { res.send(value) });
});

router.post('/create', (req, res) => {
    const { userId, deviceName, deviceModel, Topic, MacAddress } = req.body;
    const recivedDevice = { userId, deviceName, deviceModel, Topic, MacAddress };
    //TODO: do proper validation 
    device.createDevice(recivedDevice)
        .then((value) => res.send(value))
        .catch((error) => res.status(400).send(error));
});

router.get('/delete/:deviceId', (req, res) => {
    device.deleteDevice(req.params.deviceId).then((value) => {
        res.send(value);
    });
});

router.get('/RoomList/:userId', (req, res) => {
    device.getMyRoolList(req.params.userId).then((value) => {
        res.send(value);
    });
});

module.exports = router;