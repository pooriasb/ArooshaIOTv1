const express = require('express');
const _ = require('lodash');
const mongoose = require('mongoose');
const config = require('config');
const request = require('request');
require('dotenv').config();

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
  activationTTL: Date,
  settings: Object,
  isBlocked: { type: Boolean, default: true },
  isChild: { type: Boolean, default: false },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const User = mongoose.model('User', userSchema);


// const createUserAndSendCode = async (phone) => {
//     try {
//         // Step 1: find user by phone
//         const user = await User.findOne({ phone });

//         // Step 2 or 3: create activation code, send SMS, and save user
//         const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
//         const activationTTL = Date.now() + 5 * 60 * 1000; // 5 minutes in milliseconds

//         if (!user) {
//             // User doesn't exist, create new user
//             const newUser = new User({
//                 phone,
//                 activationCode,
//                 activationTTL,
//             });
//             await newUser.save();
//             await sendSms(activationCode, phone);

//             return { status: 404, message: 'User does not exist' };
//         } else {
//             // User exists, update activation code and TTL
//             user.activationCode = activationCode;
//             user.activationTTL = activationTTL;
//             await user.save();
//             await sendSms(activationCode, phone);

//             return { status: 200, message: 'User exists' };
//         }
//     } catch (err) {
//         console.error(err);
//         return { status: 500, message: 'Internal server error' };
//     }
// };

const createUserAndSendCode = async (phone) => {
  try {
    // Step 1: find user by phone
    const user = await User.findOne({ phone });

    // Step 2 or 3: create activation code, send SMS, and save user
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const activationTTL = Date.now() + 5 * 60 * 1000; // 5 minutes in milliseconds
//Step 3 : if user dont exist then create it and send activation code 
    if (!user) {
      // User doesn't exist, create new user
      const newUser = new User({
        phone,
        activationCode,
        activationTTL,
        settings: {}, // Set empty settings object
        parentId: null, // Set parent ID to null
      });
      await newUser.save();
      await sendSms(activationCode, phone);

      return { status: 200, message: 'Created and Send code' };
    } else {
   
        user.activationCode = activationCode;
        user.activationTTL = activationTTL;
        await user.save();
        await sendSms(activationCode, phone);
        return { status: 200, message: 'User exists sms sent to the phone To Login' };
     
      // User exists, update activation code and TTL
    

     
    }
  } catch (err) {
    console.error(err);
    return { status: 500, message: 'Internal server error' };
  }
};
const createChildUser = async (parentUserId, childPhone) => {
  try {
    // Find the parent user by their ID
    const parentUser = await User.findById(parentUserId);

    // If the parent user does not exist, throw an error
    if (!parentUser) {
      return 'Error Parent user not found';
    }
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const activationTTL = Date.now() + 5 * 60 * 1000; // 5 minutes in milliseconds
    // Create the child user
    const childUser = new User({
      phone: childPhone,
      activationCode,
      activationTTL,
      settings: {}, // Set empty settings object
      isChild: true,
      parentId: parentUserId,
    });

    // Save the child user and assign it to the parent user
    await childUser.save();
    parentUser.children.push(childUser);
    await parentUser.save();
    await sendSms(activationCode, phone);
    // Return the created child user
    return childUser;
  } catch (err) {
    console.error(err);
    return err.message;
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
    const token = jwt.sign(payload, process.env.JWTSECKEY_Pooria);

    // Step 4: Update user and set isBlocked to false
    await User.findByIdAndUpdate(user._id, { isBlocked: false });

    return { status: 200, message: 'Success', token };
  } catch (err) {
    console.error(err);
    return { status: 500, message: 'Internal server error' };
  }
};

module.exports = authenticateUser;



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


async function createOrUpdateSettings(userId, settings) {
  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    // If the user does not exist, throw an error
    if (!user) {
      throw new Error('User not found');
    }

    // Update the settings object with the new values
    user.settings = settings;

    // Save the updated user object
    await user.save();

    // Return the updated user object
    return user;
  } catch (err) {
    // Handle any errors that occur during the process
    console.error(err);
    return null;
  }
}



async function blockChild(childId) {
  return User.findByIdAndUpdate(childId, { isBlocked: true });
}


function validateJwt(token) {
  try {
    // Verify the JWT token using the secret key
    const decodedToken = jwt.verify(token, process.env.JWTSECKEY_Pooria);

    // Add any additional validation logic here

    // Return the decoded token
    return true
  } catch (err) {
    // If the token is invalid or has expired
    return false;
  }
}
function decodeJwt(token) {
  try {
    // Verify the JWT token using the secret key
    const decodedToken = jwt.verify(token, process.env.JWTSECKEY_Pooria);

    // Add any additional validation logic here

    // Return the decoded token
    return decodedToken
  } catch (err) {
    // If the token is invalid or has expired
    console.log(err.message);
    return 0;
  }
}

module.exports = {
  createUserAndSendCode,
  authenticateUser,
  validateJwt,
  decodeJwt,
  createOrUpdateSettings, 
  createChildUser,
  blockChild
};