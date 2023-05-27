var mongoose = require('mongoose');
const _ = require('lodash');
const http = require('http');
const config = require('config');
const io = require('socket.io-client');
const socket = io(config.SocketAddress);//SocketAddress
const scheduleModel = require('../models/scheduleModel');
let messageList = [];
 async function createMqttMessageRequest(scheduleId) {
    var result = await scheduleModel.scheduleModel.findById(scheduleId);
    var eventListIndb = result.eventList;
    eventListIndb.forEach(async (element) => {
        await createMessage(element).then(singleMessageCreated => {
            addToMEssageList(singleMessageCreated)
        });
    });
    if (messageList.length !== 0) {
       
        //sendToMqttService(messageList);
        sendToSocketService(messageList);
    }
    messageList = [];
}
function sendToSocketService(messageList){
    var grouped = _.mapValues(_.groupBy(messageList, 'deviceTopic'), mList => mList.map(message => _.omit(message, 'deviceTopic')));
    socket.on('connect', () => {
        console.log('Connected to socket server!');
      });
      socket.emit('request', {message:grouped,type :'S'});
}


async function sendToMqttService(messageList) {
    try {
        var grouped = _.mapValues(_.groupBy(messageList, 'deviceTopic'), mList => mList.map(message => _.omit(message, 'deviceTopic')));
        const response = await fetch(config.MQTTServiceAddress + '/SendSchedulerData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(grouped)
        })
        console.log(`MQTT Response: ${response.status}`);
    } catch (error) {
        console.error(`Error sending data to MQTT Service: ${error.message}`);
    }
}
function addToMEssageList(message) {
    messageList.push(message);
}
async function createMessage(element) {
    const deviceTopic = await getTopic(element.deviceId);
    const deviceMac = `${await getTMac(element.deviceId)}${Math.floor(Math.random() * 100) + 1}`;
    const message = { deviceTopic, deviceMac, eventid: element.eventId };
    return message;
}
function getTMac(deviceId) {
    return new Promise((resolve, reject) => {
        http.get(config.DeviceServiceAddress + '/GetDeviceMac/' + deviceId, resp => {
            let data = '';
            resp.on('data', chunk => data += chunk);
            resp.on('end', () => resolve(data));
        }).on('error', err => reject(err));
    });
}
function getTopic(deviceId) {
    return p = new Promise((resolve, reject) => {

        http.get(config.DeviceServiceAddress + '/GetDeviceTopic/' + deviceId, (resp) => {
            let data = "";

            // A chunk of data has been recieved.
            resp.on("data", chunk => {
                data += chunk;
            });
            // The whole response has been received. Print out the result.
            resp.on("end", () => {
                //    let url = JSON.parse(data).message;

                resolve(data);
            });
        }).on("error", err => {
            console.log("Error: " + err.message);
        });
    });
}

module.exports.createMqttMessageRequest = createMqttMessageRequest;