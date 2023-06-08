const express = require('express');
 const router = express.Router();
 router.use(express.json());
const axios = require('axios');
const config = require('config');

// report energyUsage by device mac

router.get('/energyUsageByDevice/:mac/:start', async (req, res) => {
  try {
    const energyUsage = await energyUsageByDevice(req.params.mac,req.params.start);
    res.send(energyUsage);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
async function energyUsageByDevice(mac,start) {
  try {
    const deviceResponse = await axios.get(config.DeviceServiceAddress + '/api/ctrl//getDeviceByMac/' + mac);
    const device = deviceResponse.data;
    const deviceInfoResponse = await axios.get(config.DeviceServiceAddress + '/api/ctrl//getDeviceInfoByModel/' + device.deviceModel);
const deviceInfo = deviceInfoResponse.data;

   const signalResponse = await axios.get(config.InfluxServiceAddress + '/getSignalsByMac/'+mac+'/'+start);
   const signals = signalResponse.data;

   console.log('Device: '+ device.deviceModel);
   console.log('signals : ' +JSON.stringify(signals));

   console.log('deviceInfoResponse : ' +deviceInfo.driverYellowPower);

    // 2 - get footprint from influx
    // 3 - calculate usage
    // 4 - sum usage
  } catch (error) {
    console.error(error);
  }
}

module.exports = router;

module.exports.energyUsageByDevice = energyUsageByDevice;