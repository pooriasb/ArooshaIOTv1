
const express = require('express');
const mongoose = require('mongoose');
const config = require('config');


mongoose.connect(config.dbAddress)
    .then(() => console.log('Connected to database'))
    .catch(err => console.log('Error ' + err));


const deviceConnectionStatusSchema = new mongoose.Schema({
    macAddress: String,
    status: String,
    dateTime: {
        type: Date,
        default: Date.now
    }
});

const DeviceConnectionStatus = mongoose.model('DeviceConnectionStatus', deviceConnectionStatusSchema);

const DeviceConnectionStatus = require('./models/DeviceConnectionStatus');

async function createDeviceConnectionStatus(macAddress, status) {
    try {
        await DeviceConnectionStatus.create({ macAddress, status });
        console.log("Device status created successfully.");
    } catch (error) {
        console.error("Error creating device status:", error);
    }
}

async function getLastTenDeviceConnectionStatus() {
    try {
        const devices = await DeviceConnectionStatus.find()
            .sort({ dateTime: -1 })
            .limit(10);

        console.log("Last 10 device status records:", devices);
    } catch (error) {
        console.error("Error getting last 10 device status records:", error);
    }
}

async function getLastDeviceConnectionStatus() {
    try {
        const device = await DeviceConnectionStatus.findOne()
            .sort({ dateTime: -1 });

        console.log("Last device status record:", device);
    } catch (error) {
        console.error("Error getting last device status record:", error);
    }
}




async function updateDeviceConnectionStatus(macAddress, status) {
    try {
        const device = await DeviceConnectionStatus.findOne({ macAddress });

        if (device) {
            device.status = status;
            device.dateTime = Date.now();
            await device.save();
        } else {
            await DeviceConnectionStatus.create({ macAddress, status });
        }

        console.log("Device status updated successfully.");
    } catch (error) {
        console.error("Error updating device status:", error);
    }
}





module.exports = {
    updateDeviceConnectionStatus,
    createDeviceConnectionStatus,
    getLastTenDeviceConnectionStatus,
    getLastDeviceConnectionStatus
}