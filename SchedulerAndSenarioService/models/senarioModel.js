const express = require('express');
const _ = require('lodash');
const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.dbAddress)
    .then(() => console.log('Connected to database'))
    .catch(err => console.log('Error ' + err));

const senarioSchema = new mongoose.Schema({
    userId: String,
    name: String,
    scheduleCreateDateTime: Date,
    startCount : {type:Number,default:0},
    eventList: [{
        deviceId: String,
        deviceName:String,
        eventId: String
    }]
});

const Senario = mongoose.model('senario', senarioSchema);

async function createSenario(data) {
  const newSenario = new Senario({
    userId: data.userId,
    name: data.name,
    scheduleCreateDateTime: new Date(),
    eventList:data.eventList
  });

  try {
    const senario = await newSenario.save();
    console.log('New Senario created:', senario);
    return "1";
  } catch (err) {
    console.error(err);
    return "0";
  }
}

const increaseStartCount = async (senarioId) => {
  try {
    // Step 1: Find the senario by its ID
    const senario = await Senario.findById(senarioId);

    if (!senario) {
      // Senario not found
      return { status: 404, message: 'Senario not found' };
    }

    // Step 2: Increase the start count by 1
    senario.startCount += 1;

    // Step 3: Save the updated senario
    await senario.save();

    return { status: 200, message: 'Start count increased successfully' };
  } catch (err) {
    console.error(err);
    return { status: 500, message: 'Internal server error' };
  }
};




async function readSenarios(userId) {
  try {
    const senarios = await Senario.find({ userId: userId });
   return senarios;
  } catch (err) {
    console.error(err);
  }
}
async function readSenario(senarioId) {
    try {
      const senario = await Senario.find({ _id: senarioId });
     return senario;
    } catch (err) {
      console.error(err);
    }
  }
async function deleteSenario(senarioId) {
  try {
    await Senario.deleteOne({ _id: senarioId });
    
    return "1";
  } catch (err) {
    console.error(err);
    return "0"
  }
}


async function updateSenario(senarioId, updates) {
  try {
    const senario = await Senario.findByIdAndUpdate(senarioId, updates, { new: true }).exec();
    return senario;
  } catch (error) {
    console.error('Error updating senario:', error.message);
    throw new Error('An error occurred while updating the senario.');
    return 500;
  }
}

module.exports = {
    deleteSenario,
    readSenarios,
    readSenario,
    createSenario,
    updateSenario,
    increaseStartCount
 }
module.exports.senarioSchema = Senario;