const express = require('express');
const _ = require('lodash');
const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
mongoose.connect(config.dbAddress)
    .then(() => console.log('Connected to database'))
    .catch(err => console.log('Error ' + err));

const userSchema = new mongoose.Schema({
    name: String,
    phone: String,
    role:String,
    parentId:String,
    activationCode:String,
    acticationTTL:Date
});
const User = mongoose.model('User', deviceSchema);


