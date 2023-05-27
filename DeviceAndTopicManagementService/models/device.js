const express = require('express');
const _ = require('lodash');
const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.dbAddress)
    .then(() => console.log('Connected to database'))
    .catch(err => console.log('Error ' + err));
const deviceSchema = new mongoose.Schema({
    userId: String,
    deviceName: String,
    deviceModel: String,
    Topic: String,
    MacAddress : String
    
})
const DeviceDocument = mongoose.model('DeviceDocument', deviceSchema);




// const testDevice = new DeviceDocument({
//     userId: 'sajad',
//     deviceName: 'loostere Icerock',
//     deviceModel: 'ICEROCK0585',
//     Topic: 'ArooshaIOT/sajad/h1/r1',
//     MacAddress :'0253'
// });
//testDevice.save();


async function getDeviceTopic(deviceId){
    
    var singleDeviceindb =await DeviceDocument.findById(deviceId);
    
    return singleDeviceindb.Topic;
     
 }
async function getDeviceMac(deviceId) {
    try {
        let singleDeviceindb = await DeviceDocument.findById(deviceId);
       
    return singleDeviceindb.MacAddress;

      } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
          console.error(`Invalid document ID: ${error.value}`);
        } else {
          console.error(`Error finding document: ${error.message}`);
        }
      }
}



  module.exports.getDeviceMac = getDeviceMac;
  module.exports.getDeviceTopic = getDeviceTopic;
  //module.exports.DeviceModel = mongoose.model('DeviceDocument',deviceSchema)