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
    MacAddress: String

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


async function getDeviceTopic(deviceId) {
    try {
        let singleDeviceindb = await DeviceDocument.findById(deviceId);

        return singleDeviceindb.Topic;
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            console.error(`Invalid Device ID: ${error.value}`);
        } else {
            console.error(`Error finding Device: ${error.message}`);
        }
        return "0";
    }
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
        return "0";
    }
}

async function getUserDeviceList(userId) {
    console.log('userID:'+userId);
   try {
      const documents = await DeviceDocument.find({ userId: userId });
      if (documents && documents.length > 0) {
         return documents;
      } else {
         console.log("No documents found");
      }
   } catch (error) {
      console.error("Error finding documents", error);
      throw new Error("Error finding documents");
   }
   return '-1';
}



module.exports.getDeviceMac = getDeviceMac;
module.exports.getUserDeviceList = getUserDeviceList;
module.exports.getDeviceTopic = getDeviceTopic;
  //module.exports.DeviceModel = mongoose.model('DeviceDocument',deviceSchema)