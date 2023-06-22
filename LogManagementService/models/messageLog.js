const express = require('express');
const _ = require('lodash');
const mongoose = require('mongoose');
const config = require('config');


mongoose.connect(config.dbAddress)
    .then(() => console.log('Connected to database'))
    .catch(err => console.log('Error ' + err));


const messageLogSchema = new mongoose.Schema({
  lastUpdate:Date,
    mac: String,
    message: String
});
const MessageLog = mongoose.model('messageLog', messageLogSchema);

const createOrUpdateMessageLog = async (mac, message) => {
  try {
    const updateQuery = { mac };
    const update = { message, lastUpdate: Date.now()  };
    const options = { upsert: true };
  
    // Update the last message log with new data or create a new one if it doesn't exist
    await MessageLog.findOneAndUpdate(
        updateQuery,
        update,
        options
    );

    return 200;
  } catch (err) {
    console.log(err);
    return 500;
  }
};


const createMessageLog = async (mac,message) => {
    try {

        const newMessageLog = new MessageLog({lastUpdate:new Date(),mac, message});
        await newMessageLog.save();
        return 200;
    } catch (err) {
        console.log(err);
        return 500;
    }
};




const readLastMessageLogByMac = async (mac) => {
  try {
    const lastMessageLog = await MessageLog.findOne({ mac }).sort({ _id: -1 }).lean();
    if (!lastMessageLog) return {};
    return lastMessageLog;
  } catch (err) {
    console.error(`Error reading last message `, err.message);
    return "";
  }
};


module.exports.readLastMessageLogByMac = readLastMessageLogByMac;
module.exports.createMessageLog = createMessageLog;
module.exports.createOrUpdateMessageLog = createOrUpdateMessageLog;
