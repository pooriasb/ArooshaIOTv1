const express = require('express');


const axios = require('axios');
const config = require('config');

// report energyUsage by device mac


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



module.exports.energyUsageByDevice = energyUsageByDevice;