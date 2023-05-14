var mongoose = require('mongoose');
const _ = require('lodash');
const scheduleModel = require('../models/scheduleModel');





async function createMqttMessageRequest(scheduleId) {
    console.log('helper caled' + scheduleId);
    var result = await scheduleModel.scheduleModel.findById(scheduleId);
console.log(result);
    // var eventListIndb = result.eventList;
    // eventListIndb.forEach(element => {

    //     var topic = scheduleModel.getDeviceTopic(element.deviceId);
    //     var MacAddress = scheduleModel.getDeviceMac(element.deviceId);

    //     console.log(topic + ' ' + MacAddress);
    // });
}



module.exports.createMqttMessageRequest = createMqttMessageRequest;