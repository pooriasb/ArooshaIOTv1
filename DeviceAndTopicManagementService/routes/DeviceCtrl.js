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

router.get('/delete/:mac', (req, res) => {
  device.deleteDevice(req.params.mac).then((value) => {
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
    const deviceobj = await device.getDeviceByMac(req.params.mac);
    res.send(deviceobj);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: 'Error getting device by MAC address' });
  }
});

router.get('/getDeviceInfoByModel/:deviceModel', async (req, res) => {
  try {
    const deviceobj = await deviceinfo.getDeviceByModel(req.params.deviceModel);
    res.send(deviceobj);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: 'Error getting device by MAC address' });
  }
});

router.get('/getDevicesInRoomByRoomName/:roomName', async (req, res) => {
  try {
    const result = await device.getDevicesInRoomByRoomName(req.params.roomName, 'sajad');
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send([]);
  }
});




router.post('/updateDeviceName', async (req, res) => {
  try {
    const { deviceId, newDeviceName } = req.body;
    const result = await device.updateDeviceName('sajad', deviceId, newDeviceName);
    return res.status(200).send(result);
  } catch (error) {
    console.error('Error updating device name');
    return res.status(500).send('Error updating device name');
  }
});


module.exports = router;