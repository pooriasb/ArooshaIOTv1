const express = require('express');
const _ = require('lodash');
const mongoose = require('mongoose');
const config = require('config');



/************************Config database */
mongoose.connect(config.dbAddress)
    .then(() => console.log('Connected to database'))
    .catch(err => console.log('Error ' + err));

const eventListSchema = new mongoose.Schema({
    deviceId: String,
    eventId: String
});

const ScheduleDocumentChema = new mongoose.Schema({
    userId: String,
    scheduleCreateDateTime: Date,
    eventList: [eventListSchema],
    isScheduled: Boolean,
    scheduleTime: String
    
});

const EventList = mongoose.model('EventList', eventListSchema);


const ScheduleDocument = mongoose.model('ScheduleDocument',ScheduleDocumentChema);

// create test device


/********************************************************** */

//scheduletime : m,h,d
async function CreateScheduler() {
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
   
}
async function createScheduler(data) {
    const { userId, isOnce, weekDays, hour, minute, events } = data; // destructuring the input object
    const scheduleTime = JSON.stringify({ isOnce, weekDays, hour, minute });
    const eventList = events.map((event) => ({
      deviceId: event.deviceId,
      eventId: event.eventId,
    }));
    const newSchedule = await ScheduleDocument.create({
      userId,
      scheduleDateTime: Date.now(),
      eventList,
      isScheduled: true,
      scheduleTime,
    });
  }
  

 module.exports = {
    CreateScheduler
 }

module.exports.scheduleModel = mongoose.model('ScheduleDocument', ScheduleDocumentChema);
