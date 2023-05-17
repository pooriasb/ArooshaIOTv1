var mongoose = require('mongoose');
const _ = require('lodash');
const http = require('http');
const config = require('config');
const scheduleModel = require('../models/scheduleModel');
const { resolve } = require('path');


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
       // console.log('MEssage list:' + messageList);
       sendToMqttService(messageList);
   
       
    }
    messageList = [];

    
}

function sendToMqttService(messageList){
//console.log(messageList);
var grouped = _.mapValues(_.groupBy(messageList,'deviceTopic'),mList=>mList.map(message=>_.omit(message,'deviceTopic')));



console.log( grouped);
}


function addToMEssageList(message) {
    messageList.push(message);
}

async function createMessage(element) {
    var deviceTopic = "";
    var deviceMac = "";
    var eventid = element.eventId;
    await getTopic(element.deviceId).then((res) => {
        deviceTopic = res;
    });
    await getTMac(element.deviceId).then((res) => {
        deviceMac = res;
    });
    var message = { deviceTopic, deviceMac, eventid };

    return message;


}

function getTMac(deviceId) {
    return p = new Promise((resolve, reject) => {

        http.get(config.DeviceServiceAddress + '/GetDeviceMac/' + deviceId, (resp) => {
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