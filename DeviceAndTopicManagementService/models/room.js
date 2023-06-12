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

// Create a new room document
const createRoom = async (userId, roomName) => {
  try {
    const newRoom = await roomDocument.create({
      userId,
      roomName,
    });
    return newRoom;
  } catch (error) {
    // Replace with appropriate error handling mechanism
    console.error(error);
    throw new Error('Failed to create room');
  }
}

// Read all room documents
const getRooms = async (userId) => {

  try {
    const rooms = await roomDocument.find({ userId: userId }).select('roomName devices');

    return rooms;
  } catch (error) {
    // Replace with appropriate error handling mechanism
    console.error(error);
    throw new Error('Failed to get rooms');
  }
}

// Read a single room document by ID
const getRoomById = async (id) => {
  try {
    const room = await roomDocument.findById(id);
    return room;
  } catch (error) {
    // Replace with appropriate error handling mechanism
    console.error(error);
    throw new Error('Failed to get room by ID');
  }
}

// Update a room document by ID
const updateRoomById = async (id, updates) => {
  try {
    const room = await roomDocument.findByIdAndUpdate(id, updates, { new: true });
    return room;
  } catch (error) {
    // Replace with appropriate error handling mechanism
    console.error(error);
    throw new Error('Failed to update room by ID');
  }
}

const updateRoomName = async (id, newRoomName) => {
  try {
    await roomDocument.updateOne({ _id: id }, { roomName: newRoomName });
    return 'Room name updated successfully!';
  } catch (error) {
    return `Error: ${error.message}`;
  }
};



// Delete a room document by ID
const deleteRoomById = async (id) => {
  try {
    await roomDocument.findByIdAndDelete(id);
    return 'ok';
  } catch (error) {
    // Replace with appropriate error handling mechanism
    console.error(error);
    return 'Failed to delete room by ID';
  }
}
const addDeviceToRoom = async (userId, roomName, deviceMac) => {
  try {

    const room = await roomDocument.findOne({ userId, roomName });
    if (!room) throw new Error('Room not found');

    room.devices.push(deviceMac);
    await room.save();

    return room;
  } catch (err) {
    return { error: err.message };
  }
};


module.exports = {
  createRoom,
  getRooms,
  getRoomById,
  updateRoomById,
  deleteRoomById,
  addDeviceToRoom,
  updateRoomName
};
