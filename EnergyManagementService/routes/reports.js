const express = require('express');
 const router = express.Router();

const axios = require('axios');
const config = require('config');

// report energyUsage by device mac

router.get('/energyUsageByDevice/:mac', async (req, res) => {
  try {
    const energyUsage = await energyUsageByDevice(req.params.mac);
    res.send(energyUsage);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});




async function energyUsageByDevice(mac) {
  try {
    const response = await axios.get(config.DeviceServiceAddress + '/api/ctrl//getDeviceByMac/' + mac);
    const device = response.data;
    console.log(device);
    // 2 - get footprint from influx
    // 3 - calculate usage
    // 4 - sum usage
  } catch (error) {
    console.error(error);
  }
}

module.exports = router;

module.exports.energyUsageByDevice = energyUsageByDevice;