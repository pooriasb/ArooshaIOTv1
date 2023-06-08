const express = require('express');
const router = express.Router();
router.use(express.json());
const axios = require('axios');
const config = require('config');

// report energyUsage by device mac

router.get('/energyUsageByDevice/:mac/:start', async (req, res) => {
  try {
    const energyUsage = await energyUsageByDevice(req.params.mac, req.params.start);
    res.send(energyUsage);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
async function energyUsageByDevice(mac, start) {
  try {
    const deviceResponse = await axios.get(config.DeviceServiceAddress + '/api/ctrl//getDeviceByMac/' + mac);
    const device = deviceResponse.data;
    const deviceInfoResponse = await axios.get(config.DeviceServiceAddress + '/api/ctrl//getDeviceInfoByModel/' + device.deviceModel);
    const deviceInfo = deviceInfoResponse.data;

    const signalResponse = await axios.get(config.InfluxServiceAddress + '/getSignalsByMac/' + mac + '/' + start);
    const signals = signalResponse.data;

    //console.log(JSON.stringify(signals));
    let signalLength = signals.length
    let sumColorTemperature = 0;
    let sumRgbBrightness = 0;
    let sumBrightness = 0;
    let ColorTemperaturelength = 0;
    let RgbBrightnesslength = 0;
    let Brightnesslength = 0;
    if (signalLength > 0) {
      signals.forEach(signal => {
        if (Number.isInteger(parseInt(signal.colorTemperature))) {
          sumColorTemperature += parseInt(signal.colorTemperature);
          ColorTemperaturelength++;
        }
        if (Number.isInteger(parseInt(signal.rgbBrightness))) {
          sumRgbBrightness += parseInt(signal.rgbBrightness);
          RgbBrightnesslength++;
        }
        if (Number.isInteger(parseInt(signal.brightness))) {
          sumBrightness += parseInt(signal.brightness);
          Brightnesslength++;
        }
      });
    }


    console.log('Device Model: ' + device.deviceModel);
    console.log('driver yellow power : ' + deviceInfo.driverYellowPower);
    console.log('driver white power : ' + deviceInfo.driverWhitePower);
    console.log('driver RGB power : ' + deviceInfo.driverRGBPower);

    console.log('signals count: ' + signals.length);
    console.log('colorTemperature: ' + sumColorTemperature + ' >len: ' + ColorTemperaturelength);
    console.log('brightness: ' + sumBrightness + ' >len: ' + Brightnesslength);
    console.log('RgbBrightness: ' + sumRgbBrightness + ' >len: ' + RgbBrightnesslength);


    // 2 - get footprint from influx
    // 3 - calculate usage
    // 4 - sum usage
  } catch (error) {
    console.error(error);
  }
}

module.exports = router;

module.exports.energyUsageByDevice = energyUsageByDevice;