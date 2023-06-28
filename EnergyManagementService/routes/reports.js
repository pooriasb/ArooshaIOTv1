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
    console.time('deviceRequest');
    const deviceResponse = await axios.get(`${config.DeviceServiceAddress}/api/ctrl/getDeviceByMac/${mac}`);
    const device = deviceResponse.data;
    console.timeEnd('deviceRequest');

    console.time('deviceInfoRequest');
    const deviceInfoResponse = await axios.get(`${config.DeviceServiceAddress}/api/ctrl/getDeviceInfoByModel/${device.deviceModel}`);
    const deviceInfo = deviceInfoResponse.data;
    console.timeEnd('deviceInfoRequest');

    console.time('signalRequest');
    const signalResponse = await axios.get(`${config.InfluxServiceAddress}/getSignalsByMac/${mac}/${start}`);
    const signals = signalResponse.data;
    console.timeEnd('signalRequest');

    let signalLength = signals.length;
    let sumColorWhitePower = 0;
    let sumColorYellowPower = 0;
    let sumRGBPower = 0;
    let sumRgbBrightness = 0;
    let sumBrightness = 0;
    let ColorTemperaturelength = 0;
    let RgbBrightnesslength = 0;
    let Brightnesslength = 0;

    if (signalLength > 0) {
      signals.forEach(signal => {
        let rgbPower = 0;
        if (Number.isInteger(parseInt(signal.colorTemperature))) {

          let whiteTemp = 0;
          let yellowTemp = 0;
          let yellowPower = 0;
          let whitePower = 0;

          if (parseInt(signal.colorTemperature) > 50) { //yellow
            yellowTemp = (100 - parseInt(signal.colorTemperature)) * 2;
            whiteTemp = 100;
          } else if (parseInt(signal.colorTemperature) === 50) {
            yellowTemp = 100;
            whiteTemp = 100;
          } else {
            yellowTemp = 100;
            whiteTemp += parseInt(signal.colorTemperature) * 2;
          }

          yellowPower = (deviceInfo.driverYellowPower * (yellowTemp / 100)) * (signal.brightness / 100);
          whitePower = (deviceInfo.driverWhitePower * (whiteTemp / 100)) * (signal.brightness / 100);

          sumColorYellowPower += yellowPower;
          sumColorWhitePower += whitePower;
          ColorTemperaturelength++;
        }
        if (Number.isInteger(parseInt(signal.rgbBrightness))) {
          // sumRgbBrightness += parseInt(signal.rgbBrightness);
          rgbPower = ((parseInt(signal.rgbBrightness) / 100) * deviceInfo.driverRGBPower);
          sumRGBPower += rgbPower;
          RgbBrightnesslength++;
        }
        if (Number.isInteger(parseInt(signal.brightness))) {
          sumBrightness += parseInt(signal.brightness);
          Brightnesslength++;
        }
      });
    }

    let whiteEnergyUsageAVG = calculateEnergyUsage((sumColorWhitePower / ColorTemperaturelength), deviceInfo.driverWhitePower, 0);
    let yellowEnergyUsageAVG = calculateEnergyUsage((sumColorYellowPower / ColorTemperaturelength), deviceInfo.driverYellowPower, 0);
    let rgbEnergyUsageAVG = calculateEnergyUsage((sumRgbBrightness / RgbBrightnesslength), deviceInfo.driverRGBPower, 0);
    var energyResult = {
      deviceModel: device.deviceModel,
      driverYellowPower: deviceInfo.driverYellowPower,
      driverWhitePower: deviceInfo.driverWhitePower,
      driverRGBPower: deviceInfo.driverRGBPower,
      signalsCount: signals.length,
      RgbBrightnesslength,
      whiteEnergyUsageAVG,
      yellowEnergyUsageAVG,
      rgbEnergyUsageAVG,
      sumColorWhitePower,
      sumColorYellowPower,
      sumRGBPower,
      sumAll: sumColorWhitePower + sumColorYellowPower + sumRgbBrightness
    }
    return energyResult;
  } catch (error) {
    console.error(error);
  }
}

router.get('/energyUsageByUser/:userId/:start', async (req, res) => {
  //1. get user devices by mac
  //127.0.0.1:3003/api/ctrl/list/sajad
  const macs = [];
  const deviceResponse = await axios.get(`${config.DeviceServiceAddress}/api/ctrl/list/${req.params.userId}`);
  const devices = deviceResponse.data;
  devices.forEach(device => {
    macs.push(device.MacAddress);
  });
  let energyResult = [];
  await Promise.all(macs.map(async mac => {
    let singleEnergy = await energyUsageByDevice(mac, req.params.start);
    energyResult.push(singleEnergy);
  }));

  res.send(energyResult);
});
router.get('/energyUsageByRoom/:roomId/:start', async (req, res) => {
  try {
    const response = await axios.get(config.DeviceServiceAddress + '/api/room/getDevicesInRoomByRoomId/' + req.params.roomId);
    const devices = response.data.devices.map(device => device.MacAddress);

    const energyResult = await Promise.all(devices.map(async mac => {
      return energyUsageByDevice(mac, req.params.start);
    }));

    res.status(200).send(energyResult);

  } catch (error) {
    console.log('Error: ' + error);
    return res.status(500).send(error.message);
  }
});



function calculateEnergyUsage(temperature, w, brightness) {
  let percentofwatoftempeture = w * (temperature / 100);
  return percentofwatoftempeture;
}


module.exports = router;

module.exports.energyUsageByDevice = energyUsageByDevice;