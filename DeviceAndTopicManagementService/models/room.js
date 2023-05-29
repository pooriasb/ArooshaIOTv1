const express = require('express');
const _ = require('lodash');
const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.dbAddress)
    .then(() => console.log('Connected to database'))
    .catch(err => console.log('Error ' + err));

const roomSchema = new mongoose.Schema({
    userId: String,
    roomName: String,
    devices: [String]
});
const roomDocument = mongoose.model('rooms', roomSchema);