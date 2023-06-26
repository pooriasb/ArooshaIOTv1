const express = require('express');
const _ = require('lodash');
const mongoose = require('mongoose');
const config = require('config');
const report = require('../routes/reports');

const axios = require('axios');

mongoose.connect(config.dbAddress)
    .then(() => console.log('Connected to database'))
    .catch(err => console.log('Error ' + err));
const limitSchema = new mongoose.Schema({
    userId: String,
    createDate: Date,
    isActive: Boolean,
    deviceMac: String,
    deviceName: String,
    maxUsePower: String,
    dimmer: String
});

const Limits = mongoose.model('Limits', limitSchema);


// Create a new limit entry
async function createLimit({ userId, deviceMac, deviceName, maxUsePower, dimmer }) {
    try {
        const limit = new Limits({ userId, isActive: true, createDate: Date.now(), deviceMac, deviceName, maxUsePower, dimmer });
        const result = await limit.save();
        return result;
    } catch (error) {
        console.error(error.message);
        return error;
    }
}


// Retrieve all limit entries
async function getAllLimits(userId) {
    try {
        const limits = await Limits.find({ userId: userId });
        return limits;
    } catch (error) {
        console.error(error.message);
        return error;
    }
}

// Retrieve a specific limit entry by ID
async function getLimitById(id) {
    try {
        const limit = await Limits.findById(id);
        return limit;
    } catch (error) {
        console.error(error.message);
        return error;
    }
}

// Update a specific limit entry by ID
async function updateLimitById(id, { createDate, deviceMac, deviceName, maxUsePower, dimmer }) {
    try {
        const limit = await Limits.findById(id);
        limit.createDate = createDate;
        limit.deviceMac = deviceMac;
        limit.deviceName = deviceName;
        limit.maxUsePower = maxUsePower;
        limit.dimmer = dimmer;
        const result = await limit.save();
        return result;
    } catch (error) {
        console.error(error.message);
        return error;
    }
}

// Delete a specific limit entry by ID
async function deleteLimitById(id) {
    try {
        const result = await Limits.findByIdAndDelete(id);
        return result;
    } catch (error) {
        console.error(error.message);
        return error;
    }
}
async function setLimitActive(id, isActive) {
    try {
        const result = await Limits.findByIdAndUpdate(id, { isActive }, { new: true });
        return result;
    } catch (error) {
        console.error(error.message);
        return error;
    }
}

async function LimitCheck(id) {
    try {
        var limit = await getLimitById(id);
        var timeFromNow = Date.now() - new Date(limit.createDate);
        var timeUnits = [
            { unit: "d", ms: 86400000 }, // 24 hours in milliseconds
            { unit: "h", ms: 3600000 }, // 60 minutes in milliseconds
            { unit: "m", ms: 60000 }, // 60 seconds in milliseconds
        ];
        var timeString = "";
        for (var i = 0; i < timeUnits.length; i++) {
            var unit = timeUnits[i].unit;
            var ms = timeUnits[i].ms;
            var value = Math.floor(timeFromNow / ms);
            if (value > 0) {
                timeString += value + unit + " ";
                timeFromNow -= value * ms;
            }
        }

        var timeStringWithoutSpaces = timeString.replace(/\s/g, '');
        console.log('time : ' + timeStringWithoutSpaces);

        var result = await report.energyUsageByDevice(limit.deviceMac, '-' + timeStringWithoutSpaces);

        var sumAll = result.sumAll;
        var isLimitStarted = sumAll >= limit.maxUsePower ? true : false

        if (isLimitStarted) {
            console.log('limit Reached')
            //limit is started
            //sendSms('','');
            var message = limit.dimmer;
            sendMessageToDevice(limit.deviceMac, message);
        }



        var limitResult = {
            ...result,
            maxuseage: limit.maxUsePower,
            isLimitStarted
        }
        return limitResult;
    } catch (error) {
        console.error('Error in LimitCheck:', error);
        throw error;
    }
}

const sendSms = (phone, message) => {

    request.post({
        url: 'http://ippanel.com/api/select',
        body: {
            "op": "pattern",
            "user": "09928966092",
            "pass": "Faraz@2282094247",
            "fromNum": "3000505",
            "toNum": phone,
            "patternCode": "kc6wd4eitrp9v5d",
            "inputData": [
                { "code": message }
            ]
        },
        json: true,
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            //YOU‌ CAN‌ CHECK‌ THE‌ RESPONSE‌ AND SEE‌ ERROR‌ OR‌ SUCCESS‌ MESSAGE
            console.log(response.body);
        } else {
            console.log("whatever you want");
        }
    });
}
const sendMessageToDevice = async (mac, message) => {
    try {
        const sendMessageResponse = await axios.post(`${config.ApiGateway}/api/device/sendMessage`, {
            MacAddress: mac,
            powerStatus: 'on',
            deviceCustomization: {
                isLimited: true,
                limitDimmer: message
            }
        });
        console.log('send Message Response : ');
        console.log(sendMessageResponse.data);

    } catch (error) {
        console.error('Error in sendMessageToDevice:', error.message);

    }
}

const setDeviceLimitOff = async (mac)=>{
    try {
        const sendMessageResponse = await axios.post(`${config.ApiGateway}/api/device/sendMessage`, {
            MacAddress: mac,
            powerStatus: 'on',
            deviceCustomization: {
                isLimited: false,
            }
        });
        console.log('send Message Response : ');
        console.log(sendMessageResponse.data);
    } catch (error) {
        console.error('Error in sendMessageToDevice:', error.message);
    }
}

module.exports = {
    createLimit,
    getAllLimits,
    getLimitById,
    updateLimitById,
    deleteLimitById,
    setLimitActive,
    LimitCheck,
    setDeviceLimitOff
}