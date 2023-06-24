const express = require('express');
const _ = require('lodash');
const mongoose = require('mongoose');
const config = require('config');
/************************Config database */
mongoose.connect(config.dbAddress)
    .then(() => console.log('Connected to database'))
    .catch(err => console.log('Error ' + err));

const eventListSchema = new mongoose.Schema({
   
});

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
const EventList = mongoose.model('EventList', eventListSchema);


const ScheduleDocument = mongoose.model('ScheduleDocument',ScheduleDocumentChema);

// create test device


/**
 * a schedule document in the database
 * @param {string} userId - The user ID associated with the schedule
 * @param {string} scheduleId - The ID of the schedule to update
 * @param {Object} eventData - The event data to add to the schedule (deviceId, eventId)
 * @returns {Promise<Object>} - The updated schedule document
 */
async function updateSchedule(userId, scheduleId, eventData) {
  // Retrieve the existing schedule document from the database
  const schedule = await ScheduleDocument.findOne({ userId, _id: scheduleId });
  
  // If the schedule doesn't exist, return an error
  if (!schedule) {
    return 404
  }
  
  // Add the new event data to the schedule's eventList
  schedule.eventList.push(eventData);
  
  // Save the updated schedule document to the database
  const updatedSchedule = await schedule.save();
  
  // Return the updated schedule document
  return 200
}

const getScheduleById = async (scheduleId) => {
  try {
    const schedule = await ScheduleDocument.findById(scheduleId);
    return schedule;
  } catch (error) {
    console.error(error);
    // handle error
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
    updateSchedule,
    getScheduleById
 }

module.exports.scheduleModel = mongoose.model('ScheduleDocument', ScheduleDocumentChema);



