const express = require('express');
const _ = require('lodash');
const mongoose = require('mongoose');




/************************Config database */
mongoose.connect('mongodb://127.0.0.1:27017/ArooshaIOT',)
    .then(() => console.log('Connected to database'))
    .catch(err => console.log('Error ' + err));

const eventListSchema = new mongoose.Schema({
    deviceId: String,
    eventId: String
});
const EventList = mongoose.model('EventList', eventListSchema);



const ScheduleDocumentChema = new mongoose.Schema({
    userId: String,
    scheduleCreateDateTime: Date,
    eventList: [eventListSchema],
    isScheduled: Boolean,
    scheduleTime: String

});


const ScheduleDocument = mongoose.model('ScheduleDocument',ScheduleDocumentChema);

// create test device

const DeviceDocument = mongoose.model('DeviceDocument', new mongoose.Schema({
    userId: String,
    deviceName: String,
    deviceModel: String,
    Topic: String,
    MacAddress : String
}));
const testDevice = new DeviceDocument({
    userId: 'sajad',
    deviceName: 'loostere Icerock',
    deviceModel: 'ICEROCK0585',
    Topic: 'ArooshaIOT/sajad/h1/r1',
    MacAddress :'0253'
});
//testDevice.save();
/********************************************************** */

//scheduletime : m,h,d
async function CreateScheduler() {


    // weekDays :[1,2,3],
    // hour : 5,
    // minute :10,
    // isOnce:false
    var times = {
        isOnce: false,
        weekDays: [1, 2, 3],
        hour: 5,
        minute: 10
    }


    const newSchedule = new ScheduleDocument({
        userId: 'sajad',
        scheduleDateTime: Date.now(),
        eventList: [new EventList({ deviceId: '3223', eventId: '008' }), new EventList({ deviceId: '123', eventId: '009' })],
        isScheduled: true,
        scheduleTime: JSON.stringify(times)
    });
    const result = await newSchedule.save();
    console.log(result);
}

 function getDeviceTopic(deviceId){
   var singleDeviceindb = DeviceDocument.findById(deviceId);
   return singleDeviceindb.Topic;
    
}
 function getDeviceMac(deviceId){
    // var singleDeviceindb = DeviceDocument.findById(deviceId);
    // return singleDeviceindb.MacAddress;
     
 }

 module.exports = {
    getDeviceMac,
    getDeviceTopic,
    CreateScheduler
 }
//  module.exports.getDeviceMac = getDeviceMac();
//  module.exports.getDeviceTopic = getDeviceTopic();
// module.exports.CreateScheduler = CreateScheduler();
module.exports.scheduleModel = mongoose.model('ScheduleDocument', ScheduleDocumentChema);