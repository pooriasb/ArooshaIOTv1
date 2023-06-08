const express = require('express');
const _ = require('lodash');
const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.dbAddress)
  .then(() => console.log('Connected to database'))
  .catch(err => console.log('Error ' + err));

const Schema = mongoose.Schema;

const DeviceInfoSchema = new Schema({
  deviceName: {
    type: String,
    required: true
  },
  deviceModel: {
    type: String,
    required: true
  },
  driverWhitePower: {
    type: String,
    required: true
  },
  driverYellowPower: {
    type: String,
    required: true
  },
  driverRGBPower: {
    type: String,
    required: true
  }
});

const DeviceInfo = mongoose.model('DeviceInfo', DeviceInfoSchema);




async function getDeviceByModel(model) {
  try {
const device = await DeviceInfo.findOne({ 
  deviceModel: model 
}, {
  driverRGBPower: true,
  driverYellowPower: true,
  driverWhitePower: true,
  _id: false 
});


    console.log(device);
    return device;
  } catch (err) {
    console.log(err);
  }
}







const testDevices = [
  {
    deviceName: "lostere hobabi",
    deviceModel: "A2408",
    driverWhitePower: "50",
    driverYellowPower: "50",
    driverRGBPower: "30"
  },
  {
    deviceName: "lostere ICEROCK",
    deviceModel: "G025J",
    driverWhitePower: "50",
    driverYellowPower: "50",
    driverRGBPower: "30"
  },
  {
    deviceName: "loster hobabi tarh2",
    deviceModel: "SM-G981U",
    driverWhitePower: "50",
    driverYellowPower: "50",
    driverRGBPower: "30"
  },
  {
    deviceName: "loster ICEROCK BIG",
    deviceModel: "KB2001",
    driverWhitePower: "50",
    driverYellowPower: "50",
    driverRGBPower: "30"
  },
  {
    deviceName: "loster Common",
    deviceModel: "XT2071-4",
    driverWhitePower: "50",
    driverYellowPower: "50",
    driverRGBPower: "30"
  }
];

// DeviceInfo.insertMany(testDevices)
//   .then(function(res) {
//     console.log(`Successfully added ${res.length} devices to database.`);
//   })
//   .catch(function(err) {
//     console.log(err);
//   });




module.exports.deviceinfoModel = DeviceInfo;
module.exports.getDeviceByModel = getDeviceByModel;


