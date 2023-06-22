const express = require('express');
const _ = require('lodash');
const mongoose = require('mongoose');
const config = require('config');
const device = require('./device');
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

    const room = await roomDocument.findOne({ _id: id });
    if (room) {
      const result = await roomDocument.updateOne({ _id: id }, { roomName: newRoomName });
      return result;
    } else {
      return `Error: Room with id ${id} does not exist`;
    }
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
const addDeviceToRoom = async (id, deviceMac, userId) => {
  try {
    const room = await roomDocument.findById(id);
    if (!room) return 'Room not found';

    const deviceExists = room.devices.includes(deviceMac);
    if (deviceExists) return 'Device already added';

    const allRooms = await roomDocument.find({ userId: userId });

    for (let i = 0; i < allRooms.length; i++) {
      const otherRoom = allRooms[i];
      const otherRoomDeviceIndex = otherRoom.devices.indexOf(deviceMac);
      if (otherRoomDeviceIndex !== -1) {
        // remove device from other room
        otherRoom.devices.splice(otherRoomDeviceIndex, 1);
        await otherRoom.save();
      }
    }

    room.devices.push(deviceMac);
    await room.save();

    return 'Added successfully';
  } catch (err) {
    return { error: err.message };
  }
};

// Function to remove a device from the devices array field of the room document with the provided id
const removeDeviceFromRoom = async (id, deviceToRemove) => {
  try {
    const room = await roomDocument.findById(id);
    if (!room) return `Room with ID ${id} not found`;

    const deviceIndex = room.devices.indexOf(deviceToRemove);
    if (deviceIndex === -1) return `${deviceToRemove} not found in the devices of the room`;

    room.devices.splice(deviceIndex, 1);
    await room.save();
    return `Device ${deviceToRemove} removed from room successfully`;
  } catch (error) {
    return `Error: ${error.message}`;
  }
};

const getDevicesInRoomByRoomId = async (roomId, userId) => {
  try {
    const room = await roomDocument.findById(roomId);
    if (!room) return 'Room not found';
    const devices = await Promise.all(room.devices.map(element => device.getDeviceByMac(element)));
    return {
      roomId: room._id,
      roomName: room.roomName,
      devices: devices
    };
  } catch (error) {
    console.error(error);
    return error.message; // You may change the return value to suit your needs
  }
};


module.exports = {
  createRoom,
  getRooms,
  getRoomById,
  updateRoomById,
  deleteRoomById,
  addDeviceToRoom,
  updateRoomName,
  removeDeviceFromRoom,
  getDevicesInRoomByRoomId
};
