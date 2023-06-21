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
});
deviceSchema.methods.saveDevice = async function () {
    try {
        return await this.save();
    } catch (error) {
        throw error;
    }
};
const DeviceDocument = mongoose.model('DeviceDocument', deviceSchema);


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
    console.log('userID:' + userId);
    try {
        const documents = await DeviceDocument.find({ userId: userId })
            .select('-_id deviceName deviceModel Topic MacAddress');
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

async function createDevice(device) {
    try {
        const { userId, deviceName, deviceModel, Topic, MacAddress } = device;
        const testDevice = new DeviceDocument({ userId, deviceName, deviceModel, Topic, MacAddress });
        await testDevice.save();
        return '1';
    } catch (error) {
        console.error(error);
        return '0';
    }
}
async function deleteDevice(mac) {
    try {
        const result = await DeviceDocument.deleteOne({ MacAddress: mac });
        return result;
    } catch (err) {
        console.error(err);
    }
}

async function getMyRoolList(userId) {
    //list devices >> topics
    // topics Splited by /
    var Topics = [];

    const devices = await DeviceDocument.find({ userId: userId });
    devices.forEach(device => {
        //  console.log(`User ID: ${device.userId}, Topic: ${device.Topic}`);
        // "ArooshaIOT/sajad/h1/r2"
        const arr = device.Topic.split("/");
        Topics.push(arr[3]);
    });
    var uniqueTopics = Array.from(new Set(Topics));
    return JSON.stringify(uniqueTopics);
}


async function getDeviceByMac(mac) {
    try {
        const device = await DeviceDocument.findOne({ MacAddress: mac });
        return device;
    } catch (err) {
        console.log(err);
    }
}

async function updateDeviceRoom(oldRoom, userId, newRoom) {
    try {
        const regex = new RegExp(`${oldRoom}`);
        // Specifying collection name and using proper arguments for the find statement using lean() and exec().
        const devices = await DeviceDocument.find({ userId: userId, Topic: { $regex: regex } }).lean().exec();
        for (let i = 0; i < devices.length; i++) {
            const oldTopic = devices[i].Topic;
            const newTopic = oldTopic.replace(new RegExp(oldRoom, 'g'), newRoom);
            devices[i].Topic = newTopic;

            // The function should update the records using findByIdAndUpdate instead of save, since `devices` object is an array.
            await DeviceDocument.findByIdAndUpdate(devices[i]._id, devices[i]);
        }
        return 200;
    } catch (error) {
        return 500;
    }
}


async function getDevicesInRoomByRoomName(roomName, userId) {
    try {
        const regex = new RegExp(`${roomName}`);
        const devices = await DeviceDocument.find({ userId: userId, Topic: { $regex: regex } }).lean().exec();
        return devices;
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

// Define the function to find and update the device
async function updateDeviceName(userId, deviceId, newDeviceName) {
    try {
        const device = await DeviceDocument.findOne({ _id: deviceId, userId: userId });
        if (!device) {
            throw new Error(`Device with id ${deviceId} not found for user ${userId}`);
        }
        device.deviceName = newDeviceName;
        return await device.save();
    } catch (error) {
        throw error;
    }
}



module.exports = {
    getDeviceByMac,
    getMyRoolList,
    deleteDevice,
    createDevice,
    getDeviceMac,
    getUserDeviceList,
    getDeviceTopic,
    updateDeviceRoom,
    getDevicesInRoomByRoomName,
    updateDeviceName
};
