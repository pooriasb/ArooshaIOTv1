const express = require('express');
const _ = require('lodash');
const mongoose = require('mongoose');
const config = require('config');
/************************Config database */
mongoose.connect(config.dbAddress)
    .then(() => console.log('Connected to database'))
    .catch(err => console.log('Error ' + err));
const ScheduleDocumentChema = new mongoose.Schema({
    userId: String,
    scheduleCreateDateTime: Date,
    eventList: { 
      deviceId: String,
      deviceName:String,
      eventId: String
    },
    isScheduled: Boolean,
    scheduleTime: {  isOnce: String,
       weekDays:String,
        hour:String,
         minute:String,
         }
    
});
const ScheduleDocument = mongoose.model('ScheduleDocument',ScheduleDocumentChema);

// create test device

async function createScheduler(data) {
  const {  isOnce, weekDays, hour, minute, events } = data; // destructuring the input object
  // const scheduleTime = { isOnce, weekDays, hour, minute };
  try {
    const newSchedule = await ScheduleDocument.create({
      userId:'sajad' ,
      scheduleDateTime: Date.now(),
      eventList:events,
      isScheduled: true,
      scheduleTime: {
        isOnce:isOnce,
        weekDays : weekDays,
        hour : hour,
        minute :minute
      }
    });
    return "Created";
  } catch (error) {
    console.error(error.message);
    return "error : "+error.message;
  }
}

const getScheduleById = async (scheduleId) => {
  try {
    const schedule = await ScheduleDocument.findById(scheduleId);
    return schedule;
  } catch (error) {
    console.error(error);
    return "Error : " + error.message;
  }
};

const readSchedules = async (userId) => {
  try {
    const schedules = await ScheduleDocument.find({userId: userId}).exec();
    return schedules;
  } catch (err) {
    return 500;
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

// Define the update function
async function updateScheduleDocument(scheduleId, updateData) {
  try {
    const {  isOnce, weekDays, hour, minute, events } = updateData;
    // Find the schedule document by ID
    const foundSchedule = await ScheduleDocument.findById(scheduleId);
    if (!foundSchedule) {
      return 'Schedule document not found.';
    }
    foundSchedule.scheduleTime =  {
      isOnce:isOnce,
      weekDays : weekDays,
      hour : hour,
      minute :minute
    }
    foundSchedule.eventList = events;
    // Save the updated document
    const updatedSchedule = await foundSchedule.save();
    // Return the updated document
    return updatedSchedule;
  } catch (error) {
    console.error(error);
    return 'Unable to update schedule document.';
  }
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
    deleteSchedule,
    updateScheduleDocument,
    getScheduleById
 }

module.exports.scheduleModel = mongoose.model('ScheduleDocument', ScheduleDocumentChema);



