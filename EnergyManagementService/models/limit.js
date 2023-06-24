const express = require('express');
const _ = require('lodash');
const mongoose = require('mongoose');
const config = require('config');



mongoose.connect(config.dbAddress)
    .then(() => console.log('Connected to database'))
    .catch(err => console.log('Error ' + err));
const limitSchema = new mongoose.Schema({
    userId:String,
    createDate: Date,
    deviceMac: String,
    deviceName: String,
    maxUsePower: String,
    dimmer: String
});

const Limits = mongoose.model('Limits', limitSchema);


// Create a new limit entry
async function createLimit({ userId,deviceMac, deviceName, maxUsePower, dimmer }) {
  try {
    const limit = new Limits({userId, createDate: Date.now(), deviceMac, deviceName, maxUsePower, dimmer });
    const result = await limit.save();
    return result;
  } catch (error) {
    console.error(error.message);
    return error;
  }
}

// Retrieve all limit entries
async function getAllLimits(userId) {
  try {
    const limits = await Limits.find({userId:userId});
    return limits;
  } catch (error) {
    console.error(error.message);
    return error;
  }
}

// Retrieve a specific limit entry by ID
async function getLimitById(id) {
  try {
    const limit = await Limits.findById(id);
    return limit;
  } catch (error) {
    console.error(error.message);
    return error;
  }
}

// Update a specific limit entry by ID
async function updateLimitById(id, { createDate, deviceMac, deviceName, maxUsePower, dimmer }) {
  try {
    const limit = await Limits.findById(id);
    limit.createDate = createDate;
    limit.deviceMac = deviceMac;
    limit.deviceName = deviceName;
    limit.maxUsePower = maxUsePower;
    limit.dimmer = dimmer;
    const result = await limit.save();
    return result;
  } catch (error) {
    console.error(error.message);
    return error;
  }
}

// Delete a specific limit entry by ID
async function deleteLimitById(id) {
  try {
    const result = await Limits.findByIdAndDelete(id);
    return result;
  } catch (error) {
    console.error(error.message);
    return error;
  }
}



module.exports = {
    createLimit,
    getAllLimits,
    getLimitById,
    updateLimitById,
    deleteLimitById
}