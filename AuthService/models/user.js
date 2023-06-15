const express = require('express');
const _ = require('lodash');
const mongoose = require('mongoose');
const config = require('config');
const request = require('request');

mongoose.connect(config.dbAddress)
    .then(() => console.log('Connected to database'))
    .catch(err => console.log('Error ' + err));

const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name: String,
    phone: String,
    role: String,
    parentId: String,
    activationCode: String,
    activationTTL: Date
});
const User = mongoose.model('User', userSchema);


const createUserAndSendCode = async (phone) => {
    try {
        // Step 1: find user by phone
        const user = await User.findOne({ phone });

        // Step 2 or 3: create activation code, send SMS, and save user
        const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
        const activationTTL = Date.now() + 5 * 60 * 1000; // 5 minutes in milliseconds

        if (!user) {
            // User doesn't exist, create new user
            const newUser = new User({
                phone,
                activationCode,
                activationTTL,
            });
            await newUser.save();
            await sendSms(activationCode, phone);

            return { status: 404, message: 'User does not exist' };
        } else {
            // User exists, update activation code and TTL
            user.activationCode = activationCode;
            user.activationTTL = activationTTL;
            await user.save();
            await sendSms(activationCode, phone);

            return { status: 200, message: 'User exists' };
        }
    } catch (err) {
        console.error(err);
        return { status: 500, message: 'Internal server error' };
    }
};




const authenticateUser = async (phone, activationCode) => {
  try {
    // Step 1: find user by phone
    const user = await User.findOne({ phone });

    if (!user) {
      // User doesn't exist
      return { status: 401, message: 'Invalid activation code or TTL' };
    }

    // Step 2: check activation code and TTL
    if (user.activationCode !== activationCode || new Date() > user.activationTTL) {
      return { status: 401, message: 'Invalid activation code or TTL' };
    }

    // Step 3: generate JWT
    const payload = { userId: user._id, phone };
    const token = jwt.sign(payload, 'process.env.JWT_SECRET');

    return { status: 200, message: 'Success', token };
  } catch (err) {
    console.error(err);
    return { status: 500, message: 'Internal server error' };
  }
};



const sendSms = (message, phone) => {

    request.post({
        url: 'http://ippanel.com/api/select',
        body: {
            "op": "pattern",
            "user": "09928966092",
            "pass": "Faraz@2282094247",
            "fromNum": "3000505",
            "toNum": phone,
            "patternCode": "kc6wd4eitrp9v5d",
            "inputData": [
                { "code": message }
            ]
        },
        json: true,
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            //YOU‌ CAN‌ CHECK‌ THE‌ RESPONSE‌ AND SEE‌ ERROR‌ OR‌ SUCCESS‌ MESSAGE
            console.log(response.body);
        } else {
            console.log("whatever you want");
        }
    });
}
module.exports = {
    createUserAndSendCode,
    authenticateUser
};