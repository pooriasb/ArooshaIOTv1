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
  isBlocked: { type: Boolean, default: false },
  isValid: { type: Boolean, default: false },
  isChild: { type: Boolean, default: false },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const User = mongoose.model('User', userSchema);

const createUserAndSendCode = async (phone, name) => {
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
        name,
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

const createChildUser = async (parentUserId, childPhone,name) => {
  try {
    // Find the parent user by their ID
    const parentUser = await User.findById(parentUserId);
    if(parentUser.phone == childPhone) return {status :400 ,message :'error : child phone must be diffrent from parent phone'};

    // If the parent user does not exist, throw an error
    if (!parentUser) return {status :400 ,message :'error : user not found'};

    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const activationTTL = Date.now() + 5 * 60 * 1000; // 5 minutes in milliseconds
    // Create the child user
    const childUser = new User({
      name : name,
      phone: childPhone,
      activationCode,
      activationTTL,
      settings: {}, // Set empty settings object
      isChild: true,
      parentId: parentUserId,
    });

    // Save the child user and assign it to the parent user
    await childUser.save();
    // parentUser.children.push(childUser);
    // await parentUser.save();
    await sendSms(activationCode, childPhone);
    // Return the created child user
    return {status:200 , message: childUser};
  } catch (err) {
    console.error(err);
    return {status:500 , message: err.message};
  }
};

const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const userData = {
      name: user.name,
      phone: user.phone
    };
    return {
      userData,
      settings: user.settings
    };
  } catch (error) {
    console.error(error);
    throw new Error('Internal Server Error');
  }
}


const getChildren = async (parentId) => {
  try {
    // Step 1: Find the parent user by its ID
    const parentUser = await User.findById(parentId);

    if (!parentUser) {
      // Parent user not found
      return { status: 404, message: 'Parent user not found' };
    }

    // Step 2: Find all the children of the parent user
    const children = await User.find({ parentId: parentId, isChild: true });

    return { status: 200, children };
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
    const token = jwt.sign(payload, process.env.JWTSECKEY_Pooria);

    // Step 4: Update user and set isBlocked to false
    await User.findByIdAndUpdate(user._id, { isValid: true });

    return { status: 200, message: 'Success', token , isChild : user.isChild , name : user.name };
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
async function unblockChild(childId) {
  return User.findByIdAndUpdate(childId, { isBlocked: false });
}

async function deleteChildUser(userId) {
  try {
    // Check if the user exists and is a child
    const user = await User.findById(userId);
    if (!user || !user.isChild) {
      throw new Error('Invalid user or not a child');
    }

    // Delete the user
    await User.findByIdAndDelete(userId);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

function validateJwt(token) {
  try {
    // Verify the JWT token using the secret key
    const decodedToken = jwt.verify(token, process.env.JWTSECKEY_Pooria);

    // Add any additional validation logic here
    const { userId, phone } = decodedToken;

    // Check if the user exists in the database
    const user = User.findById(userId);

    if (!user || user.phone !== phone) {
      console.log('user not find or phone is not valid')
      return false;
    }

    // Return the decoded token
    return true
  } catch (err) {
    // If the token is invalid or has expired
    console.log('error in validate token : '+err.message);
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


const setUserSettings = async (userId, settings) => {
  try {
    // Step 1: Find the user by its ID
    const user = await User.findById(userId);

    if (!user) {
      // User not found
      return { status: 404, message: 'User not found' };
    }

    // Step 2: Update the user's settings
    user.settings = settings;
    await user.save();

    return { status: 200, message: 'User settings updated successfully' };
  } catch (err) {
    console.error(err);
    return { status: 500, message: 'Internal server error' };
  }
};



module.exports = {
  createUserAndSendCode,
  authenticateUser,
  validateJwt,
  decodeJwt,
  createOrUpdateSettings, 
  createChildUser,
  blockChild,
  getChildren,
  setUserSettings,
  getUserById,
  unblockChild,
  deleteChildUser
};