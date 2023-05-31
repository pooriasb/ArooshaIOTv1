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


const readSchedules = async (userId) => {
  try {
    const schedules = await ScheduleDocument.find({userId: userId}).exec();
    return schedules;
  } catch (err) {
    console.error(err);
    throw new Error('Error getting schedules');
  }
};


function deleteSchedule(scheduleId){
  return ScheduleDocument.deleteOne({ _id: scheduleId })
    .then(() => {
      console.log('Schedule document deleted successfully');
      return "1";
    })
    .catch((err) => {
      console.error(err);
      return "0";
    });
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

const setScheduleActivation = async (scheduleId, isScheduled) => {
  try {
    const scheduleDocument = await ScheduleDocumentChema.findById(scheduleId);
    
    if (!scheduleDocument) {
     console.log('Schedule document not found');
     return "0";
    }
    
    scheduleDocument.isScheduled = isScheduled;
    await scheduleDocument.save();
    return "1";
  } catch (error) {
    console.error('set schedule actiovation error'+error);
  }
};


 module.exports = {
    createScheduler,
    readSchedules,
    setScheduleActivation,
    deleteSchedule
 }

module.exports.scheduleModel = mongoose.model('ScheduleDocument', ScheduleDocumentChema);



