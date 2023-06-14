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
const MessageLog = mongoose.model('messageLog', deviceSchema);



const createMessageLog = async (mac,message) => {
    try {
        const newMessageLog = new MessageLog({mac, message});
        await newMessageLog.save();
        return 200;
    } catch (err) {
        return 500;
    }
};



const readLastMessageLogByMac = async (mac) => {
    try {
        const lastMessageLog = await MessageLog.findOne({ mac }).sort({ _id: -1 }).exec();
        return lastMessageLog.message;
    } catch (err) {
        console.error(`Error reading last message by ${mac}:`, err);
        return "";
    }
};


module.exports.readLastMessageLogByMac = readLastMessageLogByMac;
module.exports.createMessageLog = createMessageLog;
