const express = require('express');
const _ = require('lodash');
const mongoose = require('mongoose');
const config = require('config');


mongoose.connect(config.dbAddress)
    .then(() => console.log('Connected to database'))
    .catch(err => console.log('Error ' + err));


const messageLogSchema = new mongoose.Schema({
    mac: String,
    message: String
});
const MessageLog = mongoose.model('messageLog', messageLogSchema);



const createMessageLog = async (mac,message) => {
    try {

        const newMessageLog = new MessageLog({mac, message});
        await newMessageLog.save();
        return 200;
    } catch (err) {
        console.log(err);
        return 500;
    }
};
const createOrUpdateMessageLog = async (mac, message) => {
  try {
    // Find the last message log for the given mac
    const lastMessageLog = await MessageLog.findOne({ mac }).sort({ _id: -1 });
    
    if (lastMessageLog) {
      // Update the last message log with new data
      lastMessageLog.message = message;
      await lastMessageLog.save();
    } else {
      // Create a new message log
      const newMessageLog = new MessageLog({ mac, message });
      await newMessageLog.save();
    }

    return 200;
  } catch (err) {
    console.log(err);
    return 500;
  }
};


const readLastMessageLogByMac = async (mac) => {
  try {
    const lastMessageLog = await MessageLog.findOne({ mac }).sort('_id').lean().exec();
    if(!lastMessageLog) return {};
    return lastMessageLog;
  } catch(error) {
    console.error(`Error reading last message by ${mac}:`);
    return "";
  }
};


module.exports.readLastMessageLogByMac = readLastMessageLogByMac;
module.exports.createMessageLog = createMessageLog;
module.exports.createOrUpdateMessageLog = createOrUpdateMessageLog;
