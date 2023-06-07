const express = require('express');
const router = express.Router();
const device = require('../models/device');
const deviceinfo = require('../models/deviceinfo');



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

router.get('/RoomList/:userId', async (req, res) => {
  const value = await device.getMyRoolList(req.params.userId);
  res.send(value);
});

router.get('/GetdeviceinfoByModel/:model', (req, res) => {
  const model = req.params.model;
  deviceinfo.getDeviceByModel(model)
    .then(device => {
      res.status(200).json(device);
    })
    .catch(err => {
      res.status(500).send('Error retrieving device from database');
    });
});

router.get('/getDeviceByMac/:mac', async (req, res) => {
  try {
    const device = await getDeviceByMac(req.params.mac);
    res.send(device);
  } catch(err) {
    console.log(err);
    res.status(500).json({ errorMessage: 'Error getting device by MAC address' });
  }
});

module.exports = router;