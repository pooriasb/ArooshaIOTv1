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
    eventList: [{
        deviceId: String,
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
async function deleteSenario(userId, SenarioName) {
  try {
    await Senario.deleteOne({ userId, name: SenarioName });
    console.log(`${SenarioName} deleted successfully`);
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
    updateSenario
 }
module.exports.senarioSchema = Senario;